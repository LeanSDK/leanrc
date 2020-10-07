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
    var AnyT, CoreObject, FuncG, JoiT, MaybeG, Transform, TransformInterface, joi;
    ({
      JoiT,
      AnyT,
      FuncG,
      MaybeG,
      TransformInterface,
      CoreObject,
      Utils: {joi}
    } = Module.prototype);
    return Transform = (function() {
      class Transform extends CoreObject {};

      Transform.inheritProtected();

      Transform.implements(TransformInterface);

      Transform.module(Module);

      Transform.public(Transform.static({
        schema: JoiT
      }, {
        get: function() {
          return joi.any().allow(null).optional();
        }
      }));

      Transform.public(Transform.static(Transform.async({
        normalize: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      }, {
        default: function*(...args) {
          return this.normalizeSync(...args);
        }
      })));

      Transform.public(Transform.static(Transform.async({
        serialize: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      }, {
        default: function*(...args) {
          return this.serializeSync(...args);
        }
      })));

      Transform.public(Transform.static({
        normalizeSync: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      }, {
        default: function(serialized) {
          if (serialized == null) {
            return null;
          }
          return serialized;
        }
      }));

      Transform.public(Transform.static({
        serializeSync: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      }, {
        default: function(deserialized) {
          if (deserialized == null) {
            return null;
          }
          return deserialized;
        }
      }));

      Transform.public(Transform.static({
        objectize: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      }, {
        default: function(deserialized) {
          if (deserialized == null) {
            return null;
          }
          return deserialized;
        }
      }));

      Transform.public(Transform.static(Transform.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Transform.public(Transform.static(Transform.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Transform.initialize();

      return Transform;

    }).call(this);
  };

}).call(this);
