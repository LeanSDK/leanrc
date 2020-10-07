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
  var slice = [].slice;

  module.exports = function(Module) {
    var FuncG, HTTP_NOT_FOUND, Mixin, PromiseT, RecordInterface, Resource, SESSIONS, UNAUTHORIZED, USERS, _, co, statuses;
    ({
      SESSIONS,
      USERS,
      PromiseT,
      FuncG,
      RecordInterface,
      Resource,
      Mixin,
      Utils: {_, statuses, co}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    UNAUTHORIZED = statuses('unauthorized');
    return Module.defineMixin(Mixin('ModelingResourceMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          namespace: String
        }, {
          default: 'modeling'
        });

        _Class.public({
          currentSpaceId: String
        }, {
          default: '_internal'
        });

        _Class.public({
          needsLimitation: Boolean
        }, {
          default: false
        });

        _Class.public({
          session: RecordInterface
        });

        _Class.public({
          currentUser: PromiseT
        }, {
          get: co.wrap(function*() {
            return (yield this.facade.retrieveProxy(USERS).find('system'));
          })
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

        _Class.public({
          checkHeader: FuncG([], Boolean)
        }, {
          default: function() {
            var apiKey, authHeader, key, ref, ref1;
            ({apiKey} = this.configs);
            ({
              authorization: authHeader
            } = this.context.headers);
            if (authHeader == null) {
              return false;
            }
            ref1 = (ref = /^Bearer\s+(.+)$/.exec(authHeader)) != null ? ref : [], [key] = slice.call(ref1, -1);
            if (key == null) {
              return false;
            }
            return apiKey === key;
          }
        });

        _Class.public(_Class.async({
          makeSession: Function
        }, {
          default: function*() {
            var SessionsCollection, session;
            SessionsCollection = this.facade.retrieveProxy(SESSIONS);
            if (this.checkHeader()) {
              session = (yield SessionsCollection.build({
                uid: 'system'
              }));
            }
            if (session == null) {
              session = (yield SessionsCollection.build({}));
            }
            this.session = session;
          }
        }));

        _Class.public(_Class.async({
          systemOnly: Function
        }, {
          default: function*(...args) {
            yield this.makeSession();
            if (this.session.uid == null) {
              this.context.throw(UNAUTHORIZED);
              return;
            }
            // UsersCollection = @facade.retrieveProxy USERS
            // currentUser = yield UsersCollection.build
            //   id: 'system'
            //   handle: 'system'
            //   email: 'system@leanrc.com'
            //   firstName: 'Owner'
            //   lastName: 'System'
            //   role: 'admin'
            //   accepted:                       yes
            //   verified:                       yes
            //   ownerId: 'system'
            //   inviterId: 'admin'
            // @currentUser = currentUser
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

        _Class.public({
          getRecordId: Function
        }, {
          default: function(...args) {
            this.super(...args);
            if (this.recordId == null) {
              this.recordId = this.context.pathParams[`modeling_${this.keyName}`];
            }
            return args;
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
