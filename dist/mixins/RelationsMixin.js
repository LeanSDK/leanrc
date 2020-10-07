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

  // вычленяем из Record'а все что связано с релейшенами, т.к. Рекорды на основе key-value базы данных (Redis-like) не смогут поддерживать связи - т.к. на фундаментальном уровне кроме поиска по id в них нереализован поиск по НЕ-первичным ключам или сложным условиям

  // NOTE: Это миксин для подмешивания в классы унаследованные от Module::Record
  // если в этих классах необходим функционал релейшенов.

  // NOTE: Главная цель этих методов, когда они используются в рекорд-классе - предоставить удобные в использовании (в коде) ассинхронные геттеры, создаваемые на основе объявленных метаданных. (т.е. чтобы не писать лишних строчек кода, для получения объектов по связями из других коллекций)
  module.exports = function(Module) {
    var AsyncFuncG, CursorInterface, DictG, FuncG, MaybeG, Mixin, PromiseT, PropertyDefinitionT, Record, RecordInterface, RelatableInterface, RelationConfigT, RelationInverseT, RelationOptionsT, SubsetG, _, co, inflect, joi;
    ({
      PromiseT,
      PropertyDefinitionT,
      RelationOptionsT,
      RelationConfigT,
      RelationInverseT,
      FuncG,
      SubsetG,
      AsyncFuncG,
      DictG,
      MaybeG,
      RecordInterface,
      CursorInterface,
      RelatableInterface,
      Record,
      Mixin,
      Utils: {_, inflect, joi, co}
    } = Module.prototype);
    return Module.defineMixin(Mixin('RelationsMixin', function(BaseClass = Record) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.implements(RelatableInterface);

        // NOTE: отличается от belongsTo тем, что сама связь не является обязательной (образуется между объектами "в одной плоскости"), а в @[opts.attr] может содержаться null значение
        _Class.public(_Class.static({
          relatedTo: FuncG([PropertyDefinitionT, RelationOptionsT])
        }, {
          default: function(typeDefinition, {refKey, attr, inverse, relation, recordName, collectionName, through, inverseType} = {}) {
            var opts, property, vsAttr;
            // recordClass = @
            [vsAttr] = Object.keys(typeDefinition);
            if (refKey == null) {
              refKey = 'id';
            }
            if (attr == null) {
              attr = `${vsAttr}Id`;
            }
            if (inverse == null) {
              inverse = `${inflect.pluralize(inflect.camelize(this.name.replace(/Record$/, ''), false))}`;
            }
            if (inverseType == null) {
              inverseType = null; // manually only string
            }
            relation = 'relatedTo';
            if (recordName == null) {
              recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                var classNames, recordClass, vsModuleName, vsRecordName;
                if (recordType != null) {
                  recordClass = this.findRecordByName(recordType);
                  classNames = _.filter(recordClass.parentClassNames(), function(name) {
                    return /.*Record$/.test(name);
                  });
                  vsRecordName = classNames[1];
                } else {
                  [vsModuleName, vsRecordName] = this.parseRecordName(vsAttr);
                }
                return vsRecordName;
              });
            }
            if (collectionName == null) {
              collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts = {
              refKey,
              attr,
              inverse,
              inverseType,
              relation,
              recordName,
              collectionName,
              through,
              get: AsyncFuncG([], RecordInterface)(co.wrap(function*() {
                var RelatedToCollection, ThroughCollection, ThroughRecord, recordType, ref, relatedId, throughEmbed;
                recordType = null;
                if (inverseType != null) {
                  recordType = this[inverseType];
                }
                RelatedToCollection = this.collection.facade.retrieveProxy(collectionName.call(this, recordType));
                // NOTE: может быть ситуация, что relatedTo связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)
                if (!through) {
                  return (yield ((yield RelatedToCollection.takeBy({
                    [`@doc.${refKey}`]: this[attr]
                  }, {
                    $limit: 1
                  }))).first());
                } else {
                  // NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                  throughEmbed = (ref = this.constructor.embeddings) != null ? ref[through[0]] : void 0;
                  if (throughEmbed == null) {
                    throw new Error(`Metadata about ${through[0]} must be defined by \`EmbeddableRecordMixin.hasEmbed\` method`);
                  }
                  ThroughCollection = this.collection.facade.retrieveProxy(throughEmbed.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(throughEmbed.recordName.call(this));
                  inverse = ThroughRecord.relations[through[1].by];
                  relatedId = ((yield ((yield ThroughCollection.takeBy({
                    [`@doc.${throughEmbed.inverse}`]: this[throughEmbed.refKey]
                  }, {
                    $limit: 1
                  }))).first()))[through[1].by];
                  return (yield ((yield RelatedToCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: relatedId
                  }, {
                    $limit: 1
                  }))).first());
                }
              }))
            };
            property = {
              get: opts.get
            };
            this.metaObject.addMetaData('relations', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: PromiseT
            }, property);
          }
        }));

        // NOTE: отличается от relatedTo тем, что сама связь является обязательной (образуется между объектами "в иерархии"), а в @[opts.attr] обязательно должно храниться значение айдишника родительского объекта, которому "belongs to" - "принадлежит" этот объект
        // NOTE: если указана опция through, то получение данных о связи будет происходить не из @[opts.attr], а из промежуточной коллекции, где помимо айдишника объекта могут храниться дополнительные атрибуты с данными о связи
        _Class.public(_Class.static({
          belongsTo: FuncG([PropertyDefinitionT, RelationOptionsT])
        }, {
          default: function(typeDefinition, {refKey, attr, inverse, relation, recordName, collectionName, through, inverseType} = {}) {
            var opts, property, vsAttr;
            // recordClass = @
            [vsAttr] = Object.keys(typeDefinition);
            if (refKey == null) {
              refKey = 'id';
            }
            if (attr == null) {
              attr = `${vsAttr}Id`;
            }
            if (inverse == null) {
              inverse = `${inflect.pluralize(inflect.camelize(this.name.replace(/Record$/, ''), false))}`;
            }
            if (inverseType == null) {
              inverseType = null; // manually only string
            }
            relation = 'belongsTo';
            if (recordName == null) {
              recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                var classNames, recordClass, vsModuleName, vsRecordName;
                if (recordType != null) {
                  recordClass = this.findRecordByName(recordType);
                  classNames = _.filter(recordClass.parentClassNames(), function(name) {
                    return /.*Record$/.test(name);
                  });
                  vsRecordName = classNames[1];
                } else {
                  [vsModuleName, vsRecordName] = this.parseRecordName(vsAttr);
                }
                return vsRecordName;
              });
            }
            if (collectionName == null) {
              collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts = {
              refKey,
              attr,
              inverse,
              inverseType,
              relation,
              recordName,
              collectionName,
              through,
              get: AsyncFuncG([], RecordInterface)(co.wrap(function*() {
                var BelongsToCollection, ThroughCollection, ThroughRecord, belongsId, recordType, ref, throughEmbed;
                recordType = null;
                if (inverseType != null) {
                  recordType = this[inverseType];
                }
                BelongsToCollection = this.collection.facade.retrieveProxy(collectionName.call(this, recordType));
                // NOTE: может быть ситуация, что belongsTo связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)
                if (!through) {
                  return (yield ((yield BelongsToCollection.takeBy({
                    [`@doc.${refKey}`]: this[attr]
                  }, {
                    $limit: 1
                  }))).first());
                } else {
                  // NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                  throughEmbed = (ref = this.constructor.embeddings) != null ? ref[through[0]] : void 0;
                  if (throughEmbed == null) {
                    throw new Error(`Metadata about ${through[0]} must be defined by \`EmbeddableRecordMixin.hasEmbed\` method`);
                  }
                  ThroughCollection = this.collection.facade.retrieveProxy(throughEmbed.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(throughEmbed.recordName.call(this));
                  inverse = ThroughRecord.relations[through[1].by];
                  belongsId = ((yield ((yield ThroughCollection.takeBy({
                    [`@doc.${throughEmbed.inverse}`]: this[throughEmbed.refKey]
                  }, {
                    $limit: 1
                  }))).first()))[through[1].by];
                  return (yield ((yield BelongsToCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: belongsId
                  }, {
                    $limit: 1
                  }))).first());
                }
              }))
            };
            property = {
              get: opts.get
            };
            this.metaObject.addMetaData('relations', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: PromiseT
            }, property);
          }
        }));

        _Class.public(_Class.static({
          hasMany: FuncG([PropertyDefinitionT, RelationOptionsT])
        }, {
          default: function(typeDefinition, {refKey, inverse, relation, recordName, collectionName, through, inverseType} = {}) {
            var opts, property, vsAttr;
            // recordClass = @
            [vsAttr] = Object.keys(typeDefinition);
            if (refKey == null) {
              refKey = 'id';
            }
            if (inverse == null) {
              inverse = `${inflect.singularize(inflect.camelize(this.name.replace(/Record$/, ''), false))}Id`;
            }
            if (inverseType == null) {
              inverseType = null; // manually only string
            }
            relation = 'hasMany';
            if (recordName == null) {
              recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                var classNames, recordClass, vsModuleName, vsRecordName;
                if (recordType != null) {
                  recordClass = this.findRecordByName(recordType);
                  classNames = _.filter(recordClass.parentClassNames(), function(name) {
                    return /.*Record$/.test(name);
                  });
                  vsRecordName = classNames[1];
                } else {
                  [vsModuleName, vsRecordName] = this.parseRecordName(vsAttr);
                }
                return vsRecordName;
              });
            }
            if (collectionName == null) {
              collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts = {
              attr: null,
              refKey,
              inverse,
              inverseType,
              relation,
              recordName,
              collectionName,
              through,
              get: AsyncFuncG([], CursorInterface)(co.wrap(function*() {
                var HasManyCollection, ThroughCollection, ThroughRecord, manyIds, query, ref, ref1, throughEmbed;
                HasManyCollection = this.collection.facade.retrieveProxy(collectionName.call(this));
                if (!through) {
                  query = {
                    [`@doc.${inverse}`]: this[refKey]
                  };
                  if (inverseType != null) {
                    query[`@doc.${inverseType}`] = this.type;
                  }
                  return (yield HasManyCollection.takeBy(query));
                } else {
                  throughEmbed = (ref = (ref1 = this.constructor.embeddings) != null ? ref1[through[0]] : void 0) != null ? ref : this.constructor.relations[through[0]];
                  ThroughCollection = this.collection.facade.retrieveProxy(throughEmbed.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(throughEmbed.recordName.call(this));
                  inverse = ThroughRecord.relations[through[1].by];
                  manyIds = (yield ((yield ThroughCollection.takeBy({
                    [`@doc.${throughEmbed.inverse}`]: this[refKey]
                  }))).map(function(voRecord) {
                    return voRecord[through[1].by];
                  }));
                  return (yield HasManyCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: {
                      $in: manyIds
                    }
                  }));
                }
              }))
            };
            property = {
              get: opts.get
            };
            this.metaObject.addMetaData('relations', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: PromiseT
            }, property);
          }
        }));

        _Class.public(_Class.static({
          hasOne: FuncG([PropertyDefinitionT, RelationOptionsT])
        }, {
          default: function(typeDefinition, {refKey, inverse, relation, recordName, collectionName, through, inverseType} = {}) {
            var opts, property, vsAttr;
            // recordClass = @
            [vsAttr] = Object.keys(typeDefinition);
            if (refKey == null) {
              refKey = 'id';
            }
            if (inverse == null) {
              inverse = `${inflect.singularize(inflect.camelize(this.name.replace(/Record$/, ''), false))}Id`;
            }
            if (inverseType == null) {
              inverseType = null; // manually only string
            }
            relation = 'hasOne';
            if (recordName == null) {
              recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                var classNames, recordClass, vsModuleName, vsRecordName;
                if (recordType != null) {
                  recordClass = this.findRecordByName(recordType);
                  classNames = _.filter(recordClass.parentClassNames(), function(name) {
                    return /.*Record$/.test(name);
                  });
                  vsRecordName = classNames[1];
                } else {
                  [vsModuleName, vsRecordName] = this.parseRecordName(vsAttr);
                }
                return vsRecordName;
              });
            }
            if (collectionName == null) {
              collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts = {
              attr: null,
              refKey,
              inverse,
              inverseType,
              relation,
              recordName,
              collectionName,
              through,
              get: AsyncFuncG([], RecordInterface)(co.wrap(function*() {
                var HasOneCollection, ThroughCollection, ThroughRecord, oneId, query, ref, ref1, throughEmbed;
                HasOneCollection = this.collection.facade.retrieveProxy(collectionName.call(this));
                // NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)
                if (!through) {
                  query = {
                    [`@doc.${inverse}`]: this[refKey]
                  };
                  if (inverseType != null) {
                    query[`@doc.${inverseType}`] = this.type;
                  }
                  return (yield ((yield HasOneCollection.takeBy(query, {
                    $limit: 1
                  }))).first());
                } else {
                  throughEmbed = (ref = (ref1 = this.constructor.embeddings) != null ? ref1[through[0]] : void 0) != null ? ref : this.constructor.relations[through[0]];
                  ThroughCollection = this.collection.facade.retrieveProxy(throughEmbed.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(throughEmbed.recordName.call(this));
                  inverse = ThroughRecord.relations[through[1].by];
                  oneId = ((yield ((yield ThroughCollection.takeBy({
                    [`@doc.${throughEmbed.inverse}`]: this[refKey]
                  }, {
                    $limit: 1
                  }))).first()))[through[1].by];
                  return (yield ((yield HasOneCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: oneId
                  }, {
                    $limit: 1
                  }))).first());
                }
              }))
            };
            property = {
              get: opts.get
            };
            this.metaObject.addMetaData('relations', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: PromiseT
            }, property);
          }
        }));

        // Cucumber.inverseFor 'tomato' #-> {recordClass: App::Tomato, attrName: 'cucumbers', relation: 'hasMany'}
        _Class.public(_Class.static({
          inverseFor: FuncG(String, RelationInverseT)
        }, {
          default: function(asAttrName) {
            var RecordClass, attrName, opts, relation;
            opts = this.relations[asAttrName];
            RecordClass = this.findRecordByName(opts.recordName.call(this));
            ({
              inverse: attrName
            } = opts);
            ({relation} = RecordClass.relations[attrName]);
            return {
              recordClass: RecordClass,
              attrName,
              relation
            };
          }
        }));

        _Class.public(_Class.static({
          relations: DictG(String, RelationConfigT)
        }, {
          get: function() {
            return this.metaObject.getGroup('relations', false);
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
