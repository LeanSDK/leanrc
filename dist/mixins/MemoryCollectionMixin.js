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
    var Collection, CursorInterface, DictG, FuncG, ListG, MaybeG, Mixin, PointerT, RecordInterface, UnionG, _, inflect, uuid;
    ({
      PointerT,
      FuncG,
      UnionG,
      ListG,
      DictG,
      MaybeG,
      RecordInterface,
      CursorInterface,
      Collection,
      Mixin,
      Utils: {_, inflect, uuid}
    } = Module.prototype);
    return Module.defineMixin(Mixin('MemoryCollectionMixin', function(BaseClass = Collection) {
      return (function() {
        var _Class, ipoCollection;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        ipoCollection = PointerT(_Class.protected({
          collection: DictG(UnionG(String, Number), MaybeG(Object))
        }));

        _Class.public({
          onRegister: Function
        }, {
          default: function(...args) {
            this.super(...args);
            this[ipoCollection] = {};
          }
        });

        _Class.public(_Class.async({
          push: FuncG(RecordInterface, RecordInterface)
        }, {
          default: function*(aoRecord) {
            var vsKey;
            vsKey = aoRecord.id;
            if (vsKey == null) {
              return false;
            }
            this[ipoCollection][vsKey] = (yield this.serializer.serialize(aoRecord));
            return (yield Module.prototype.Cursor.new(this, [this[ipoCollection][vsKey]]).first());
          }
        }));

        _Class.public(_Class.async({
          remove: FuncG([UnionG(String, Number)])
        }, {
          default: function*(id) {
            delete this[ipoCollection][id];
          }
        }));

        _Class.public(_Class.async({
          take: FuncG([UnionG(String, Number)], MaybeG(RecordInterface))
        }, {
          default: function*(id) {
            return (yield Module.prototype.Cursor.new(this, [this[ipoCollection][id]]).first());
          }
        }));

        _Class.public(_Class.async({
          takeMany: FuncG([ListG(UnionG(String, Number))], CursorInterface)
        }, {
          default: function*(ids) {
            return Module.prototype.Cursor.new(this, ids.map((id) => {
              return this[ipoCollection][id];
            }));
          }
        }));

        _Class.public(_Class.async({
          takeAll: FuncG([], CursorInterface)
        }, {
          default: function*() {
            return Module.prototype.Cursor.new(this, _.values(this[ipoCollection]));
          }
        }));

        _Class.public(_Class.async({
          override: FuncG([UnionG(String, Number), RecordInterface], RecordInterface)
        }, {
          default: function*(id, aoRecord) {
            this[ipoCollection][id] = (yield this.serializer.serialize(aoRecord));
            return (yield Module.prototype.Cursor.new(this, [this[ipoCollection][id]]).first());
          }
        }));

        _Class.public(_Class.async({
          includes: FuncG([UnionG(String, Number)], Boolean)
        }, {
          default: function*(id) {
            return this[ipoCollection][id] != null;
          }
        }));

        _Class.public(_Class.async({
          length: FuncG([], Number)
        }, {
          default: function*() {
            return Object.keys(this[ipoCollection]).length;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
