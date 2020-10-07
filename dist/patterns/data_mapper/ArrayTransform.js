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
    var ArrayTransform, CoreObject, FuncG, JoiT, MaybeG, TransformInterface, _, joi, moment;
    ({
      JoiT,
      FuncG,
      MaybeG,
      TransformInterface,
      CoreObject,
      Utils: {_, joi, moment}
    } = Module.prototype);
    return ArrayTransform = (function() {
      class ArrayTransform extends CoreObject {};

      ArrayTransform.inheritProtected();

      ArrayTransform.implements(TransformInterface);

      ArrayTransform.module(Module);

      ArrayTransform.public(ArrayTransform.static({
        schema: JoiT
      }, {
        get: function() {
          return joi.array().items(joi.any()).allow(null).optional();
        }
      }));

      ArrayTransform.public(ArrayTransform.static(ArrayTransform.async({
        normalize: FuncG([MaybeG(Array)], Array)
      }, {
        default: function*(...args) {
          return this.normalizeSync(...args);
        }
      })));

      ArrayTransform.public(ArrayTransform.static(ArrayTransform.async({
        serialize: FuncG([MaybeG(Array)], Array)
      }, {
        default: function*(...args) {
          return this.serializeSync(...args);
        }
      })));

      ArrayTransform.public(ArrayTransform.static({
        normalizeSync: FuncG([MaybeG(Array)], Array)
      }, {
        default: function(serialized) {
          var item, result;
          if (serialized == null) {
            return [];
          }
          result = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = serialized.length; i < len; i++) {
              item = serialized[i];
              switch (false) {
                case !(_.isString(item) && moment(item, moment.ISO_8601).isValid()):
                  results.push(Module.prototype.DateTransform.normalizeSync(item));
                  break;
                case !_.isString(item):
                  results.push(Module.prototype.StringTransform.normalizeSync(item));
                  break;
                case !_.isNumber(item):
                  results.push(Module.prototype.NumberTransform.normalizeSync(item));
                  break;
                case !_.isBoolean(item):
                  results.push(Module.prototype.BooleanTransform.normalizeSync(item));
                  break;
                case !_.isPlainObject(item):
                  results.push(Module.prototype.ObjectTransform.normalizeSync(item));
                  break;
                case !_.isArray(item):
                  results.push(Module.prototype.ArrayTransform.normalizeSync(item));
                  break;
                default:
                  results.push(Module.prototype.Transform.normalizeSync(item));
              }
            }
            return results;
          })();
          return result;
        }
      }));

      ArrayTransform.public(ArrayTransform.static({
        serializeSync: FuncG([MaybeG(Array)], Array)
      }, {
        default: function(deserialized) {
          var item, result;
          if (deserialized == null) {
            return [];
          }
          result = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = deserialized.length; i < len; i++) {
              item = deserialized[i];
              switch (false) {
                case !_.isString(item):
                  results.push(Module.prototype.StringTransform.serializeSync(item));
                  break;
                case !_.isNumber(item):
                  results.push(Module.prototype.NumberTransform.serializeSync(item));
                  break;
                case !_.isBoolean(item):
                  results.push(Module.prototype.BooleanTransform.serializeSync(item));
                  break;
                case !_.isDate(item):
                  results.push(Module.prototype.DateTransform.serializeSync(item));
                  break;
                case !_.isPlainObject(item):
                  results.push(Module.prototype.ObjectTransform.serializeSync(item));
                  break;
                case !_.isArray(item):
                  results.push(Module.prototype.ArrayTransform.serializeSync(item));
                  break;
                default:
                  results.push(Module.prototype.Transform.serializeSync(item));
              }
            }
            return results;
          })();
          return result;
        }
      }));

      ArrayTransform.public(ArrayTransform.static({
        objectize: FuncG([MaybeG(Array)], Array)
      }, {
        default: function(deserialized) {
          var item, result;
          if (deserialized == null) {
            return [];
          }
          result = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = deserialized.length; i < len; i++) {
              item = deserialized[i];
              switch (false) {
                case !_.isString(item):
                  results.push(Module.prototype.StringTransform.objectize(item));
                  break;
                case !_.isNumber(item):
                  results.push(Module.prototype.NumberTransform.objectize(item));
                  break;
                case !_.isBoolean(item):
                  results.push(Module.prototype.BooleanTransform.objectize(item));
                  break;
                case !_.isDate(item):
                  results.push(Module.prototype.DateTransform.objectize(item));
                  break;
                case !_.isPlainObject(item):
                  results.push(Module.prototype.ObjectTransform.objectize(item));
                  break;
                case !_.isArray(item):
                  results.push(Module.prototype.ArrayTransform.objectize(item));
                  break;
                default:
                  results.push(Module.prototype.Transform.objectize(item));
              }
            }
            return results;
          })();
          return result;
        }
      }));

      ArrayTransform.public(ArrayTransform.static(ArrayTransform.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      ArrayTransform.public(ArrayTransform.static(ArrayTransform.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      ArrayTransform.initialize();

      return ArrayTransform;

    }).call(this);
  };

}).call(this);
