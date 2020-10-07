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
  module.exports = function(Module) {
    var ArrayTransform, ComplexArrayTransform, FuncG, MaybeG, RecordInterface, SubsetG, TupleG, _, inflect, moment;
    ({
      FuncG,
      MaybeG,
      TupleG,
      SubsetG,
      RecordInterface,
      ArrayTransform,
      Utils: {_, inflect, moment}
    } = Module.prototype);
    return ComplexArrayTransform = (function() {
      class ComplexArrayTransform extends ArrayTransform {};

      ComplexArrayTransform.inheritProtected();

      ComplexArrayTransform.module(Module);

      ComplexArrayTransform.public(ComplexArrayTransform.static({
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

      ComplexArrayTransform.public(ComplexArrayTransform.static({
        findRecordByName: FuncG(String, SubsetG(RecordInterface))
      }, {
        default: function(asName) {
          var ref, vsModuleName, vsRecordName;
          [vsModuleName, vsRecordName] = this.parseRecordName(asName);
          return ((ref = this.Module.NS) != null ? ref : this.Module.prototype)[vsRecordName];
        }
      }));

      ComplexArrayTransform.public(ComplexArrayTransform.static(ComplexArrayTransform.async({
        normalize: FuncG([MaybeG(Array)], Array)
      }, {
        default: function*(serialized) {
          var RecordClass, item, result;
          if (serialized == null) {
            return [];
          }
          result = (yield* (function*() {
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
                case !(_.isPlainObject(item) && /.{2,}[:][:].{2,}/.test(item.type)):
                  RecordClass = this.findRecordByName(item.type);
                  // NOTE: в правильном использовании вторым аргументом должна передаваться ссылка на коллекцию, то тут мы не можем ее получить
                  // а так как рекорды в этом случае используются ТОЛЬКО для оформления структуры и хранения данных внутри родительского рекорда, то коллекции физически просто нет.
                  results.push((yield RecordClass.normalize(item)));
                  break;
                case !_.isPlainObject(item):
                  results.push((yield Module.prototype.ComplexObjectTransform.normalize(item)));
                  break;
                case !_.isArray(item):
                  results.push((yield Module.prototype.ComplexArrayTransform.normalize(item)));
                  break;
                default:
                  results.push(Module.prototype.Transform.normalizeSync(item));
              }
            }
            return results;
          }).call(this));
          return result;
        }
      })));

      ComplexArrayTransform.public(ComplexArrayTransform.static(ComplexArrayTransform.async({
        serialize: FuncG([MaybeG(Array)], Array)
      }, {
        default: function*(deserialized) {
          var RecordClass, item, result;
          if (deserialized == null) {
            return [];
          }
          result = (yield* (function*() {
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
                case !(_.isObject(item) && /.{2,}[:][:].{2,}/.test(item.type)):
                  RecordClass = this.findRecordByName(item.type);
                  results.push((yield RecordClass.serialize(item)));
                  break;
                case !_.isPlainObject(item):
                  results.push((yield Module.prototype.ComplexObjectTransform.serialize(item)));
                  break;
                case !_.isArray(item):
                  results.push((yield Module.prototype.ComplexArrayTransform.serialize(item)));
                  break;
                default:
                  results.push(Module.prototype.Transform.serializeSync(item));
              }
            }
            return results;
          }).call(this));
          return result;
        }
      })));

      ComplexArrayTransform.public(ComplexArrayTransform.static({
        objectize: FuncG([MaybeG(Array)], Array)
      }, {
        default: function(deserialized) {
          var RecordClass, item, result;
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
                case !(_.isObject(item) && /.{2,}[:][:].{2,}/.test(item.type)):
                  RecordClass = this.findRecordByName(item.type);
                  results.push(RecordClass.objectize(item));
                  break;
                case !_.isPlainObject(item):
                  results.push(Module.prototype.ComplexObjectTransform.objectize(item));
                  break;
                case !_.isArray(item):
                  results.push(Module.prototype.ComplexArrayTransform.objectize(item));
                  break;
                default:
                  results.push(Module.prototype.Transform.objectize(item));
              }
            }
            return results;
          }).call(this);
          return result;
        }
      }));

      ComplexArrayTransform.initialize();

      return ComplexArrayTransform;

    }).call(this);
  };

}).call(this);
