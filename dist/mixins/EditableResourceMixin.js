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
    return Module.defineMixin(Mixin('EditableResourceMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.beforeHook('protectEditable', {
          only: ['create', 'update', 'delete']
        });

        _Class.beforeHook('setCurrentUserOnCreate', {
          only: ['create']
        });

        _Class.beforeHook('setCurrentUserOnUpdate', {
          only: ['update']
        });

        _Class.beforeHook('setCurrentUserOnDelete', {
          only: ['delete']
        });

        _Class.public(_Class.async({
          setCurrentUserOnCreate: Function
        }, {
          default: function*(...args) {
            var ref;
            this.recordBody.creatorId = (ref = this.session.uid) != null ? ref : null;
            this.recordBody.editorId = this.recordBody.creatorId;
            return args;
          }
        }));

        _Class.public(_Class.async({
          setCurrentUserOnUpdate: Function
        }, {
          default: function*(...args) {
            var ref;
            this.recordBody.editorId = (ref = this.session.uid) != null ? ref : null;
            return args;
          }
        }));

        _Class.public(_Class.async({
          setCurrentUserOnDelete: Function
        }, {
          default: function*(...args) {
            var ref;
            this.recordBody.editorId = (ref = this.session.uid) != null ? ref : null;
            this.recordBody.removerId = this.recordBody.editorId;
            return args;
          }
        }));

        _Class.public(_Class.async({
          protectEditable: Function
        }, {
          default: function*(...args) {
            this.recordBody = _.omit(this.recordBody, ['creatorId', 'editorId', 'removerId']);
            return args;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
