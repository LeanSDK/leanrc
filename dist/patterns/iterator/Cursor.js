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

  // должен имплементировать интерфейс CursorInterface
  // является оберткой над обычным массивом

  // TODO: от Игоря предложение, сделать свойство isClosed
  module.exports = function(Module) {
    var AnyT, CollectionInterface, CoreObject, Cursor, CursorInterface, FuncG, MaybeG, PointerT, _;
    ({
      AnyT,
      PointerT,
      FuncG,
      MaybeG,
      CollectionInterface,
      CursorInterface,
      CoreObject,
      Utils: {_}
    } = Module.prototype);
    return Cursor = (function() {
      var iplArray, ipnCurrentIndex, ipoCollection;

      class Cursor extends CoreObject {};

      Cursor.inheritProtected();

      Cursor.implements(CursorInterface);

      Cursor.module(Module);

      ipnCurrentIndex = PointerT(Cursor.private({
        currentIndex: Number
      }, {
        default: 0
      }));

      iplArray = PointerT(Cursor.private({
        array: AnyT
      }));

      ipoCollection = PointerT(Cursor.private({
        collection: MaybeG(CollectionInterface)
      }));

      Cursor.public({
        isClosed: Boolean
      }, {
        default: false
      });

      Cursor.public({
        setCollection: FuncG(CollectionInterface, CursorInterface)
      }, {
        default: function(aoCollection) {
          this[ipoCollection] = aoCollection;
          return this;
        }
      });

      Cursor.public({
        setIterable: FuncG(AnyT, CursorInterface)
      }, {
        default: function(alArray) {
          this[iplArray] = alArray;
          return this;
        }
      });

      Cursor.public(Cursor.async({
        toArray: FuncG([], Array)
      }, {
        default: function*() {
          var results1;
          results1 = [];
          while ((yield this.hasNext())) {
            results1.push((yield this.next()));
          }
          return results1;
        }
      }));

      Cursor.public(Cursor.async({
        next: FuncG([], MaybeG(AnyT))
      }, {
        default: function*() {
          var data;
          data = (yield Module.prototype.Promise.resolve(this[iplArray][this[ipnCurrentIndex]]));
          this[ipnCurrentIndex]++;
          switch (false) {
            case !(data == null):
              return data;
            case this[ipoCollection] == null:
              return (yield this[ipoCollection].normalize(data));
            default:
              return data;
          }
        }
      }));

      Cursor.public(Cursor.async({
        hasNext: FuncG([], Boolean)
      }, {
        default: function*() {
          return (yield Module.prototype.Promise.resolve(!_.isNil(this[iplArray][this[ipnCurrentIndex]])));
        }
      }));

      Cursor.public(Cursor.async({
        close: Function
      }, {
        default: function*() {
          var i, item, j, len, ref;
          ref = this[iplArray];
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            item = ref[i];
            delete this[iplArray][i];
          }
          delete this[iplArray];
        }
      }));

      Cursor.public(Cursor.async({
        count: FuncG([], Number)
      }, {
        default: function*() {
          var array, ref, ref1;
          array = (ref = this[iplArray]) != null ? ref : [];
          return (yield Module.prototype.Promise.resolve((ref1 = typeof array.length === "function" ? array.length() : void 0) != null ? ref1 : array.length));
        }
      }));

      Cursor.public(Cursor.async({
        forEach: FuncG(Function)
      }, {
        default: function*(lambda) {
          var err, index;
          index = 0;
          try {
            while ((yield this.hasNext())) {
              yield lambda((yield this.next()), index++);
            }
          } catch (error) {
            err = error;
            yield this.close();
            throw err;
          }
        }
      }));

      Cursor.public(Cursor.async({
        map: FuncG(Function, Array)
      }, {
        default: function*(lambda) {
          var err, index, results1;
          index = 0;
          try {
            results1 = [];
            while ((yield this.hasNext())) {
              results1.push((yield lambda((yield this.next()), index++)));
            }
            return results1;
          } catch (error) {
            err = error;
            yield this.close();
            throw err;
          }
        }
      }));

      Cursor.public(Cursor.async({
        filter: FuncG(Function, Array)
      }, {
        default: function*(lambda) {
          var err, index, record, records;
          index = 0;
          records = [];
          try {
            while ((yield this.hasNext())) {
              record = (yield this.next());
              if ((yield lambda(record, index++))) {
                records.push(record);
              }
            }
            return records;
          } catch (error) {
            err = error;
            yield this.close();
            throw err;
          }
        }
      }));

      Cursor.public(Cursor.async({
        find: FuncG(Function, MaybeG(AnyT))
      }, {
        default: function*(lambda) {
          var _record, err, index, record;
          index = 0;
          _record = null;
          try {
            while ((yield this.hasNext())) {
              record = (yield this.next());
              if ((yield lambda(record, index++))) {
                _record = record;
                break;
              }
            }
            return _record;
          } catch (error) {
            err = error;
            yield this.close();
            throw err;
          }
        }
      }));

      Cursor.public(Cursor.async({
        compact: FuncG([], Array)
      }, {
        default: function*() {
          var err, rawResult, result, results;
          results = [];
          try {
            while (this[ipnCurrentIndex] < (yield this.count())) {
              rawResult = this[iplArray][this[ipnCurrentIndex]];
              ++this[ipnCurrentIndex];
              if (!_.isEmpty(rawResult)) {
                result = (yield* (function*() {
                  switch (false) {
                    case this[ipoCollection] == null:
                      return (yield this[ipoCollection].normalize(rawResult));
                    default:
                      return rawResult;
                  }
                }).call(this));
                results.push(result);
              }
            }
            return results;
          } catch (error) {
            err = error;
            yield this.close();
            throw err;
          }
        }
      }));

      Cursor.public(Cursor.async({
        reduce: FuncG([Function, AnyT], AnyT)
      }, {
        default: function*(lambda, initialValue) {
          var _initialValue, err, index;
          try {
            index = 0;
            _initialValue = initialValue;
            while ((yield this.hasNext())) {
              _initialValue = (yield lambda(_initialValue, (yield this.next()), index++));
            }
            return _initialValue;
          } catch (error) {
            err = error;
            yield this.close();
            throw err;
          }
        }
      }));

      Cursor.public(Cursor.async({
        first: FuncG([], MaybeG(AnyT))
      }, {
        default: function*() {
          var err, result;
          try {
            result = (yield this.hasNext()) ? (yield this.next()) : null;
            yield this.close();
            return result;
          } catch (error) {
            err = error;
            yield this.close();
            throw err;
          }
        }
      }));

      Cursor.public(Cursor.static(Cursor.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Cursor.public(Cursor.static(Cursor.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Cursor.public({
        init: FuncG([MaybeG(CollectionInterface), MaybeG(Array)])
      }, {
        default: function(aoCollection = null, alArray = null) {
          this.super(...arguments);
          if (aoCollection != null) {
            this[ipoCollection] = aoCollection;
          }
          this[iplArray] = alArray != null ? alArray : [];
        }
      });

      Cursor.initialize();

      return Cursor;

    }).call(this);
  };

}).call(this);
