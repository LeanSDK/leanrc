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

  // NOTE: от этого класса можно унаследовать отдельный класс с кастомным определением схемы и использовать его внутри объявления атрибутов рекорда
  var hasProp = {}.hasOwnProperty;

  module.exports = function(Module) {
    var ComplexObjectTransform, FuncG, MaybeG, ObjectTransform, RecordInterface, SubsetG, TupleG, _, inflect, moment;
    ({
      FuncG,
      MaybeG,
      TupleG,
      SubsetG,
      RecordInterface,
      ObjectTransform,
      Utils: {_, inflect, moment}
    } = Module.prototype);
    return ComplexObjectTransform = (function() {
      class ComplexObjectTransform extends ObjectTransform {};

      ComplexObjectTransform.inheritProtected();

      ComplexObjectTransform.module(Module);

      ComplexObjectTransform.public(ComplexObjectTransform.static({
        parseRecordName: FuncG(String, TupleG(String, String))
      }, {
        default: function(asName) {
          var vsModuleName, vsRecordName;
          if (/.*[:][:].*/.test(asName)) {
            [vsModuleName, vsRecordName] = asName.split('::');
          } else {
            [vsModuleName, vsRecordName] = [this.moduleName(), inflect.camelize(inflect.underscore(inflect.singularize(asName)))];
          }
          if (!/(Record$)|(Migration$)/.test(vsRecordName)) {
            vsRecordName += 'Record';
          }
          return [vsModuleName, vsRecordName];
        }
      }));

      ComplexObjectTransform.public(ComplexObjectTransform.static({
        findRecordByName: FuncG(String, SubsetG(RecordInterface))
      }, {
        default: function(asName) {
          var ref, vsModuleName, vsRecordName;
          [vsModuleName, vsRecordName] = this.parseRecordName(asName);
          return ((ref = this.Module.NS) != null ? ref : this.Module.prototype)[vsRecordName];
        }
      }));

      ComplexObjectTransform.public(ComplexObjectTransform.static(ComplexObjectTransform.async({
        normalize: FuncG([MaybeG(Object)], Object)
      }, {
        default: function*(serialized) {
          var RecordClass, key, result, value;
          if (serialized == null) {
            return {};
          }
          result = {};
          for (key in serialized) {
            if (!hasProp.call(serialized, key)) continue;
            value = serialized[key];
            result[key] = (yield* (function*() {
              switch (false) {
                case !(_.isString(value) && moment(value, moment.ISO_8601).isValid()):
                  return Module.prototype.DateTransform.normalizeSync(value);
                case !_.isString(value):
                  return Module.prototype.StringTransform.normalizeSync(value);
                case !_.isNumber(value):
                  return Module.prototype.NumberTransform.normalizeSync(value);
                case !_.isBoolean(value):
                  return Module.prototype.BooleanTransform.normalizeSync(value);
                case !(_.isPlainObject(value) && /.{2,}[:][:].{2,}/.test(value.type)):
                  RecordClass = this.findRecordByName(value.type);
                  // NOTE: в правильном использовании вторым аргументом должна передаваться ссылка на коллекцию, то тут мы не можем ее получить
                  // а так как рекорды в этом случае используются ТОЛЬКО для оформления структуры и хранения данных внутри родительского рекорда, то коллекции физически просто нет.
                  return (yield RecordClass.normalize(value));
                case !_.isPlainObject(value):
                  return (yield Module.prototype.ComplexObjectTransform.normalize(value));
                case !_.isArray(value):
                  return (yield Module.prototype.ComplexArrayTransform.normalize(value));
                default:
                  return Module.prototype.Transform.normalizeSync(value);
              }
            }).call(this));
          }
          return result;
        }
      })));

      ComplexObjectTransform.public(ComplexObjectTransform.static(ComplexObjectTransform.async({
        serialize: FuncG([MaybeG(Object)], Object)
      }, {
        default: function*(deserialized) {
          var RecordClass, key, result, value;
          if (deserialized == null) {
            return {};
          }
          result = {};
          for (key in deserialized) {
            if (!hasProp.call(deserialized, key)) continue;
            value = deserialized[key];
            result[key] = (yield* (function*() {
              switch (false) {
                case !_.isString(value):
                  return Module.prototype.StringTransform.serializeSync(value);
                case !_.isNumber(value):
                  return Module.prototype.NumberTransform.serializeSync(value);
                case !_.isBoolean(value):
                  return Module.prototype.BooleanTransform.serializeSync(value);
                case !_.isDate(value):
                  return Module.prototype.DateTransform.serializeSync(value);
                case !(_.isObject(value) && /.{2,}[:][:].{2,}/.test(value.type)):
                  RecordClass = this.findRecordByName(value.type);
                  return (yield RecordClass.serialize(value));
                case !_.isPlainObject(value):
                  return (yield Module.prototype.ComplexObjectTransform.serialize(value));
                case !_.isArray(value):
                  return (yield Module.prototype.ComplexArrayTransform.serialize(value));
                default:
                  return Module.prototype.Transform.serializeSync(value);
              }
            }).call(this));
          }
          return result;
        }
      })));

      ComplexObjectTransform.public(ComplexObjectTransform.static({
        objectize: FuncG([MaybeG(Object)], Object)
      }, {
        default: function(deserialized) {
          var RecordClass, key, result, value;
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
                case !(_.isObject(value) && /.{2,}[:][:].{2,}/.test(value.type)):
                  RecordClass = this.findRecordByName(value.type);
                  return RecordClass.objectize(value);
                case !_.isPlainObject(value):
                  return Module.prototype.ComplexObjectTransform.objectize(value);
                case !_.isArray(value):
                  return Module.prototype.ComplexArrayTransform.objectize(value);
                default:
                  return Module.prototype.Transform.objectize(value);
              }
            }).call(this);
          }
          return result;
        }
      }));

      ComplexObjectTransform.initialize();

      return ComplexObjectTransform;

    }).call(this);
  };

}).call(this);
