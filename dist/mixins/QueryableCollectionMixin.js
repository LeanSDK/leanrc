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

  // миксин подмешивается к классам унаследованным от Module::Collection
  // если необходимо реализовать работу методов с использованием абстрактного платформонезависимого класса Module::Query
  // т.о. миксин с реальным платформозависимым кодом для подмешивания в наследников
  // Module::Collection должен содержать только реализации 2-х методов:
  // `parseQuery` и `executeQuery`
  module.exports = function(Module) {
    var Collection, CursorInterface, FuncG, MaybeG, Mixin, QueryInterface, QueryableCollectionInterface, UnionG, _, co;
    ({
      FuncG,
      UnionG,
      MaybeG,
      QueryInterface,
      CursorInterface,
      QueryableCollectionInterface,
      Collection,
      Mixin,
      Utils: {co, _}
    } = Module.prototype);
    return Module.defineMixin(Mixin('QueryableCollectionMixin', function(BaseClass = Collection) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.implements(QueryableCollectionInterface);

        _Class.public(_Class.async({
          findBy: FuncG([Object, MaybeG(Object)], CursorInterface)
        }, {
          default: function*(query, options = {}) {
            return (yield this.takeBy(query, options));
          }
        }));

        _Class.public(_Class.async({
          takeBy: FuncG([Object, MaybeG(Object)], CursorInterface)
        }, {
          default: function*() {
            throw new Error('Not implemented specific method');
          }
        }));

        _Class.public(_Class.async({
          deleteBy: FuncG(Object)
        }, {
          default: function*(query) {
            var voRecordsCursor;
            voRecordsCursor = (yield this.takeBy(query));
            yield voRecordsCursor.forEach(co.wrap(function*(aoRecord) {
              return (yield aoRecord.delete());
            }));
          }
        }));

        _Class.public(_Class.async({
          destroyBy: FuncG(Object)
        }, {
          default: function*(query) {
            var voRecordsCursor;
            voRecordsCursor = (yield this.takeBy(query));
            yield voRecordsCursor.forEach(co.wrap(function*(aoRecord) {
              return (yield aoRecord.destroy());
            }));
          }
        }));

        _Class.public(_Class.async({
          removeBy: FuncG(Object)
        }, {
          default: function*(query) {
            var voQuery;
            voQuery = Module.prototype.Query.new().forIn({
              '@doc': this.collectionFullName()
            }).filter(query).remove('@doc').into(this.collectionFullName());
            yield this.query(voQuery);
          }
        }));

        _Class.public(_Class.async({
          updateBy: FuncG([Object, Object])
        }, {
          default: function*(query, properties) {
            var voRecordsCursor;
            voRecordsCursor = (yield this.takeBy(query));
            yield voRecordsCursor.forEach(co.wrap(function*(aoRecord) {
              return (yield aoRecord.updateAttributes(properties));
            }));
          }
        }));

        _Class.public(_Class.async({
          patchBy: FuncG([Object, Object])
        }, {
          default: function*(query, properties) {
            var voQuery;
            voQuery = Module.prototype.Query.new().forIn({
              '@doc': this.collectionFullName()
            }).filter(query).patch(properties).into(this.collectionFullName());
            yield this.query(voQuery);
          }
        }));

        _Class.public(_Class.async({
          exists: FuncG(Object, Boolean)
        }, {
          default: function*(query) {
            var cursor, voQuery;
            voQuery = Module.prototype.Query.new().forIn({
              '@doc': this.collectionFullName()
            }).filter(query).limit(1).return('@doc');
            cursor = (yield this.query(voQuery));
            return (yield cursor.hasNext());
          }
        }));

        _Class.public(_Class.async({
          query: FuncG([UnionG(Object, QueryInterface)], CursorInterface)
        }, {
          default: function*(aoQuery) {
            var voQuery;
            if (_.isPlainObject(aoQuery)) {
              aoQuery = _.pick(aoQuery, Object.keys(aoQuery).filter(function(key) {
                return aoQuery[key] != null;
              }));
              voQuery = Module.prototype.Query.new(aoQuery);
            } else {
              voQuery = aoQuery;
            }
            return (yield this.executeQuery((yield this.parseQuery(voQuery))));
          }
        }));

        _Class.public(_Class.async({
          parseQuery: FuncG([UnionG(Object, QueryInterface)], UnionG(Object, String, QueryInterface))
        }, {
          default: function*() {
            throw new Error('Not implemented specific method');
          }
        }));

        _Class.public(_Class.async({
          executeQuery: FuncG([UnionG(Object, String, QueryInterface)], CursorInterface)
        }, {
          default: function*() {
            throw new Error('Not implemented specific method');
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
