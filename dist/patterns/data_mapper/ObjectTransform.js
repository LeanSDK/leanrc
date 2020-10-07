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
    var CoreObject, FuncG, JoiT, MaybeG, ObjectTransform, TransformInterface, _, joi, moment;
    ({
      JoiT,
      FuncG,
      MaybeG,
      TransformInterface,
      CoreObject,
      Utils: {_, joi, moment}
    } = Module.prototype);
    return ObjectTransform = (function() {
      class ObjectTransform extends CoreObject {};

      ObjectTransform.inheritProtected();

      ObjectTransform.implements(TransformInterface);

      ObjectTransform.module(Module);

      ObjectTransform.public(ObjectTransform.static({
        schema: JoiT
      }, {
        get: function() {
          return joi.object().allow(null).optional();
        }
      }));

      ObjectTransform.public(ObjectTransform.static(ObjectTransform.async({
        normalize: FuncG([MaybeG(Object)], Object)
      }, {
        default: function*(...args) {
          return this.normalizeSync(...args);
        }
      })));

      ObjectTransform.public(ObjectTransform.static(ObjectTransform.async({
        serialize: FuncG([MaybeG(Object)], Object)
      }, {
        default: function*(...args) {
          return this.serializeSync(...args);
        }
      })));

      ObjectTransform.public(ObjectTransform.static({
        normalizeSync: FuncG([MaybeG(Object)], Object)
      }, {
        default: function(serialized) {
          var key, result, value;
          if (serialized == null) {
            return {};
          }
          result = {};
          for (key in serialized) {
            if (!hasProp.call(serialized, key)) continue;
            value = serialized[key];
            result[key] = (function() {
              switch (false) {
                case !(_.isString(value) && moment(value, moment.ISO_8601).isValid()):
                  return Module.prototype.DateTransform.normalizeSync(value);
                case !_.isString(value):
                  return Module.prototype.StringTransform.normalizeSync(value);
                case !_.isNumber(value):
                  return Module.prototype.NumberTransform.normalizeSync(value);
                case !_.isBoolean(value):
                  return Module.prototype.BooleanTransform.normalizeSync(value);
                case !_.isPlainObject(value):
                  return Module.prototype.ObjectTransform.normalizeSync(value);
                case !_.isArray(value):
                  return Module.prototype.ArrayTransform.normalizeSync(value);
                default:
                  return Module.prototype.Transform.normalizeSync(value);
              }
            })();
          }
          return result;
        }
      }));

      ObjectTransform.public(ObjectTransform.static({
        serializeSync: FuncG([MaybeG(Object)], Object)
      }, {
        default: function(deserialized) {
          var key, result, value;
          if (deserialized == null) {
            return {};
          }
          result = {};
          for (key in deserialized) {
            if (!hasProp.call(deserialized, key)) continue;
            value = deserialized[key];
            result[key] = (function() {
              switch (false) {
                case !_.isString(value):
                  return Module.prototype.StringTransform.serializeSync(value);
                case !_.isNumber(value):
                  return Module.prototype.NumberTransform.serializeSync(value);
                case !_.isBoolean(value):
                  return Module.prototype.BooleanTransform.serializeSync(value);
                case !_.isDate(value):
                  return Module.prototype.DateTransform.serializeSync(value);
                case !_.isPlainObject(value):
                  return Module.prototype.ObjectTransform.serializeSync(value);
                case !_.isArray(value):
                  return Module.prototype.ArrayTransform.serializeSync(value);
                default:
                  return Module.prototype.Transform.serializeSync(value);
              }
            })();
          }
          return result;
        }
      }));

      ObjectTransform.public(ObjectTransform.static({
        objectize: FuncG([MaybeG(Object)], Object)
      }, {
        default: function(deserialized) {
          var key, result, value;
          if (deserialized == null) {
            return {};
          }
          result = {};
          for (key in deserialized) {
            if (!hasProp.call(deserialized, key)) continue;
            value = deserialized[key];
            result[key] = (function() {
              switch (false) {
                case !_.isString(value):
                  return Module.prototype.StringTransform.objectize(value);
                case !_.isNumber(value):
                  return Module.prototype.NumberTransform.objectize(value);
                case !_.isBoolean(value):
                  return Module.prototype.BooleanTransform.objectize(value);
                case !_.isDate(value):
                  return Module.prototype.DateTransform.objectize(value);
                case !_.isPlainObject(value):
                  return Module.prototype.ObjectTransform.objectize(value);
                case !_.isArray(value):
                  return Module.prototype.ArrayTransform.objectize(value);
                default:
                  return Module.prototype.Transform.objectize(value);
              }
            })();
          }
          return result;
        }
      }));

      ObjectTransform.public(ObjectTransform.static(ObjectTransform.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      ObjectTransform.public(ObjectTransform.static(ObjectTransform.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      ObjectTransform.initialize();

      return ObjectTransform;

    }).call(this);
  };

}).call(this);
