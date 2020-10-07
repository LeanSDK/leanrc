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

  /*
  ```coffee
  module.exports = (Module)->
    Module.defineMixin Module::Record, (BaseClass) ->
      class TomatoEntryMixin extends BaseClass
        @inheritProtected()

   * Place for attributes and computeds definitions
        @attribute title: String,
          validate: -> joi.string() # !!! нужен для сложной валидации данных
   * transform указывать не надо, т.к. стандартный тип, Module::StringTransform

        @attribute nameObj: Module::NameObj,
          validate: -> joi.object().required().start().end().default({})
          transform: -> Module::NameObjTransform # or some record class Module::OnionRecord

        @attribute description: String

        @attribute registeredAt: Date,
          validate: -> joi.date().iso()
          transform: -> Module::MyDateTransform
      TomatoEntryMixin.initializeMixin()
  ```

  ```coffee
  module.exports = (Module)->
    {
      Record
      TomatoEntryMixin
    } = Module::

    class TomatoRecord extends Record
      @inheritProtected()
      @include TomatoEntryMixin
      @module Module

   * business logic and before-, after- colbacks

    TomatoRecord.initialize()
  ```
   */
  module.exports = function(Module) {
    var AnyT, AttributeConfigT, AttributeOptionsT, ChainsMixin, CollectionInterface, ComputedConfigT, ComputedOptionsT, CoreObject, DictG, FuncG, JoiT, ListG, MaybeG, PointerT, PropertyDefinitionT, Record, RecordInterface, SubsetG, TupleG, UnionG, _, inflect, joi;
    ({
      AnyT,
      PointerT,
      JoiT,
      PropertyDefinitionT,
      AttributeOptionsT,
      ComputedOptionsT,
      AttributeConfigT,
      ComputedConfigT,
      FuncG,
      TupleG,
      MaybeG,
      SubsetG,
      DictG,
      ListG,
      UnionG,
      RecordInterface,
      CollectionInterface,
      CoreObject,
      ChainsMixin,
      Utils: {_, inflect, joi}
    } = Module.prototype);
    return Record = (function() {
      var ipoInternalRecord, ipoSchemas;

      class Record extends CoreObject {};

      Record.inheritProtected();

      Record.include(ChainsMixin);

      Record.implements(RecordInterface);

      Record.module(Module);

      ipoInternalRecord = PointerT(Record.protected({
        internalRecord: MaybeG(Object)
      }));

      ipoSchemas = PointerT(Record.protected(Record.static({
        schemas: DictG(String, JoiT)
      }, {
        default: {}
      })));

      Record.public({
        collection: CollectionInterface
      });

      Record.public(Record.static({
        schema: JoiT
      }, {
        get: function() {
          var base, name1;
          if ((base = this[ipoSchemas])[name1 = this.name] == null) {
            base[name1] = (() => {
              var ahValue, asAttr, ref, ref1, vhAttrs;
              vhAttrs = {};
              ref = this.attributes;
              for (asAttr in ref) {
                if (!hasProp.call(ref, asAttr)) continue;
                ahValue = ref[asAttr];
                vhAttrs[asAttr] = ((asAttr, ahValue) => {
                  if (_.isFunction(ahValue.validate)) {
                    return ahValue.validate.call(this);
                  } else {
                    return ahValue.validate;
                  }
                })(asAttr, ahValue);
              }
              ref1 = this.computeds;
              for (asAttr in ref1) {
                if (!hasProp.call(ref1, asAttr)) continue;
                ahValue = ref1[asAttr];
                vhAttrs[asAttr] = ((asAttr, ahValue) => {
                  if (_.isFunction(ahValue.validate)) {
                    return ahValue.validate.call(this);
                  } else {
                    return ahValue.validate;
                  }
                })(asAttr, ahValue);
              }
              return joi.object(vhAttrs);
            })();
          }
          return this[ipoSchemas][this.name];
        }
      }));

      Record.public(Record.static(Record.async({
        normalize: FuncG([MaybeG(Object), CollectionInterface], RecordInterface)
      }, {
        default: function*(ahPayload, aoCollection) {
          var RecordClass, asAttr, ref, transform, vhAttributes, voRecord;
          if (ahPayload == null) {
            return null;
          }
          vhAttributes = {};
          if (ahPayload.type == null) {
            throw new Error("Attribute `type` is required and format 'ModuleName::RecordClassName'");
          }
          RecordClass = this.name === ahPayload.type.split('::')[1] ? this : this.findRecordByName(ahPayload.type);
          ref = RecordClass.attributes;
          for (asAttr in ref) {
            if (!hasProp.call(ref, asAttr)) continue;
            ({transform} = ref[asAttr]);
            vhAttributes[asAttr] = (yield transform.call(RecordClass).normalize(ahPayload[asAttr]));
          }
          vhAttributes.type = ahPayload.type;
          // NOTE: vhAttributes processed before new - it for StateMachine in record (when it has)
          voRecord = RecordClass.new(vhAttributes, aoCollection);
          voRecord[ipoInternalRecord] = voRecord.constructor.makeSnapshot(voRecord);
          return voRecord;
        }
      })));

      Record.public(Record.static(Record.async({
        serialize: FuncG([MaybeG(RecordInterface)], MaybeG(Object))
      }, {
        default: function*(aoRecord) {
          var asAttr, ref, transform, vhResult;
          if (aoRecord == null) {
            return null;
          }
          if (aoRecord.type == null) {
            throw new Error("Attribute `type` is required and format 'ModuleName::RecordClassName'");
          }
          vhResult = {};
          ref = aoRecord.constructor.attributes;
          for (asAttr in ref) {
            if (!hasProp.call(ref, asAttr)) continue;
            ({transform} = ref[asAttr]);
            vhResult[asAttr] = (yield transform.call(this).serialize(aoRecord[asAttr]));
          }
          return vhResult;
        }
      })));

      Record.public(Record.static(Record.async({
        recoverize: FuncG([MaybeG(Object), CollectionInterface], MaybeG(RecordInterface))
      }, {
        default: function*(ahPayload, aoCollection) {
          var RecordClass, asAttr, ref, transform, vhAttributes, voRecord;
          if (ahPayload == null) {
            return null;
          }
          vhAttributes = {};
          if (ahPayload.type == null) {
            throw new Error("Attribute `type` is required and format 'ModuleName::RecordClassName'");
          }
          RecordClass = this.name === ahPayload.type.split('::')[1] ? this : this.findRecordByName(ahPayload.type);
          ref = RecordClass.attributes;
          for (asAttr in ref) {
            if (!hasProp.call(ref, asAttr)) continue;
            ({transform} = ref[asAttr]);
            if (asAttr in ahPayload) {
              vhAttributes[asAttr] = (yield transform.call(RecordClass).normalize(ahPayload[asAttr]));
            }
          }
          vhAttributes.type = ahPayload.type;
          // NOTE: vhAttributes processed before new - it for StateMachine in record (when it has)
          voRecord = RecordClass.new(vhAttributes, aoCollection);
          return voRecord;
        }
      })));

      Record.public(Record.static({
        objectize: FuncG([MaybeG(RecordInterface), MaybeG(Object)], MaybeG(Object))
      }, {
        default: function(aoRecord) {
          var asAttr, ref, ref1, transform, vhResult;
          if (aoRecord == null) {
            return null;
          }
          if (aoRecord.type == null) {
            throw new Error("Attribute `type` is required and format 'ModuleName::RecordClassName'");
          }
          vhResult = {};
          ref = aoRecord.constructor.attributes;
          for (asAttr in ref) {
            if (!hasProp.call(ref, asAttr)) continue;
            ({transform} = ref[asAttr]);
            vhResult[asAttr] = transform.call(this).objectize(aoRecord[asAttr]);
          }
          ref1 = aoRecord.constructor.computeds;
          for (asAttr in ref1) {
            if (!hasProp.call(ref1, asAttr)) continue;
            ({transform} = ref1[asAttr]);
            vhResult[asAttr] = transform.call(this).objectize(aoRecord[asAttr]);
          }
          return vhResult;
        }
      }));

      Record.public(Record.static({
        makeSnapshot: FuncG([MaybeG(RecordInterface)], MaybeG(Object))
      }, {
        default: function(aoRecord) {
          var asAttr, ref, transform, vhResult;
          if (aoRecord == null) {
            return null;
          }
          if (aoRecord.type == null) {
            throw new Error("Attribute `type` is required and format 'ModuleName::RecordClassName'");
          }
          vhResult = {};
          ref = aoRecord.constructor.attributes;
          for (asAttr in ref) {
            if (!hasProp.call(ref, asAttr)) continue;
            ({transform} = ref[asAttr]);
            vhResult[asAttr] = transform.call(this).objectize(aoRecord[asAttr]);
          }
          return vhResult;
        }
      }));

      Record.public(Record.static({
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

      Record.public({
        parseRecordName: FuncG(String, TupleG(String, String))
      }, {
        default: function(...args) {
          return this.constructor.parseRecordName(...args);
        }
      });

      Record.public(Record.static({
        findRecordByName: FuncG(String, SubsetG(RecordInterface))
      }, {
        default: function(asName) {
          var ref, ref1, vsModuleName, vsRecordName;
          [vsModuleName, vsRecordName] = this.parseRecordName(asName);
          return (ref = ((ref1 = this.Module.NS) != null ? ref1 : this.Module.prototype)[vsRecordName]) != null ? ref : this;
        }
      }));

      Record.public({
        findRecordByName: FuncG(String, SubsetG(RecordInterface))
      }, {
        default: function(asName) {
          return this.constructor.findRecordByName(asName);
        }
      });

      /*
        @customFilter ->
          reason:
            '$eq': (value)->
       * string of some aql code for example
            '$neq': (value)->
       * string of some aql code for example
       */
      Record.public(Record.static({
        customFilters: Object
      }, {
        get: function() {
          return this.metaObject.getGroup('customFilters', false);
        }
      }));

      Record.public(Record.static({
        customFilter: FuncG(Function)
      }, {
        default: function(amStatementFunc) {
          var aoStatement, asFilterName, config;
          config = amStatementFunc.call(this);
          for (asFilterName in config) {
            if (!hasProp.call(config, asFilterName)) continue;
            aoStatement = config[asFilterName];
            this.metaObject.addMetaData('customFilters', asFilterName, aoStatement);
          }
        }
      }));

      Record.public(Record.static({
        parentClassNames: FuncG([MaybeG(SubsetG(RecordInterface))], ListG(String))
      }, {
        default: function(AbstractClass = null) {
          var SuperClass, fromSuper;
          if (AbstractClass == null) {
            AbstractClass = this;
          }
          SuperClass = Reflect.getPrototypeOf(AbstractClass);
          fromSuper = !_.isEmpty(SuperClass != null ? SuperClass.name : void 0) ? this.parentClassNames(SuperClass) : void 0;
          return _.uniq([].concat(fromSuper != null ? fromSuper : [])).concat([AbstractClass.name]);
        }
      }));

      Record.public(Record.static({
        attributes: DictG(String, AttributeConfigT)
      }, {
        get: function() {
          return this.metaObject.getGroup('attributes', false);
        }
      }));

      Record.public(Record.static({
        computeds: DictG(String, ComputedConfigT)
      }, {
        get: function() {
          return this.metaObject.getGroup('computeds', false);
        }
      }));

      Record.public(Record.static({
        attribute: FuncG([PropertyDefinitionT, AttributeOptionsT])
      }, {
        default: function() {
          this.attr(...arguments);
        }
      }));

      Record.public(Record.static({
        attr: FuncG([PropertyDefinitionT, AttributeOptionsT])
      }, {
        default: function(typeDefinition, opts = {}) {
          var set, vcAttrType, vsAttr;
          [vsAttr] = Object.keys(typeDefinition);
          vcAttrType = typeDefinition[vsAttr];
          // NOTE: это всего лишь автоматическое применение трансформа, если он не указан явно. здесь НЕ надо автоматически подставить нужный рекорд или кастомный трансформ - они если должны использоваться, должны быть указаны вручную в схеме рекорда программистом.
          if (opts.transform == null) {
            opts.transform = (function() {
              switch (vcAttrType) {
                case String:
                case Date:
                case Number:
                case Boolean:
                case Array:
                case Object:
                  return function() {
                    return Module.prototype[`${vcAttrType.name}Transform`];
                  };
                default:
                  return function() {
                    return Module.prototype.Transform;
                  };
              }
            })();
          }
          if (opts.validate == null) {
            opts.validate = function() {
              return opts.transform.call(this).schema;
            };
          }
          ({set} = opts);
          opts.set = function(aoData) {
            var voData;
            ({
              value: voData
            } = opts.validate.call(this).validate(aoData));
            if (_.isFunction(set)) {
              return set.apply(this, [voData]);
            } else {
              return voData;
            }
          };
          if (this.attributes[vsAttr] != null) {
            throw new Error(`attribute \`${vsAttr}\` has been defined previously`);
          } else {
            this.metaObject.addMetaData('attributes', vsAttr, opts);
          }
          this.public({
            [vsAttr]: Module.prototype.MaybeG(vcAttrType)
          }, opts);
        }
      }));

      Record.public(Record.static({
        computed: FuncG([PropertyDefinitionT, ComputedOptionsT])
      }, {
        default: function() {
          this.comp(...arguments);
        }
      }));

      // NOTE: изначальная задумка была в том, чтобы определять вычисляемые значения - НЕ ПРОМИСЫ! (т.е. некоторое значение, которое отправляется в респонзе реально не хранится в базе, но вычисляется НЕ асинхронной функцией-гетером)
      Record.public(Record.static({
        comp: FuncG([PropertyDefinitionT, ComputedOptionsT])
      }, {
        default: function(typeDefinition, opts) {
          var vcAttrType, vsAttr;
          // [typeDefinition, ..., opts] = args
          // if typeDefinition is opts
          //   typeDefinition = "#{opts.attr}": opts.attrType
          [vsAttr] = Object.keys(typeDefinition);
          vcAttrType = typeDefinition[vsAttr];
          // NOTE: это всего лишь автоматическое применение трансформа, если он не указан явно. здесь не надо автоматически подставить нужный рекорд или кастомный трансформ - они если должны использоваться, должны быть указаны вручную в схеме рекорда программистом.
          if (opts.transform == null) {
            opts.transform = (function() {
              switch (vcAttrType) {
                case String:
                case Date:
                case Number:
                case Boolean:
                case Array:
                case Object:
                  return function() {
                    return Module.prototype[`${vcAttrType.name}Transform`];
                  };
                default:
                  return function() {
                    return Module.prototype.Transform;
                  };
              }
            })();
          }
          if (opts.validate == null) {
            opts.validate = function() {
              return opts.transform.call(this).schema.strip();
            };
          }
          if (opts.get == null) {
            throw new Error('getter `lambda` options is required');
          }
          if (opts.set != null) {
            throw new Error('setter `lambda` options is forbidden');
          }
          if (this.computeds[vsAttr] != null) {
            throw new Error(`computed \`${vsAttr}\` has been defined previously`);
          } else {
            this.metaObject.addMetaData('computeds', vsAttr, opts);
          }
          this.public({
            [vsAttr]: Module.prototype.MaybeG(vcAttrType)
          }, opts);
        }
      }));

      Record.public(Record.static({
        new: FuncG([Object, CollectionInterface], RecordInterface)
      }, {
        default: function(aoAttributes, aoCollection) {
          var RecordClass;
          if (aoAttributes == null) {
            aoAttributes = {};
          }
          if (aoAttributes.type == null) {
            throw new Error("Attribute `type` is required and format 'ModuleName::RecordClassName'");
          }
          if (this.name === aoAttributes.type.split('::')[1]) {
            return this.super(aoAttributes, aoCollection);
          } else {
            RecordClass = this.findRecordByName(aoAttributes.type);
            if (RecordClass === this) {
              return this.super(aoAttributes, aoCollection);
            } else {
              return RecordClass.new(aoAttributes, aoCollection);
            }
          }
        }
      }));

      Record.public(Record.async({
        save: FuncG([], RecordInterface)
      }, {
        default: function*() {
          var result;
          result = (yield this.isNew()) ? (yield this.create()) : (yield this.update());
          return result;
        }
      }));

      Record.public(Record.async({
        create: FuncG([], RecordInterface)
      }, {
        default: function*() {
          var response;
          // console.log '>>??? create push ', @, @collection
          response = (yield this.collection.push(this));
          // response = yield @collection.push.body.call @collection, @
          // console.log '>>>>?????????????????????', response, response.collection
          // console.log '>>>>????????????????????? is', CollectionInterface.is response.collection
          yield this.reloadRecord(response);
          return this;
        }
      }));

      Record.public(Record.async({
        update: FuncG([], RecordInterface)
      }, {
        default: function*() {
          var response;
          response = (yield this.collection.override(this.id, this));
          yield this.reloadRecord(response);
          return this;
        }
      }));

      Record.public(Record.async({
        delete: FuncG([], RecordInterface)
      }, {
        default: function*() {
          if ((yield this.isNew())) {
            throw new Error('Document is not exist in collection');
          }
          this.isHidden = true;
          this.updatedAt = new Date();
          return (yield this.save());
        }
      }));

      Record.public(Record.async({
        destroy: Function
      }, {
        default: function*() {
          if ((yield this.isNew())) {
            throw new Error('Document is not exist in collection');
          }
          yield this.collection.remove(this.id);
        }
      }));

      Record.attribute({
        id: UnionG(String, Number)
      }, {
        transform: function() {
          return Module.prototype.StringTransform;
        }
      });

      Record.attribute({
        rev: String
      });

      Record.attribute({
        type: String
      });

      Record.attribute({
        isHidden: Boolean
      }, {
        validate: function() {
          return joi.boolean().empty(null).default(false, 'false by default');
        },
        default: false
      });

      Record.attribute({
        createdAt: Date
      });

      Record.attribute({
        updatedAt: Date
      });

      Record.attribute({
        deletedAt: Date
      });

      Record.chains(['create', 'update', 'delete', 'destroy']);

      Record.beforeHook('beforeUpdate', {
        only: ['update']
      });

      Record.beforeHook('beforeCreate', {
        only: ['create']
      });

      Record.afterHook('afterUpdate', {
        only: ['update']
      });

      Record.afterHook('afterCreate', {
        only: ['create']
      });

      Record.beforeHook('beforeDelete', {
        only: ['delete']
      });

      Record.afterHook('afterDelete', {
        only: ['delete']
      });

      Record.afterHook('afterDestroy', {
        only: ['destroy']
      });

      Record.public(Record.async({
        afterCreate: FuncG(RecordInterface, RecordInterface)
      }, {
        default: function*(aoRecord) {
          this.collection.recordHasBeenChanged('createdRecord', aoRecord);
          return this;
        }
      }));

      Record.public(Record.async({
        beforeUpdate: Function
      }, {
        default: function*(...args) {
          this.updatedAt = new Date();
          return args;
        }
      }));

      Record.public(Record.async({
        beforeCreate: Function
      }, {
        default: function*(...args) {
          var now;
          if (this.id == null) {
            this.id = (yield this.collection.generateId(this));
          }
          now = new Date();
          if (this.createdAt == null) {
            this.createdAt = now;
          }
          if (this.updatedAt == null) {
            this.updatedAt = now;
          }
          return args;
        }
      }));

      Record.public(Record.async({
        afterUpdate: FuncG(RecordInterface, RecordInterface)
      }, {
        default: function*(aoRecord) {
          this.collection.recordHasBeenChanged('updatedRecord', aoRecord);
          return this;
        }
      }));

      Record.public(Record.async({
        beforeDelete: Function
      }, {
        default: function*(...args) {
          var now;
          this.isHidden = true;
          now = new Date();
          this.updatedAt = now;
          this.deletedAt = now;
          return args;
        }
      }));

      Record.public(Record.async({
        afterDelete: FuncG(RecordInterface, RecordInterface)
      }, {
        default: function*(aoRecord) {
          this.collection.recordHasBeenChanged('deletedRecord', aoRecord);
          return this;
        }
      }));

      Record.public(Record.async({
        afterDestroy: FuncG([])
      }, {
        default: function*() {
          this.collection.recordHasBeenChanged('destroyedRecord', this);
        }
      }));

      // NOTE: метод должен вернуть список атрибутов данного рекорда.
      Record.public({
        attributes: FuncG([], Object)
      }, {
        default: function() {
          return Object.keys(this.constructor.attributes);
        }
      });

      // NOTE: в оперативной памяти создается клон рекорда, НО с другим id
      Record.public(Record.async({
        clone: FuncG([], RecordInterface)
      }, {
        default: function*() {
          return (yield this.collection.clone(this));
        }
      }));

      // NOTE: в коллекции создается копия рекорда, НО с другим id
      Record.public(Record.async({
        copy: FuncG([], RecordInterface)
      }, {
        default: function*() {
          return (yield this.collection.copy(this));
        }
      }));

      Record.public(Record.async({
        decrement: FuncG([String, MaybeG(Number)], RecordInterface)
      }, {
        default: function*(asAttribute, step = 1) {
          if (!_.isNumber(this[asAttribute])) {
            throw new Error(`doc.attribute \`${asAttribute}\` is not Number`);
          }
          this[asAttribute] -= step;
          return (yield this.save());
        }
      }));

      Record.public(Record.async({
        increment: FuncG([String, MaybeG(Number)], RecordInterface)
      }, {
        default: function*(asAttribute, step = 1) {
          if (!_.isNumber(this[asAttribute])) {
            throw new Error(`doc.attribute \`${asAttribute}\` is not Number`);
          }
          this[asAttribute] += step;
          return (yield this.save());
        }
      }));

      Record.public(Record.async({
        toggle: FuncG(String, RecordInterface)
      }, {
        default: function*(asAttribute) {
          if (!_.isBoolean(this[asAttribute])) {
            throw new Error(`doc.attribute \`${asAttribute}\` is not Boolean`);
          }
          this[asAttribute] = !this[asAttribute];
          return (yield this.save());
        }
      }));

      Record.public(Record.async({
        touch: FuncG([], RecordInterface)
      }, {
        default: function*() {
          this.updatedAt = new Date();
          return (yield this.save());
        }
      }));

      Record.public(Record.async({
        updateAttribute: FuncG([String, MaybeG(AnyT)], RecordInterface)
      }, {
        default: function*(name, value) {
          this[name] = value;
          return (yield this.save());
        }
      }));

      Record.public(Record.async({
        updateAttributes: FuncG(Object, RecordInterface)
      }, {
        default: function*(aoAttributes) {
          var voAttrValue, vsAttrName;
          for (vsAttrName in aoAttributes) {
            if (!hasProp.call(aoAttributes, vsAttrName)) continue;
            voAttrValue = aoAttributes[vsAttrName];
            this[vsAttrName] = voAttrValue;
          }
          return (yield this.save());
        }
      }));

      Record.public(Record.async({
        isNew: FuncG([], Boolean)
      }, {
        default: function*() {
          if (this.id == null) {
            return true;
          }
          return !((yield this.collection.includes(this.id)));
        }
      }));

      Record.public(Record.async({
        reload: FuncG([], RecordInterface)
      }, {
        default: function*() {
          var response;
          if (this.id == null) {
            return;
          }
          response = (yield this.collection.take(this.id));
          yield this.reloadRecord(response);
          return this;
        }
      }));

      Record.public(Record.async({
        reloadRecord: FuncG(UnionG(Object, RecordInterface))
      }, {
        default: function*(response) {
          var asAttr, ref;
          if (response != null) {
            ref = this.constructor.attributes;
            for (asAttr in ref) {
              if (!hasProp.call(ref, asAttr)) continue;
              this[asAttr] = response[asAttr];
            }
            this[ipoInternalRecord] = response[ipoInternalRecord];
          }
        }
      }));

      // TODO: не учтены установки значений, которые раньше не были установлены
      Record.public(Record.async({
        changedAttributes: FuncG([], DictG(String, Array))
      }, {
        default: function*() {
          var ref, ref1, transform, vhResult, voNewValue, voOldValue, vsAttrName;
          vhResult = {};
          ref = this.constructor.attributes;
          for (vsAttrName in ref) {
            if (!hasProp.call(ref, vsAttrName)) continue;
            ({transform} = ref[vsAttrName]);
            voOldValue = (ref1 = this[ipoInternalRecord]) != null ? ref1[vsAttrName] : void 0;
            voNewValue = transform.call(this.constructor).objectize(this[vsAttrName]);
            if (!_.isEqual(voNewValue, voOldValue)) {
              vhResult[vsAttrName] = [voOldValue, voNewValue];
            }
          }
          return vhResult;
        }
      }));

      Record.public(Record.async({
        resetAttribute: FuncG(String)
      }, {
        default: function*(asAttribute) {
          var attrConf, transform;
          if (this[ipoInternalRecord] != null) {
            if ((attrConf = this.constructor.attributes[asAttribute]) != null) {
              ({transform} = attrConf);
              this[asAttribute] = (yield transform.call(this.constructor).normalize(this[ipoInternalRecord][asAttribute]));
            }
          }
        }
      }));

      Record.public(Record.async({
        rollbackAttributes: Function
      }, {
        default: function*() {
          var ref, transform, voOldValue, vsAttrName;
          if (this[ipoInternalRecord] != null) {
            ref = this.constructor.attributes;
            for (vsAttrName in ref) {
              if (!hasProp.call(ref, vsAttrName)) continue;
              ({transform} = ref[vsAttrName]);
              voOldValue = this[ipoInternalRecord][vsAttrName];
              this[vsAttrName] = (yield transform.call(this.constructor).normalize(voOldValue));
            }
          }
        }
      }));

      Record.public(Record.static(Record.async({
        restoreObject: FuncG([SubsetG(Module), Object], RecordInterface)
      }, {
        default: function*(Module, replica) {
          var Facade, collection, facade, instance, ref;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            Facade = (ref = Module.prototype.ApplicationFacade) != null ? ref : Module.prototype.Facade;
            facade = Facade.getInstance(replica.multitonKey);
            collection = facade.retrieveProxy(replica.collectionName);
            if (replica.isNew) {
              // NOTE: оставлено временно для обратной совместимости. Понятно что в будущем надо эту ветку удалить.
              instance = (yield collection.build(replica.attributes));
            } else {
              instance = (yield collection.find(replica.id));
            }
            return instance;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      Record.public(Record.static(Record.async({
        replicateObject: FuncG(RecordInterface, Object)
      }, {
        default: function*(instance) {
          var changedAttributes, changedKeys, ipsMultitonKey, replica;
          replica = (yield this.super(instance));
          ipsMultitonKey = Symbol.for('~multitonKey');
          replica.multitonKey = instance.collection[ipsMultitonKey];
          replica.collectionName = instance.collection.getProxyName();
          replica.isNew = (yield instance.isNew());
          if (replica.isNew) {
            throw new Error("Replicating record is `new`. It must be seved previously");
          } else {
            changedAttributes = (yield instance.changedAttributes());
            if ((changedKeys = Object.keys(changedAttributes)).length > 0) {
              throw new Error(`Replicating record has changedAttributes ${changedKeys}`);
            }
            replica.id = instance.id;
          }
          return replica;
        }
      })));

      Record.public({
        init: FuncG([Object, CollectionInterface])
      }, {
        default: function(aoProperties, aoCollection) {
          var voAttrValue, vsAttrName;
          this.super(...arguments);
          this.collection = aoCollection;
          for (vsAttrName in aoProperties) {
            if (!hasProp.call(aoProperties, vsAttrName)) continue;
            voAttrValue = aoProperties[vsAttrName];
            this[vsAttrName] = voAttrValue;
          }
        }
      });

      Record.public({
        toJSON: FuncG([], Object)
      }, {
        default: function() {
          return this.constructor.objectize(this);
        }
      });

      Record.initialize();

      return Record;

    }).call(this);
  };

}).call(this);
