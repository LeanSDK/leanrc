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
  var hasProp = {}.hasOwnProperty;

  module.exports = function(Module) {
    var AnyT, AsyncFunctionT, EnumG, FuncG, InterfaceG, ListG, MaybeG, Migration, Mixin, UnionG, _, inflect;
    ({
      AnyT,
      AsyncFunctionT,
      FuncG,
      ListG,
      EnumG,
      MaybeG,
      UnionG,
      InterfaceG,
      Migration,
      Mixin,
      Utils: {_, inflect}
    } = Module.prototype);
    return Module.defineMixin(Mixin('MemoryMigrationMixin', function(BaseClass = Migration) {
      return (function() {
        var DOWN, SUPPORTED_TYPES, UP, _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        ({UP, DOWN, SUPPORTED_TYPES} = _Class.prototype);

        _Class.public(_Class.async({
          createCollection: FuncG([String, MaybeG(Object)])
        }, {
          default: function*(name, options) {}
        }));

        _Class.public(_Class.async({
          createEdgeCollection: FuncG([String, String, MaybeG(Object)])
        }, {
          default: function*(collection_1, collection_2, options) {}
        }));

        _Class.public(_Class.async({
          addField: FuncG([
            String,
            String,
            UnionG(EnumG(SUPPORTED_TYPES),
            InterfaceG({
              type: EnumG(SUPPORTED_TYPES),
              default: AnyT
            }))
          ])
        }, {
          default: function*(collection_name, field_name, options) {
            var collectionName, doc, id, initial, ipoCollection, memCollection, ref;
            if (_.isString(options)) {
              return;
            }
            collectionName = `${inflect.camelize(collection_name)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            if (options.default != null) {
              if (_.isNumber(options.default) || _.isBoolean(options.default)) {
                initial = options.default;
              } else if (_.isDate(options.default)) {
                initial = options.default.toISOString();
              } else if (_.isString(options.default)) {
                initial = `${options.default}`;
              } else {
                initial = null;
              }
            } else {
              initial = null;
            }
            ref = memCollection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              if (doc[field_name] == null) {
                doc[field_name] = initial;
              }
            }
          }
        }));

        _Class.public(_Class.async({
          addIndex: FuncG([
            String,
            ListG(String),
            InterfaceG({
              type: EnumG('hash',
            'skiplist',
            'persistent',
            'geo',
            'fulltext'),
              unique: MaybeG(Boolean),
              sparse: MaybeG(Boolean)
            })
          ])
        }, {
          default: function*(collection_name, field_names, options) {}
        }));

        _Class.public(_Class.async({
          addTimestamps: FuncG([String, MaybeG(Object)])
        }, {
          default: function*(collection_name, options = {}) {
            var collectionName, doc, id, ipoCollection, memCollection, ref;
            collectionName = `${inflect.camelize(collection_name)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            ref = memCollection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              if (doc.createdAt == null) {
                doc.createdAt = null;
              }
              if (doc.updatedAt == null) {
                doc.updatedAt = null;
              }
              if (doc.deletedAt == null) {
                doc.deletedAt = null;
              }
            }
          }
        }));

        _Class.public(_Class.async({
          changeCollection: FuncG([String, Object])
        }, {
          default: function*(name, options) {}
        }));

        _Class.public(_Class.async({
          changeField: FuncG([
            String,
            String,
            UnionG(EnumG(SUPPORTED_TYPES),
            InterfaceG({
              type: EnumG(SUPPORTED_TYPES)
            }))
          ])
        }, {
          default: function*(collection_name, field_name, options = {}) {
            var array, binary, boolean, collectionName, date, datetime, decimal, doc, float, hash, id, integer, ipoCollection, json, memCollection, number, primary_key, ref, string, text, time, timestamp, type;
            ({json, binary, boolean, date, datetime, number, decimal, float, integer, primary_key, string, text, time, timestamp, array, hash} = Module.prototype.Migration.prototype.SUPPORTED_TYPES);
            collectionName = `${inflect.camelize(collection_name)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            type = _.isString(options) ? options : options.type;
            ref = memCollection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              switch (type) {
                case boolean:
                  doc[field_name] = Boolean(doc[field_name]);
                  break;
                case decimal:
                case float:
                case integer:
                case number:
                  doc[field_name] = Number(doc[field_name]);
                  break;
                case string:
                case text:
                case primary_key:
                case binary:
                  doc[field_name] = String(JSON.stringify(doc[field_name]));
                  break;
                case json:
                case hash:
                case array:
                  doc[field_name] = JSON.parse(String(doc[field_name]));
                  break;
                case date:
                case datetime:
                  doc[field_name] = new Date(String(doc[field_name])).toISOString();
                  break;
                case time:
                case timestamp:
                  doc[field_name] = new Date(String(doc[field_name])).getTime();
              }
            }
          }
        }));

        _Class.public(_Class.async({
          renameField: FuncG([String, String, String])
        }, {
          default: function*(collection_name, field_name, new_field_name) {
            var collectionName, doc, id, ipoCollection, memCollection, ref;
            collectionName = `${inflect.camelize(collection_name)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            ref = memCollection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              doc[new_field_name] = doc[field_name];
              delete doc[field_name];
            }
          }
        }));

        _Class.public(_Class.async({
          renameIndex: FuncG([String, String, String])
        }, {
          default: function*(collection_name, old_name, new_name) {}
        }));

        _Class.public(_Class.async({
          renameCollection: FuncG([String, String])
        }, {
          default: function*(collection_name, new_name) {}
        }));

        _Class.public(_Class.async({
          dropCollection: FuncG(String)
        }, {
          default: function*(collection_name) {
            var collectionName, doc, id, ipoCollection, memCollection, ref;
            collectionName = `${inflect.camelize(collection_name)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            ref = this.collection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              delete memCollection[ipoCollection][id];
            }
            memCollection[ipoCollection] = {};
          }
        }));

        _Class.public(_Class.async({
          dropEdgeCollection: FuncG([String, String])
        }, {
          default: function*(collection_1, collection_2) {
            var collectionName, doc, id, ipoCollection, memCollection, qualifiedName, ref;
            qualifiedName = `${collection_1}_${collection_2}`;
            collectionName = `${inflect.camelize(qualifiedName)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            ref = this.collection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              delete memCollection[ipoCollection][id];
            }
            memCollection[ipoCollection] = {};
          }
        }));

        _Class.public(_Class.async({
          removeField: FuncG([String, String])
        }, {
          default: function*(collection_name, field_name) {
            var collectionName, doc, id, ipoCollection, memCollection, ref;
            collectionName = `${inflect.camelize(collection_name)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            ref = memCollection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              delete doc[field_name];
            }
          }
        }));

        _Class.public(_Class.async({
          removeIndex: FuncG([
            String,
            ListG(String),
            InterfaceG({
              type: EnumG('hash',
            'skiplist',
            'persistent',
            'geo',
            'fulltext'),
              unique: MaybeG(Boolean),
              sparse: MaybeG(Boolean)
            })
          ])
        }, {
          default: function*(collection_name, field_names, options) {}
        }));

        _Class.public(_Class.async({
          removeTimestamps: FuncG([String, MaybeG(Object)])
        }, {
          default: function*(collection_name, options = {}) {
            var collectionName, doc, id, ipoCollection, memCollection, ref;
            collectionName = `${inflect.camelize(collection_name)}Collection`;
            memCollection = this.collection.facade.retrieveProxy(collectionName);
            ipoCollection = Symbol.for('~collection');
            ref = memCollection[ipoCollection];
            for (id in ref) {
              if (!hasProp.call(ref, id)) continue;
              doc = ref[id];
              delete doc.createdAt;
              delete doc.updatedAt;
              delete doc.deletedAt;
            }
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
