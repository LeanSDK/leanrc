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
    var Mixin, Resource, _, joi, moment;
    ({
      Resource,
      Mixin,
      Utils: {_, joi, moment}
    } = Module.prototype);
    return Module.defineMixin(Mixin('BulkMethodsResourceMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.chains(['bulkDelete', 'bulkDestroy']);

        _Class.beforeHook('getQuery', {
          only: ['bulkDelete', 'bulkDestroy']
        });

        _Class.action(_Class.async({
          bulkDelete: Function
        }, {
          default: function*() {
            var deletedAt, receivedQuery, ref, removerId;
            receivedQuery = _.pick(this.listQuery, ['$filter']);
            if (!receivedQuery.$filter) {
              this.context.throw(400, 'ValidationError: `$filter` must be defined');
            }
            (() => {
              var error;
              ({error} = joi.validate(receivedQuery.$filter, joi.object()));
              if (error != null) {
                return this.context.throw(400, 'ValidationError: `$filter` must be an object', error.stack);
              }
            })();
            deletedAt = moment().utc().toISOString();
            removerId = (ref = this.session.uid) != null ? ref : 'system';
            yield this.collection.delay(this.facade).bulkDelete(JSON.stringify({
              deletedAt,
              removerId,
              filter: receivedQuery.$filter
            }));
            this.context.status = 204;
          }
        }));

        _Class.action(_Class.async({
          bulkDestroy: Function
        }, {
          default: function*() {
            var receivedQuery;
            receivedQuery = _.pick(this.listQuery, ['$filter']);
            if (!receivedQuery.$filter) {
              this.context.throw(400, 'ValidationError: `$filter` must be defined');
            }
            (() => {
              var error;
              ({error} = joi.validate(receivedQuery.$filter, joi.object()));
              if (error != null) {
                return this.context.throw(400, 'ValidationError: `$filter` must be an object', error.stack);
              }
            })();
            yield this.collection.delay(this.facade).bulkDestroy(JSON.stringify({
              filter: receivedQuery.$filter
            }));
            this.context.status = 204;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
