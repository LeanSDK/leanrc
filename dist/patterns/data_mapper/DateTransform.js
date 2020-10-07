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
    var CoreObject, DateTransform, FuncG, JoiT, MaybeG, TransformInterface, _, joi;
    ({
      JoiT,
      FuncG,
      MaybeG,
      TransformInterface,
      CoreObject,
      Utils: {_, joi}
    } = Module.prototype);
    return DateTransform = (function() {
      class DateTransform extends CoreObject {};

      DateTransform.inheritProtected();

      DateTransform.implements(TransformInterface);

      DateTransform.module(Module);

      DateTransform.public(DateTransform.static({
        schema: JoiT
      }, {
        get: function() {
          return joi.date().iso().allow(null).optional();
        }
      }));

      DateTransform.public(DateTransform.static(DateTransform.async({
        normalize: FuncG([MaybeG(String)], MaybeG(Date))
      }, {
        default: function*(...args) {
          return this.normalizeSync(...args);
        }
      })));

      DateTransform.public(DateTransform.static(DateTransform.async({
        serialize: FuncG([MaybeG(Date)], MaybeG(String))
      }, {
        default: function*(...args) {
          return this.serializeSync(...args);
        }
      })));

      DateTransform.public(DateTransform.static({
        normalizeSync: FuncG([MaybeG(String)], MaybeG(Date))
      }, {
        default: function(serialized) {
          return (_.isNil(serialized) ? null : new Date(serialized));
        }
      }));

      DateTransform.public(DateTransform.static({
        serializeSync: FuncG([MaybeG(Date)], MaybeG(String))
      }, {
        default: function(deserialized) {
          if (_.isDate(deserialized) && !_.isNaN(deserialized)) {
            return deserialized.toISOString();
          } else {
            return null;
          }
        }
      }));

      DateTransform.public(DateTransform.static({
        objectize: FuncG([MaybeG(Date)], MaybeG(String))
      }, {
        default: function(deserialized) {
          if (_.isDate(deserialized) && !_.isNaN(deserialized)) {
            return deserialized.toISOString();
          } else {
            return null;
          }
        }
      }));

      DateTransform.public(DateTransform.static(DateTransform.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      DateTransform.public(DateTransform.static(DateTransform.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      DateTransform.initialize();

      return DateTransform;

    }).call(this);
  };

}).call(this);
