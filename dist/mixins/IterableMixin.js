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
  // если необходимы методы для работы с collection как с итерируемым объектом
  module.exports = function(Module) {
    var AnyT, Collection, FuncG, IterableInterface, Mixin;
    ({AnyT, FuncG, IterableInterface, Collection, Mixin} = Module.prototype);
    return Module.defineMixin(Mixin('IterableMixin', function(BaseClass = Collection) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.implements(IterableInterface);

        _Class.public(_Class.async({
          forEach: FuncG(Function)
        }, {
          default: function*(lambda) {
            var cursor;
            cursor = (yield this.takeAll());
            yield cursor.forEach(function*(item) {
              return (yield lambda(item));
            });
          }
        }));

        _Class.public(_Class.async({
          filter: FuncG(Function, Array)
        }, {
          default: function*(lambda) {
            var cursor;
            cursor = (yield this.takeAll());
            return (yield cursor.filter(function*(item) {
              return (yield lambda(item));
            }));
          }
        }));

        _Class.public(_Class.async({
          map: FuncG(Function, Array)
        }, {
          default: function*(lambda) {
            var cursor;
            cursor = (yield this.takeAll());
            return (yield cursor.map(function*(item) {
              return (yield lambda(item));
            }));
          }
        }));

        _Class.public(_Class.async({
          reduce: FuncG([Function, AnyT], AnyT)
        }, {
          default: function*(lambda, initialValue) {
            var cursor;
            cursor = (yield this.takeAll());
            return (yield cursor.reduce((function*(prev, item) {
              return (yield lambda(prev, item));
            }), initialValue));
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
