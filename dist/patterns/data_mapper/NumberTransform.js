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
    var CoreObject, FuncG, JoiT, MaybeG, NumberTransform, TransformInterface, _, joi;
    ({
      JoiT,
      FuncG,
      MaybeG,
      TransformInterface,
      CoreObject,
      Utils: {_, joi}
    } = Module.prototype);
    return NumberTransform = (function() {
      class NumberTransform extends CoreObject {};

      NumberTransform.inheritProtected();

      NumberTransform.implements(TransformInterface);

      NumberTransform.module(Module);

      NumberTransform.public(NumberTransform.static({
        schema: JoiT
      }, {
        get: function() {
          return joi.number().allow(null).optional();
        }
      }));

      NumberTransform.public(NumberTransform.static(NumberTransform.async({
        normalize: FuncG([MaybeG(Number)], MaybeG(Number))
      }, {
        default: function*(...args) {
          return this.normalizeSync(...args);
        }
      })));

      NumberTransform.public(NumberTransform.static(NumberTransform.async({
        serialize: FuncG([MaybeG(Number)], MaybeG(Number))
      }, {
        default: function*(...args) {
          return this.serializeSync(...args);
        }
      })));

      NumberTransform.public(NumberTransform.static({
        normalizeSync: FuncG([MaybeG(Number)], MaybeG(Number))
      }, {
        default: function(serialized) {
          var transformed;
          if (_.isNil(serialized)) {
            return null;
          } else {
            transformed = Number(serialized);
            return (_.isNumber(transformed) ? transformed : null);
          }
        }
      }));

      NumberTransform.public(NumberTransform.static({
        serializeSync: FuncG([MaybeG(Number)], MaybeG(Number))
      }, {
        default: function(deserialized) {
          var transformed;
          if (_.isNil(deserialized)) {
            return null;
          } else {
            transformed = Number(deserialized);
            return (_.isNumber(transformed) ? transformed : null);
          }
        }
      }));

      NumberTransform.public(NumberTransform.static({
        objectize: FuncG([MaybeG(Number)], MaybeG(Number))
      }, {
        default: function(deserialized) {
          var transformed;
          if (_.isNil(deserialized)) {
            return null;
          } else {
            transformed = Number(deserialized);
            if (_.isNumber(transformed)) {
              return transformed;
            } else {
              return null;
            }
          }
        }
      }));

      NumberTransform.public(NumberTransform.static(NumberTransform.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      NumberTransform.public(NumberTransform.static(NumberTransform.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      NumberTransform.initialize();

      return NumberTransform;

    }).call(this);
  };

}).call(this);
