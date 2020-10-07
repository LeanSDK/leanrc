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
  module.exports = function(Module) {
    var HTTP_NOT_FOUND, Mixin, Resource, _, statuses;
    ({
      Resource,
      Mixin,
      Utils: {_, statuses}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    return Module.defineMixin(Mixin('GuestingResourceMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          namespace: String
        }, {
          default: 'guesting'
        });

        _Class.public({
          currentSpaceId: String
        }, {
          default: '_external'
        });

        _Class.beforeHook('limitByExternalSpace', {
          only: ['list']
        });

        _Class.public(_Class.async({
          limitByExternalSpace: Function
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

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
