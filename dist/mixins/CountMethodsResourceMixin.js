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
    var FuncG, Mixin, Query, Resource, _, joi;
    ({
      FuncG,
      Resource,
      Query,
      Mixin,
      Utils: {_, joi}
    } = Module.prototype);
    return Module.defineMixin(Mixin('CountMethodsResourceMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.chains(['count', 'length']);

        _Class.beforeHook('getQuery', {
          only: ['count', 'length']
        });

        _Class.action(_Class.async({
          count: FuncG([], Number)
        }, {
          default: function*() {
            var receivedQuery, voQuery;
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
            voQuery = Query.new().forIn({
              '@doc': this.collection.collectionFullName()
            }).filter(receivedQuery.$filter).count('@doc');
            return (yield ((yield this.collection.query(voQuery))).first());
          }
        }));

        _Class.action(_Class.async({
          length: FuncG([], Number)
        }, {
          default: function*() {
            return (yield this.collection.length());
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
