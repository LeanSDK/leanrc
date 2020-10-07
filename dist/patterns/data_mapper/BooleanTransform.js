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
    var BooleanTransform, CoreObject, FuncG, JoiT, MaybeG, TransformInterface, UnionG, joi;
    ({
      JoiT,
      FuncG,
      MaybeG,
      UnionG,
      TransformInterface,
      CoreObject,
      Utils: {joi}
    } = Module.prototype);
    return BooleanTransform = (function() {
      class BooleanTransform extends CoreObject {};

      BooleanTransform.inheritProtected();

      BooleanTransform.implements(TransformInterface);

      BooleanTransform.module(Module);

      BooleanTransform.public(BooleanTransform.static({
        schema: JoiT
      }, {
        get: function() {
          return joi.boolean().allow(null).optional();
        }
      }));

      BooleanTransform.public(BooleanTransform.static(BooleanTransform.async({
        normalize: FuncG([MaybeG(UnionG(Boolean, String, Number))], Boolean)
      }, {
        default: function*(...args) {
          return this.normalizeSync(...args);
        }
      })));

      BooleanTransform.public(BooleanTransform.static(BooleanTransform.async({
        serialize: FuncG([MaybeG(UnionG(Boolean, String, Number))], Boolean)
      }, {
        default: function*(...args) {
          return this.serializeSync(...args);
        }
      })));

      BooleanTransform.public(BooleanTransform.static({
        normalizeSync: FuncG([MaybeG(UnionG(Boolean, String, Number))], Boolean)
      }, {
        default: function(serialized) {
          var type;
          type = typeof serialized;
          if (type === "boolean") {
            return serialized;
          } else if (type === "string") {
            return serialized.match(/^true$|^t$|^1$/i) !== null;
          } else if (type === "number") {
            return serialized === 1;
          } else {
            return false;
          }
        }
      }));

      BooleanTransform.public(BooleanTransform.static({
        serializeSync: FuncG([MaybeG(UnionG(Boolean, String, Number))], Boolean)
      }, {
        default: function(deserialized) {
          return Boolean(deserialized);
        }
      }));

      BooleanTransform.public(BooleanTransform.static({
        objectize: FuncG([MaybeG(UnionG(Boolean, String, Number))], Boolean)
      }, {
        default: function(deserialized) {
          return Boolean(deserialized);
        }
      }));

      BooleanTransform.public(BooleanTransform.static(BooleanTransform.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      BooleanTransform.public(BooleanTransform.static(BooleanTransform.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      BooleanTransform.initialize();

      return BooleanTransform;

    }).call(this);
  };

}).call(this);
