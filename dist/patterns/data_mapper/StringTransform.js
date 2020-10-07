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
    var CoreObject, FuncG, JoiT, MaybeG, StringTransform, TransformInterface, _, joi;
    ({
      JoiT,
      FuncG,
      MaybeG,
      TransformInterface,
      CoreObject,
      Utils: {_, joi}
    } = Module.prototype);
    return StringTransform = (function() {
      class StringTransform extends CoreObject {};

      StringTransform.inheritProtected();

      StringTransform.implements(TransformInterface);

      StringTransform.module(Module);

      StringTransform.public(StringTransform.static({
        schema: JoiT
      }, {
        get: function() {
          return joi.string().allow(null).optional();
        }
      }));

      StringTransform.public(StringTransform.static(StringTransform.async({
        normalize: FuncG([MaybeG(String)], MaybeG(String))
      }, {
        default: function*(...args) {
          return this.normalizeSync(...args);
        }
      })));

      StringTransform.public(StringTransform.static(StringTransform.async({
        serialize: FuncG([MaybeG(String)], MaybeG(String))
      }, {
        default: function*(...args) {
          return this.serializeSync(...args);
        }
      })));

      StringTransform.public(StringTransform.static({
        normalizeSync: FuncG([MaybeG(String)], MaybeG(String))
      }, {
        default: function(serialized) {
          return (_.isNil(serialized) ? null : String(serialized));
        }
      }));

      StringTransform.public(StringTransform.static({
        serializeSync: FuncG([MaybeG(String)], MaybeG(String))
      }, {
        default: function(deserialized) {
          return (_.isNil(deserialized) ? null : String(deserialized));
        }
      }));

      StringTransform.public(StringTransform.static({
        objectize: FuncG([MaybeG(String)], MaybeG(String))
      }, {
        default: function(deserialized) {
          if (_.isNil(deserialized)) {
            return null;
          } else {
            return String(deserialized);
          }
        }
      }));

      StringTransform.public(StringTransform.static(StringTransform.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      StringTransform.public(StringTransform.static(StringTransform.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      StringTransform.initialize();

      return StringTransform;

    }).call(this);
  };

}).call(this);
