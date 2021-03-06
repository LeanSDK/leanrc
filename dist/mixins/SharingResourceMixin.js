(function() {
  // This file is part of LeanRC.

  // LeanRC is free software: you can redistribute it and/or modify
  // it under the terms of the GNU Lesser General Public License as published by
  // the Free Software Foundation, either version 3 of the License, or
  // (at your option) any later version.

  // LeanRC is distributed in the hope that it will be useful,
  // but WITHOUT ANY WARRANTY; without even the implied warranty of
  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  // GNU Lesser General Public License for more details.

  // You should have received a copy of the GNU Lesser General Public License
  // along with LeanRC.  If not, see <https://www.gnu.org/licenses/>.
  var indexOf = [].indexOf;

  module.exports = function(Module) {
    var FORBIDDEN, FuncG, HTTP_NOT_FOUND, MaybeG, Mixin, PointerT, PromiseT, ROLES, Resource, SPACES, UNAUTHORIZED, _, co, statuses;
    ({
      SPACES,
      ROLES,
      PromiseT,
      PointerT,
      FuncG,
      MaybeG,
      Resource,
      Mixin,
      Utils: {_, statuses, co}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    UNAUTHORIZED = statuses('unauthorized');
    FORBIDDEN = statuses('forbidden');
    return Module.defineMixin(Mixin('SharingResourceMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class, checkPermission, ipoCheckOwner, ipoCheckPermission, ipoCheckRole;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          namespace: String
        }, {
          default: 'sharing'
        });

        _Class.public({
          currentSpaceId: String
        }, {
          get: function() {
            return this.context.pathParams.space;
          }
        });

        _Class.public({
          currentSpace: PromiseT
        }, {
          get: co.wrap(function*() {
            return (yield this.facade.retrieveProxy(SPACES).find(this.currentSpaceId));
          })
        });

        _Class.beforeHook('limitBySpace', {
          only: ['list']
        });

        _Class.beforeHook('setSpaces', {
          only: ['create']
        });

        _Class.beforeHook('setOwnerId', {
          only: ['create']
        });

        _Class.beforeHook('protectSpaces', {
          only: ['update']
        });

        _Class.beforeHook('protectOwnerId', {
          only: ['update']
        });

        _Class.public(_Class.async({
          limitBySpace: Function
        }, {
          default: function*(...args) {
            if (this.listQuery == null) {
              this.listQuery = {};
            }
            if (this.listQuery.$filter != null) {
              this.listQuery.$filter = {
                $and: [
                  this.listQuery.$filter,
                  {
                    '@doc.spaces': {
                      $all: [this.currentSpaceId]
                    }
                  }
                ]
              };
            } else {
              this.listQuery.$filter = {
                '@doc.spaces': {
                  $all: [this.currentSpaceId]
                }
              };
            }
            return args;
          }
        }));

        _Class.public(_Class.async({
          checkExistence: Function
        }, {
          default: function*(...args) {
            if (this.recordId == null) {
              this.context.throw(HTTP_NOT_FOUND);
            }
            if (!((yield this.collection.exists({
              '@doc.id': {
                $eq: this.recordId
              },
              '@doc.spaces': {
                $all: [this.currentSpaceId]
              }
            })))) {
              this.context.throw(HTTP_NOT_FOUND);
            }
            return args;
          }
        }));

        _Class.public(_Class.async({
          setOwnerId: Function
        }, {
          default: function*(...args) {
            this.recordBody.ownerId = 'system';
            return args;
          }
        }));

        _Class.public(_Class.async({
          setSpaces: Function
        }, {
          default: function*(...args) {
            var base;
            if ((base = this.recordBody).spaces == null) {
              base.spaces = [];
            }
            if (!_.includes(this.recordBody.spaces, '_internal')) {
              this.recordBody.spaces.push('_internal');
            }
            if (!_.includes(this.recordBody.spaces, this.session.userSpaceId)) {
              this.recordBody.spaces.push(this.session.userSpaceId);
            }
            if (!_.includes(this.recordBody.spaces, this.currentSpaceId)) {
              this.recordBody.spaces.push(this.currentSpaceId);
            }
            return args;
          }
        }));

        _Class.public(_Class.async({
          protectSpaces: Function
        }, {
          default: function*(...args) {
            this.recordBody = _.omit(this.recordBody, ['spaces']);
            return args;
          }
        }));

        ipoCheckOwner = PointerT(_Class.private(_Class.async({
          checkOwner: FuncG(String, Boolean)
        }, {
          default: function*(userId) {
            var ref;
            return ref = this.currentSpaceId, indexOf.call(this.session.ownSpaces, ref) >= 0;
          }
        })));

        ipoCheckRole = PointerT(_Class.private(_Class.async({
          checkRole: FuncG([String, String, String], Boolean)
        }, {
          default: function*(spaceId, userId, action) {
            var RolesCollection, ref, ref1, resourceKey, role, rules;
            RolesCollection = this.facade.retrieveProxy(ROLES);
            role = (yield ((yield RolesCollection.findBy({
              spaceUser: {spaceId, userId}
            }))).first());
            resourceKey = `${this.Module.name}::${this.constructor.name}`;
            if (role == null) {
              return false;
            }
            ({rules} = role);
            if ((rules == null) && (role.getRules != null)) {
              rules = (yield role.getRules());
            }
            if (rules != null ? (ref = rules['moderator']) != null ? ref[resourceKey] : void 0 : void 0) {
              return true;
            } else if (rules != null ? (ref1 = rules[resourceKey]) != null ? ref1[action] : void 0 : void 0) {
              return true;
            } else {
              return false;
            }
          }
        })));

        ipoCheckPermission = PointerT(_Class.private(_Class.async({
          checkPermission: FuncG([String, String], MaybeG(Boolean))
        }, {
          default: function*(spaceId, chainName) {
            if ((yield this[ipoCheckOwner](this.session.uid))) {
              return true;
            } else if ((yield this[ipoCheckRole](spaceId, this.session.uid, chainName))) {
              return true;
            } else {
              this.context.throw(FORBIDDEN, "Current user has no access");
            }
          }
        })));

        _Class.public(_Class.async({
          checkPermission: Function
        }, {
          default: checkPermission = function*(...args) {
            var chainName;
            ({chainName} = checkPermission.wrapper);
            // SpacesCollection = @facade.retrieveProxy SPACES
            // try
            //   @space = yield SpacesCollection.find spaceId
            // unless @space?
            //   @context.throw FORBIDDEN, "Current user has no access"
            if (this.session.userIsAdmin) {
              return args;
            }
            yield this[ipoCheckPermission](this.currentSpaceId, chainName);
            return args;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
