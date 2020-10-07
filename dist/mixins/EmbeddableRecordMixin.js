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

  // NOTE: through источники для relatedTo и belongsTo связей с опцией through НАДО ОБЪЯВЛЯТЬ ЧЕРЕЗ hasEmbed чтобы корректно отрабатывал сеттер сохраняющий данные об айдишнике подвязанного объекта в промежуточную коллекцию
  var hasProp = {}.hasOwnProperty;

  module.exports = function(Module) {
    var AsyncFuncG, CollectionInterface, CursorInterface, DictG, EmbedConfigT, EmbedOptionsT, EmbeddableInterface, FuncG, JoiT, ListG, MaybeG, Mixin, PointerT, PropertyDefinitionT, Record, RecordInterface, SubsetG, UnionG, _, co, inflect, joi;
    ({
      PointerT,
      JoiT,
      PropertyDefinitionT,
      EmbedOptionsT,
      EmbedConfigT,
      FuncG,
      MaybeG,
      DictG,
      SubsetG,
      AsyncFuncG,
      ListG,
      UnionG,
      EmbeddableInterface,
      RecordInterface,
      CollectionInterface,
      CursorInterface,
      Record,
      Mixin,
      Utils: {_, inflect, joi, co}
    } = Module.prototype);
    return Module.defineMixin(Mixin('EmbeddableRecordMixin', function(BaseClass = Record) {
      return (function() {
        var _Class, ipoInternalRecord;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.implements(EmbeddableInterface);

        ipoInternalRecord = PointerT(_Class.instanceVariables['~internalRecord'].pointer);

        _Class.public(_Class.static({
          schema: JoiT
        }, {
          default: joi.object(),
          get: function(_data) {
            var name1;
            if (_data[name1 = this.name] == null) {
              _data[name1] = (() => {
                var ahValue, asAttr, ref, ref1, ref2, vhAttrs;
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
                ref2 = this.embeddings;
                for (asAttr in ref2) {
                  if (!hasProp.call(ref2, asAttr)) continue;
                  ahValue = ref2[asAttr];
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
            return _data[this.name];
          }
        }));

        _Class.public(_Class.static({
          relatedEmbed: FuncG([PropertyDefinitionT, EmbedOptionsT])
        }, {
          default: function(typeDefinition, opts = {}) {
            var vsAttr;
            [vsAttr] = Object.keys(typeDefinition);
            if (opts.refKey == null) {
              opts.refKey = 'id';
            }
            if (opts.inverse == null) {
              opts.inverse = `${inflect.pluralize(inflect.camelize(this.name.replace(/Record$/, ''), false))}`;
            }
            if (opts.inverseType == null) {
              opts.inverseType = null; // manually only string
            }
            if (opts.attr == null) {
              opts.attr = `${vsAttr}Id`;
            }
            opts.embedding = 'relatedEmbed';
            if (opts.through == null) {
              opts.through = null;
            }
            if (opts.putOnly == null) {
              opts.putOnly = false;
            }
            if (opts.loadOnly == null) {
              opts.loadOnly = false;
            }
            if (opts.recordName == null) {
              opts.recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
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
            if (opts.collectionName == null) {
              opts.collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(opts.recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts.validate = FuncG([], JoiT)(function() {
              var EmbedRecord;
              if (opts.inverseType != null) {
                return Record.schema.unknown(true).allow(null).optional();
              } else {
                EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                return EmbedRecord.schema.allow(null).optional();
              }
            });
            opts.load = AsyncFuncG([], RecordInterface)(co.wrap(function*() {
              var DEBUG, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, embedId, inverse, recordType, res, through;
              if (opts.putOnly) {
                return null;
              }
              recordType = null;
              if (opts.inverseType != null) {
                recordType = this[opts.inverseType];
              }
              EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this, recordType));
              ({
                // NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              res = (yield* (function*() {
                if (!opts.through) {
                  return (yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${opts.refKey}`]: this[opts.attr]
                  }, {
                    $limit: 1
                  }))).first());
                } else {
                  // NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода relatedEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                  through = this.constructor.embeddings[opts.through[0]];
                  if (through == null) {
                    throw new Error(`Metadata about ${opts.through[0]} must be defined by \`EmbeddableRecordMixin.relatedEmbed\` method`);
                  }
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  embedId = ((yield ((yield ThroughCollection.takeBy({
                    [`@doc.${through.inverse}`]: this[through.refKey]
                  }, {
                    $limit: 1
                  }))).first()))[opts.through[1].by];
                  return (yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: embedId
                  }, {
                    $limit: 1
                  }))).first());
                }
              }).call(this));
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbed.load ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.put = AsyncFuncG([])(co.wrap(function*() {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, aoRecord, inverse, savedRecord, through;
              if (opts.loadOnly) {
                return;
              }
              EmbedsCollection = null;
              EmbedRecord = null;
              aoRecord = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbed.put ${vsAttr} embed ${JSON.stringify(aoRecord)}`, LEVELS[DEBUG]);
              if (aoRecord != null) {
                if (aoRecord.constructor === Object) {
                  if (opts.inverseType != null) {
                    if (aoRecord.type == null) {
                      throw new Error('When set polymorphic relatedEmbed `type` is required');
                    }
                    EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this, aoRecord.type));
                    EmbedRecord = this.findRecordByName(aoRecord.type);
                  } else {
                    EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
                    EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                  }
                  if (aoRecord.type == null) {
                    aoRecord.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                  }
                  aoRecord = (yield EmbedsCollection.build(aoRecord));
                }
                if (!opts.through) {
                  if (this.spaceId != null) {
                    aoRecord.spaceId = this.spaceId;
                  }
                  if (this.teamId != null) {
                    aoRecord.teamId = this.teamId;
                  }
                  aoRecord.spaces = this.spaces;
                  aoRecord.creatorId = this.creatorId;
                  aoRecord.editorId = this.editorId;
                  aoRecord.ownerId = this.ownerId;
                  if (((yield aoRecord.isNew())) || Object.keys((yield aoRecord.changedAttributes())).length) {
                    savedRecord = (yield aoRecord.save());
                  } else {
                    savedRecord = aoRecord;
                  }
                  this[opts.attr] = savedRecord[opts.refKey];
                  if (opts.inverseType != null) {
                    this[opts.inverseType] = savedRecord.type;
                  }
                } else {
                  // NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода relatedEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                  through = this.constructor.embeddings[opts.through[0]];
                  if (through == null) {
                    throw new Error(`Metadata about ${opts.through[0]} must be defined by \`EmbeddableRecordMixin.relatedEmbed\` method`);
                  }
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  if (this.spaceId != null) {
                    aoRecord.spaceId = this.spaceId;
                  }
                  if (this.teamId != null) {
                    aoRecord.teamId = this.teamId;
                  }
                  aoRecord.spaces = this.spaces;
                  aoRecord.creatorId = this.creatorId;
                  aoRecord.editorId = this.editorId;
                  aoRecord.ownerId = this.ownerId;
                  if ((yield aoRecord.isNew())) {
                    savedRecord = (yield aoRecord.save());
                    yield ThroughCollection.create({
                      [`${through.inverse}`]: this[through.refKey],
                      [`${opts.through[1].by}`]: savedRecord[inverse.refKey],
                      spaceId: this.spaceId != null ? this.spaceId : void 0,
                      teamId: this.teamId != null ? this.teamId : void 0,
                      spaces: this.spaces,
                      creatorId: this.creatorId,
                      editorId: this.editorId,
                      ownerId: this.ownerId
                    });
                  } else {
                    if (Object.keys((yield aoRecord.changedAttributes())).length) {
                      savedRecord = (yield aoRecord.save());
                    } else {
                      savedRecord = aoRecord;
                    }
                  }
                  yield ((yield ThroughCollection.takeBy({
                    [`@doc.${through.inverse}`]: this[through.refKey],
                    [`@doc.${opts.through[1].by}`]: {
                      $ne: savedRecord[inverse.refKey]
                    }
                  }))).forEach(co.wrap(function*(voRecord) {
                    yield voRecord.destroy();
                  }));
                }
              }
            }));
            opts.restore = AsyncFuncG([MaybeG(Object)], MaybeG(RecordInterface))(co.wrap(function*(replica) {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, res;
              EmbedsCollection = null;
              EmbedRecord = null;
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbed.restore ${vsAttr} replica ${JSON.stringify(replica)}`, LEVELS[DEBUG]);
              res = (yield* (function*() {
                if (replica != null) {
                  if (opts.inverseType != null) {
                    if (replica.type == null) {
                      throw new Error('When set polymorphic relatedEmbed `type` is required');
                    }
                    EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this, replica.type));
                    EmbedRecord = this.findRecordByName(replica.type);
                  } else {
                    EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
                    EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                  }
                  if (replica.type == null) {
                    replica.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                  }
                  return (yield EmbedsCollection.build(replica));
                } else {
                  return null;
                }
              }).call(this));
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbed.restore ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.replicate = FuncG([], Object)(function() {
              var DEBUG, LEVELS, SEND_TO_LOG, aoRecord, res;
              aoRecord = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbed.replicate ${vsAttr} embed ${JSON.stringify(aoRecord)}`, LEVELS[DEBUG]);
              res = aoRecord.constructor.objectize(aoRecord);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbed.replicate ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            });
            this.metaObject.addMetaData('embeddings', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: MaybeG(UnionG(RecordInterface, Object))
            });
          }
        }));

        _Class.public(_Class.static({
          relatedEmbeds: FuncG([PropertyDefinitionT, EmbedOptionsT])
        }, {
          default: function(typeDefinition, opts = {}) {
            var vsAttr;
            [vsAttr] = Object.keys(typeDefinition);
            if (opts.refKey == null) {
              opts.refKey = 'id';
            }
            if (opts.inverse == null) {
              opts.inverse = `${inflect.pluralize(inflect.camelize(this.name.replace(/Record$/, ''), false))}`;
            }
            if (opts.inverseType == null) {
              opts.inverseType = null; // manually only string
            }
            if (opts.attr == null) {
              opts.attr = `${inflect.pluralize(inflect.camelize(vsAttr, false))}`;
            }
            opts.embedding = 'relatedEmbeds';
            if (opts.through == null) {
              opts.through = null;
            }
            if (opts.putOnly == null) {
              opts.putOnly = false;
            }
            if (opts.loadOnly == null) {
              opts.loadOnly = false;
            }
            if (opts.recordName == null) {
              opts.recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
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
            if (opts.collectionName == null) {
              opts.collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(opts.recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts.validate = FuncG([], JoiT)(function() {
              var EmbedRecord;
              if (typeof inverseType !== "undefined" && inverseType !== null) {
                return joi.array().items([Record.schema.unknown(true), joi.any().strip()]);
              } else {
                EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                return joi.array().items([EmbedRecord.schema, joi.any().strip()]);
              }
            });
            opts.load = AsyncFuncG([], ListG(RecordInterface))(co.wrap(function*() {
              var DEBUG, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, embedIds, id, inverse, inverseType, res, through;
              if (opts.putOnly) {
                return null;
              }
              EmbedsCollection = null;
              ({
                // NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              res = (yield* (function*() {
                var i, len, ref, ref1, ref2, results;
                if (!opts.through) {
                  if (opts.inverseType != null) {
                    ref = this[opts.attr];
                    results = [];
                    for (i = 0, len = ref.length; i < len; i++) {
                      ({id, inverseType} = ref[i]);
                      EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this, inverseType));
                      results.push((yield EmbedsCollection.take(id)));
                    }
                    return results;
                  } else {
                    EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
                    return (yield ((yield EmbedsCollection.takeBy({
                      [`@doc.${opts.refKey}`]: {
                        $in: this[opts.attr]
                      }
                    }))).toArray());
                  }
                } else {
                  through = (ref1 = this.constructor.embeddings[opts.through[0]]) != null ? ref1 : (ref2 = this.constructor.relations) != null ? ref2[opts.through[0]] : void 0;
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  embedIds = (yield ((yield ThroughCollection.takeBy({
                    [`@doc.${through.inverse}`]: this[through.refKey]
                  }))).map(function(voRecord) {
                    return voRecord[opts.through[1].by];
                  }));
                  return (yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: {
                      $in: embedIds
                    }
                  }))).toArray());
                }
              }).call(this));
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbeds.load ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.put = AsyncFuncG([])(co.wrap(function*() {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, alRecordIds, alRecords, aoRecord, i, id, inverse, inverseType, j, k, len, len1, len2, newRecordId, newRecordIds, ref, ref1, savedRecord, through;
              if (opts.loadOnly) {
                return;
              }
              EmbedsCollection = null;
              EmbedRecord = null;
              alRecords = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbeds.put ${vsAttr} embeds ${JSON.stringify(alRecords)}`, LEVELS[DEBUG]);
              if (alRecords.length > 0) {
                if (!opts.through) {
                  alRecordIds = [];
                  for (i = 0, len = alRecords.length; i < len; i++) {
                    aoRecord = alRecords[i];
                    if (aoRecord.constructor === Object) {
                      if (opts.inverseType != null) {
                        if (aoRecord.type == null) {
                          throw new Error('When set polymorphic relatedEmbeds `type` is required');
                        }
                        EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this, aoRecord.type));
                        EmbedRecord = this.findRecordByName(aoRecord.type);
                      } else {
                        EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
                        EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                      }
                      if (aoRecord.type == null) {
                        aoRecord.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                      }
                      aoRecord = (yield EmbedsCollection.build(aoRecord));
                    }
                    if (this.spaceId != null) {
                      aoRecord.spaceId = this.spaceId;
                    }
                    if (this.teamId != null) {
                      aoRecord.teamId = this.teamId;
                    }
                    aoRecord.spaces = this.spaces;
                    aoRecord.creatorId = this.creatorId;
                    aoRecord.editorId = this.editorId;
                    aoRecord.ownerId = this.ownerId;
                    if (((yield aoRecord.isNew())) || Object.keys((yield aoRecord.changedAttributes())).length) {
                      ({
                        id,
                        type: inverseType
                      } = (yield aoRecord.save()));
                    } else {
                      ({
                        id,
                        type: inverseType
                      } = aoRecord);
                    }
                    if (opts.inverseType != null) {
                      alRecordIds.push({id, inverseType});
                    } else {
                      alRecordIds.push(id);
                    }
                  }
                  this[opts.attr] = alRecordIds;
                } else {
                  through = (ref = this.constructor.embeddings[opts.through[0]]) != null ? ref : (ref1 = this.constructor.relations) != null ? ref1[opts.through[0]] : void 0;
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  alRecordIds = [];
                  newRecordIds = [];
                  for (j = 0, len1 = alRecords.length; j < len1; j++) {
                    aoRecord = alRecords[j];
                    if (aoRecord.constructor === Object) {
                      if (aoRecord.type == null) {
                        aoRecord.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                      }
                      aoRecord = (yield EmbedsCollection.build(aoRecord));
                    }
                    if (this.spaceId != null) {
                      aoRecord.spaceId = this.spaceId;
                    }
                    if (this.teamId != null) {
                      aoRecord.teamId = this.teamId;
                    }
                    aoRecord.spaces = this.spaces;
                    aoRecord.creatorId = this.creatorId;
                    aoRecord.editorId = this.editorId;
                    aoRecord.ownerId = this.ownerId;
                    if ((yield aoRecord.isNew())) {
                      savedRecord = (yield aoRecord.save());
                      alRecordIds.push(savedRecord[inverse.refKey]);
                      newRecordIds.push(savedRecord[inverse.refKey]);
                    } else {
                      if (Object.keys((yield aoRecord.changedAttributes())).length) {
                        savedRecord = (yield aoRecord.save());
                      } else {
                        savedRecord = aoRecord;
                      }
                      alRecordIds.push(savedRecord[inverse.refKey]);
                    }
                  }
                  if (!opts.putOnly) {
                    yield ((yield ThroughCollection.takeBy({
                      [`@doc.${through.inverse}`]: this[through.refKey],
                      [`@doc.${opts.through[1].by}`]: {
                        $nin: alRecordIds
                      }
                    }))).forEach(co.wrap(function*(voRecord) {
                      yield voRecord.destroy();
                    }));
                  }
                  for (k = 0, len2 = newRecordIds.length; k < len2; k++) {
                    newRecordId = newRecordIds[k];
                    yield ThroughCollection.create({
                      [`${through.inverse}`]: this[through.refKey],
                      [`${opts.through[1].by}`]: newRecordId,
                      spaceId: this.spaceId != null ? this.spaceId : void 0,
                      teamId: this.teamId != null ? this.teamId : void 0,
                      spaces: this.spaces,
                      creatorId: this.creatorId,
                      editorId: this.editorId,
                      ownerId: this.ownerId
                    });
                  }
                }
              }
            }));
            opts.restore = AsyncFuncG([MaybeG(Object)], ListG(RecordInterface))(co.wrap(function*(replica) {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, item, res;
              EmbedsCollection = null;
              EmbedRecord = null;
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbeds.restore ${vsAttr} replica ${JSON.stringify(replica)}`, LEVELS[DEBUG]);
              res = (yield* (function*() {
                var i, len, results;
                if ((replica != null) && replica.length > 0) {
                  results = [];
                  for (i = 0, len = replica.length; i < len; i++) {
                    item = replica[i];
                    if (opts.inverseType != null) {
                      if (replica.type == null) {
                        throw new Error('When set polymorphic relatedEmbeds `type` is required');
                      }
                      EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this, replica.type));
                      EmbedRecord = this.findRecordByName(replica.type);
                    } else {
                      EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
                      EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                    }
                    if (item.type == null) {
                      item.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                    }
                    results.push((yield EmbedsCollection.build(item)));
                  }
                  return results;
                } else {
                  return [];
                }
              }).call(this));
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbeds.restore ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.replicate = FuncG([], ListG(Object))(function() {
              var DEBUG, EmbedRecord, LEVELS, SEND_TO_LOG, alRecords, item, res;
              alRecords = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbeds.replicate ${vsAttr} embed ${JSON.stringify(alRecords)}`, LEVELS[DEBUG]);
              res = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = alRecords.length; i < len; i++) {
                  item = alRecords[i];
                  EmbedRecord = item.constructor;
                  results.push(EmbedRecord.objectize(item));
                }
                return results;
              })();
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.relatedEmbeds.replicate ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            });
            this.metaObject.addMetaData('embeddings', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: MaybeG(ListG(UnionG(RecordInterface, Object)))
            });
          }
        }));

        _Class.public(_Class.static({
          hasEmbed: FuncG([PropertyDefinitionT, EmbedOptionsT])
        }, {
          default: function(typeDefinition, opts = {}) {
            var vsAttr;
            [vsAttr] = Object.keys(typeDefinition);
            if (opts.refKey == null) {
              opts.refKey = 'id';
            }
            if (opts.inverse == null) {
              opts.inverse = `${inflect.singularize(inflect.camelize(this.name.replace(/Record$/, ''), false))}Id`;
            }
            opts.attr = null;
            if (opts.inverseType == null) {
              opts.inverseType = null; // manually only string
            }
            opts.embedding = 'hasEmbed';
            if (opts.through == null) {
              opts.through = null;
            }
            if (opts.putOnly == null) {
              opts.putOnly = false;
            }
            if (opts.loadOnly == null) {
              opts.loadOnly = false;
            }
            if (opts.recordName == null) {
              opts.recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
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
            if (opts.collectionName == null) {
              opts.collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(opts.recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts.validate = FuncG([], JoiT)(function() {
              var EmbedRecord;
              if (opts.inverseType != null) {
                return Record.schema.unknown(true).allow(null).optional();
              } else {
                EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                return EmbedRecord.schema.allow(null).optional();
              }
            });
            opts.load = AsyncFuncG([], RecordInterface)(co.wrap(function*() {
              var DEBUG, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, embedId, inverse, query, res, through;
              if (opts.putOnly) {
                return null;
              }
              EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
              ({
                // NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              res = (yield* (function*() {
                if (!opts.through) {
                  query = {
                    [`@doc.${opts.inverse}`]: this[opts.refKey]
                  };
                  if (typeof inverseType !== "undefined" && inverseType !== null) {
                    query[`@doc.${opts.inverseType}`] = this.type;
                  }
                  return (yield ((yield EmbedsCollection.takeBy(query, {
                    $limit: 1
                  }))).first());
                } else {
                  // NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                  through = this.constructor.embeddings[opts.through[0]];
                  if (through == null) {
                    throw new Error(`Metadata about ${opts.through[0]} must be defined by \`EmbeddableRecordMixin.hasEmbed\` method`);
                  }
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  embedId = ((yield ((yield ThroughCollection.takeBy({
                    [`@doc.${through.inverse}`]: this[opts.refKey]
                  }, {
                    $limit: 1
                  }))).first()))[opts.through[1].by];
                  return (yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: embedId
                  }, {
                    $limit: 1
                  }))).first());
                }
              }).call(this));
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbed.load ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.put = AsyncFuncG([])(co.wrap(function*() {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, aoRecord, embedIds, inverse, query, savedRecord, through, voRecord;
              if (opts.loadOnly) {
                return;
              }
              EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
              EmbedRecord = this.findRecordByName(opts.recordName.call(this));
              aoRecord = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbed.put ${vsAttr} embed ${JSON.stringify(aoRecord)}`, LEVELS[DEBUG]);
              if (aoRecord != null) {
                if (aoRecord.constructor === Object) {
                  if (aoRecord.type == null) {
                    aoRecord.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                  }
                  aoRecord = (yield EmbedsCollection.build(aoRecord));
                }
                if (!opts.through) {
                  aoRecord[opts.inverse] = this[opts.refKey];
                  if (opts.inverseType != null) {
                    aoRecord[opts.inverseType] = this.type;
                  }
                  if (this.spaceId != null) {
                    aoRecord.spaceId = this.spaceId;
                  }
                  if (this.teamId != null) {
                    aoRecord.teamId = this.teamId;
                  }
                  aoRecord.spaces = this.spaces;
                  aoRecord.creatorId = this.creatorId;
                  aoRecord.editorId = this.editorId;
                  aoRecord.ownerId = this.ownerId;
                  if (((yield aoRecord.isNew())) || Object.keys((yield aoRecord.changedAttributes())).length) {
                    savedRecord = (yield aoRecord.save());
                  } else {
                    savedRecord = aoRecord;
                  }
                  query = {
                    [`@doc.${opts.inverse}`]: this[opts.refKey],
                    "@doc.id": {
                      $ne: savedRecord.id // NOTE: проверяем по айдишнику только-что сохраненного
                    }
                  };
                  if (typeof inverseType !== "undefined" && inverseType !== null) {
                    query[`@doc.${opts.inverseType}`] = this.type;
                  }
                  yield ((yield EmbedsCollection.takeBy(query))).forEach(co.wrap(function*(voRecord) {
                    return (yield voRecord.destroy());
                  }));
                } else {
                  // NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                  through = this.constructor.embeddings[opts.through[0]];
                  if (through == null) {
                    throw new Error(`Metadata about ${opts.through[0]} must be defined by \`EmbeddableRecordMixin.hasEmbed\` method`);
                  }
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  if (this.spaceId != null) {
                    aoRecord.spaceId = this.spaceId;
                  }
                  if (this.teamId != null) {
                    aoRecord.teamId = this.teamId;
                  }
                  aoRecord.spaces = this.spaces;
                  aoRecord.creatorId = this.creatorId;
                  aoRecord.editorId = this.editorId;
                  aoRecord.ownerId = this.ownerId;
                  if ((yield aoRecord.isNew())) {
                    savedRecord = (yield aoRecord.save());
                    yield ThroughCollection.create({
                      [`${through.inverse}`]: this[opts.refKey],
                      [`${opts.through[1].by}`]: savedRecord[inverse.refKey],
                      spaceId: this.spaceId != null ? this.spaceId : void 0,
                      teamId: this.teamId != null ? this.teamId : void 0,
                      spaces: this.spaces,
                      creatorId: this.creatorId,
                      editorId: this.editorId,
                      ownerId: this.ownerId
                    });
                  } else {
                    if (Object.keys((yield aoRecord.changedAttributes())).length) {
                      savedRecord = (yield aoRecord.save());
                    } else {
                      savedRecord = aoRecord;
                    }
                  }
                  embedIds = (yield ((yield ThroughCollection.takeBy({
                    [`@doc.${through.inverse}`]: this[opts.refKey],
                    [`@doc.${opts.through[1].by}`]: {
                      $ne: savedRecord[inverse.refKey]
                    }
                  }))).map(co.wrap(function*(voRecord) {
                    var id;
                    id = voRecord[opts.through[1].by];
                    yield voRecord.destroy();
                    return id;
                  })));
                  yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: {
                      $in: embedIds
                    }
                  }))).forEach(co.wrap(function*(voRecord) {
                    return (yield voRecord.destroy());
                  }));
                }
              } else if (!opts.putOnly) {
                if (!opts.through) {
                  voRecord = (yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${opts.inverse}`]: this[opts.refKey]
                  }, {
                    $limit: 1
                  }))).first());
                  if (voRecord != null) {
                    yield voRecord.destroy();
                  }
                } else {
                  // NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                  through = this.constructor.embeddings[opts.through[0]];
                  if (through == null) {
                    throw new Error(`Metadata about ${opts.through[0]} must be defined by \`EmbeddableRecordMixin.hasEmbed\` method`);
                  }
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  embedIds = (yield ((yield ThroughCollection.takeBy({
                    [`@doc.${through.inverse}`]: this[opts.refKey]
                  }, {
                    $limit: 1
                  }))).map(co.wrap(function*(voRecord) {
                    var id;
                    id = voRecord[opts.through[1].by];
                    yield voRecord.destroy();
                    return id;
                  })));
                  yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: {
                      $in: embedIds
                    }
                  }, {
                    $limit: 1
                  }))).forEach(co.wrap(function*(voRecord) {
                    return (yield voRecord.destroy());
                  }));
                }
              }
            }));
            opts.restore = AsyncFuncG([MaybeG(Object)], MaybeG(RecordInterface))(co.wrap(function*(replica) {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, res;
              EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
              EmbedRecord = this.findRecordByName(opts.recordName.call(this));
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbed.restore ${vsAttr} replica ${JSON.stringify(replica)}`, LEVELS[DEBUG]);
              res = replica != null ? (replica.type != null ? replica.type : replica.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`, (yield EmbedsCollection.build(replica))) : null;
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbed.restore ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.replicate = FuncG([], Object)(function() {
              var DEBUG, LEVELS, SEND_TO_LOG, aoRecord, res;
              aoRecord = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbed.replicate ${vsAttr} embed ${JSON.stringify(aoRecord)}`, LEVELS[DEBUG]);
              res = aoRecord.constructor.objectize(aoRecord);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbed.replicate ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            });
            this.metaObject.addMetaData('embeddings', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: MaybeG(UnionG(RecordInterface, Object))
            });
          }
        }));

        _Class.public(_Class.static({
          hasEmbeds: FuncG([PropertyDefinitionT, EmbedOptionsT])
        }, {
          default: function(typeDefinition, opts = {}) {
            var vsAttr;
            [vsAttr] = Object.keys(typeDefinition);
            if (opts.refKey == null) {
              opts.refKey = 'id';
            }
            if (opts.inverse == null) {
              opts.inverse = `${inflect.singularize(inflect.camelize(this.name.replace(/Record$/, ''), false))}Id`;
            }
            opts.attr = null;
            if (opts.inverseType == null) {
              opts.inverseType = null; // manually only string
            }
            opts.embedding = 'hasEmbeds';
            if (opts.through == null) {
              opts.through = null;
            }
            if (opts.putOnly == null) {
              opts.putOnly = false;
            }
            if (opts.loadOnly == null) {
              opts.loadOnly = false;
            }
            if (opts.recordName == null) {
              opts.recordName = FuncG([MaybeG(String)], String)(function(recordType = null) {
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
            if (opts.collectionName == null) {
              opts.collectionName = FuncG([MaybeG(String)], String)(function(recordType = null) {
                return `${inflect.pluralize(opts.recordName.call(this, recordType).replace(/Record$/, ''))}Collection`;
              });
            }
            opts.validate = FuncG([], JoiT)(function() {
              var EmbedRecord;
              if (typeof inverseType !== "undefined" && inverseType !== null) {
                return joi.array().items([Record.schema.unknown(true), joi.any().strip()]);
              } else {
                EmbedRecord = this.findRecordByName(opts.recordName.call(this));
                return joi.array().items([EmbedRecord.schema, joi.any().strip()]);
              }
            });
            opts.load = AsyncFuncG([], ListG(RecordInterface))(co.wrap(function*() {
              var DEBUG, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, embedIds, inverse, query, ref, ref1, res, through;
              if (opts.putOnly) {
                return [];
              }
              EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              res = !opts.through ? (query = {
                [`@doc.${opts.inverse}`]: this[opts.refKey]
              }, typeof inverseType !== "undefined" && inverseType !== null ? query[`@doc.${opts.inverseType}`] = this.type : void 0, (yield ((yield EmbedsCollection.takeBy(query))).toArray())) : (through = (ref = this.constructor.embeddings[opts.through[0]]) != null ? ref : (ref1 = this.constructor.relations) != null ? ref1[opts.through[0]] : void 0, ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this)), ThroughRecord = this.findRecordByName(through.recordName.call(this)), inverse = ThroughRecord.relations[opts.through[1].by], embedIds = (yield ((yield ThroughCollection.takeBy({
                [`@doc.${through.inverse}`]: this[opts.refKey]
              }))).map(function(voRecord) {
                return voRecord[opts.through[1].by];
              })), (yield ((yield EmbedsCollection.takeBy({
                [`@doc.${inverse.refKey}`]: {
                  $in: embedIds
                }
              }))).toArray()));
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbeds.load ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.put = AsyncFuncG([])(co.wrap(function*() {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, ThroughCollection, ThroughRecord, alRecordIds, alRecords, aoRecord, embedIds, i, id, inverse, j, k, len, len1, len2, newRecordId, newRecordIds, query, ref, ref1, ref2, ref3, savedRecord, through;
              if (opts.loadOnly) {
                return;
              }
              EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
              EmbedRecord = this.findRecordByName(opts.recordName.call(this));
              alRecords = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbeds.put ${vsAttr} embeds ${JSON.stringify(alRecords)}`, LEVELS[DEBUG]);
              if (alRecords.length > 0) {
                if (!opts.through) {
                  alRecordIds = [];
                  for (i = 0, len = alRecords.length; i < len; i++) {
                    aoRecord = alRecords[i];
                    if (aoRecord.constructor === Object) {
                      if (aoRecord.type == null) {
                        aoRecord.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                      }
                      aoRecord = (yield EmbedsCollection.build(aoRecord));
                    }
                    aoRecord[opts.inverse] = this[opts.refKey];
                    if (opts.inverseType != null) {
                      aoRecord[opts.inverseType] = this.type;
                    }
                    if (this.spaceId != null) {
                      aoRecord.spaceId = this.spaceId;
                    }
                    if (this.teamId != null) {
                      aoRecord.teamId = this.teamId;
                    }
                    aoRecord.spaces = this.spaces;
                    aoRecord.creatorId = this.creatorId;
                    aoRecord.editorId = this.editorId;
                    aoRecord.ownerId = this.ownerId;
                    if (((yield aoRecord.isNew())) || Object.keys((yield aoRecord.changedAttributes())).length) {
                      ({id} = (yield aoRecord.save()));
                    } else {
                      ({id} = aoRecord);
                    }
                    alRecordIds.push(id);
                  }
                  if (!opts.putOnly) {
                    query = {
                      [`@doc.${opts.inverse}`]: this[opts.refKey],
                      "@doc.id": {
                        $nin: alRecordIds // NOTE: проверяем айдишники всех только-что сохраненных
                      }
                    };
                    if (typeof inverseType !== "undefined" && inverseType !== null) {
                      query[`@doc.${opts.inverseType}`] = this.type;
                    }
                    yield ((yield EmbedsCollection.takeBy(query))).forEach(co.wrap(function*(voRecord) {
                      return (yield voRecord.destroy());
                    }));
                  }
                } else {
                  through = (ref = this.constructor.embeddings[opts.through[0]]) != null ? ref : (ref1 = this.constructor.relations) != null ? ref1[opts.through[0]] : void 0;
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  alRecordIds = [];
                  newRecordIds = [];
                  for (j = 0, len1 = alRecords.length; j < len1; j++) {
                    aoRecord = alRecords[j];
                    if (aoRecord.constructor === Object) {
                      if (aoRecord.type == null) {
                        aoRecord.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                      }
                      aoRecord = (yield EmbedsCollection.build(aoRecord));
                    }
                    if (this.spaceId != null) {
                      aoRecord.spaceId = this.spaceId;
                    }
                    if (this.teamId != null) {
                      aoRecord.teamId = this.teamId;
                    }
                    aoRecord.spaces = this.spaces;
                    aoRecord.creatorId = this.creatorId;
                    aoRecord.editorId = this.editorId;
                    aoRecord.ownerId = this.ownerId;
                    if ((yield aoRecord.isNew())) {
                      savedRecord = (yield aoRecord.save());
                      alRecordIds.push(savedRecord[inverse.refKey]);
                      newRecordIds.push(savedRecord[inverse.refKey]);
                    } else {
                      if (Object.keys((yield aoRecord.changedAttributes())).length) {
                        savedRecord = (yield aoRecord.save());
                      } else {
                        savedRecord = aoRecord;
                      }
                      alRecordIds.push(savedRecord[inverse.refKey]);
                    }
                  }
                  if (!opts.putOnly) {
                    embedIds = (yield ((yield ThroughCollection.takeBy({
                      [`@doc.${through.inverse}`]: this[opts.refKey],
                      [`@doc.${opts.through[1].by}`]: {
                        $nin: alRecordIds
                      }
                    }))).map(co.wrap(function*(voRecord) {
                      id = voRecord[opts.through[1].by];
                      yield voRecord.destroy();
                      return id;
                    })));
                    yield ((yield EmbedsCollection.takeBy({
                      [`@doc.${inverse.refKey}`]: {
                        $in: embedIds
                      }
                    }))).forEach(co.wrap(function*(voRecord) {
                      return (yield voRecord.destroy());
                    }));
                  }
                  for (k = 0, len2 = newRecordIds.length; k < len2; k++) {
                    newRecordId = newRecordIds[k];
                    yield ThroughCollection.create({
                      [`${through.inverse}`]: this[opts.refKey],
                      [`${opts.through[1].by}`]: newRecordId,
                      spaceId: this.spaceId != null ? this.spaceId : void 0,
                      teamId: this.teamId != null ? this.teamId : void 0,
                      spaces: this.spaces,
                      creatorId: this.creatorId,
                      editorId: this.editorId,
                      ownerId: this.ownerId
                    });
                  }
                }
              } else if (!opts.putOnly) {
                if (!opts.through) {
                  yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${opts.inverse}`]: this[opts.refKey]
                  }))).forEach(co.wrap(function*(voRecord) {
                    return (yield voRecord.destroy());
                  }));
                } else {
                  through = (ref2 = this.constructor.embeddings[opts.through[0]]) != null ? ref2 : (ref3 = this.constructor.relations) != null ? ref3[opts.through[0]] : void 0;
                  ThroughCollection = this.collection.facade.retrieveProxy(through.collectionName.call(this));
                  ThroughRecord = this.findRecordByName(through.recordName.call(this));
                  inverse = ThroughRecord.relations[opts.through[1].by];
                  embedIds = (yield ((yield ThroughCollection.takeBy({
                    [`@doc.${through.inverse}`]: this[opts.refKey]
                  }))).map(co.wrap(function*(voRecord) {
                    id = voRecord[opts.through[1].by];
                    yield voRecord.destroy();
                    return id;
                  })));
                  yield ((yield EmbedsCollection.takeBy({
                    [`@doc.${inverse.refKey}`]: {
                      $in: embedIds
                    }
                  }))).forEach(co.wrap(function*(voRecord) {
                    return (yield voRecord.destroy());
                  }));
                }
              }
            }));
            opts.restore = AsyncFuncG([MaybeG(Object)], ListG(RecordInterface))(co.wrap(function*(replica) {
              var DEBUG, EmbedRecord, EmbedsCollection, LEVELS, SEND_TO_LOG, item, res;
              EmbedsCollection = this.collection.facade.retrieveProxy(opts.collectionName.call(this));
              EmbedRecord = this.findRecordByName(opts.recordName.call(this));
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbeds.restore ${vsAttr} replica ${JSON.stringify(replica)}`, LEVELS[DEBUG]);
              res = (yield* (function*() {
                var i, len, results;
                if ((replica != null) && replica.length > 0) {
                  results = [];
                  for (i = 0, len = replica.length; i < len; i++) {
                    item = replica[i];
                    if (item.type == null) {
                      item.type = `${EmbedRecord.moduleName()}::${EmbedRecord.name}`;
                    }
                    results.push((yield EmbedsCollection.build(item)));
                  }
                  return results;
                } else {
                  return [];
                }
              })());
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbeds.restore ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            }));
            opts.replicate = FuncG([], ListG(Object))(function() {
              var DEBUG, EmbedRecord, LEVELS, SEND_TO_LOG, alRecords, item, res;
              alRecords = this[vsAttr];
              ({
                LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
              } = Module.prototype);
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbeds.replicate ${vsAttr} embeds ${JSON.stringify(alRecords)}`, LEVELS[DEBUG]);
              res = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = alRecords.length; i < len; i++) {
                  item = alRecords[i];
                  EmbedRecord = item.constructor;
                  results.push(EmbedRecord.objectize(item));
                }
                return results;
              })();
              this.collection.sendNotification(SEND_TO_LOG, `EmbeddableRecordMixin.hasEmbeds.replicate ${vsAttr} result ${JSON.stringify(res)}`, LEVELS[DEBUG]);
              return res;
            });
            this.metaObject.addMetaData('embeddings', vsAttr, opts);
            this.public({
              [`${vsAttr}`]: MaybeG(ListG(UnionG(RecordInterface, Object)))
            });
          }
        }));

        _Class.public(_Class.static({
          embeddings: DictG(String, EmbedConfigT)
        }, {
          get: function() {
            return this.metaObject.getGroup('embeddings', false);
          }
        }));

        _Class.public(_Class.static(_Class.async({
          normalize: FuncG([MaybeG(Object), CollectionInterface], RecordInterface)
        }, {
          default: function*(...args) {
            var asAttr, load, ref, voRecord;
            voRecord = (yield this.super(...args));
            ref = voRecord.constructor.embeddings;
            for (asAttr in ref) {
              if (!hasProp.call(ref, asAttr)) continue;
              ({load} = ref[asAttr]);
              voRecord[asAttr] = (yield load.call(voRecord));
            }
            voRecord[ipoInternalRecord] = voRecord.constructor.makeSnapshotWithEmbeds(voRecord);
            return voRecord;
          }
        })));

        _Class.public(_Class.static(_Class.async({
          serialize: FuncG([MaybeG(RecordInterface)], MaybeG(Object))
        }, {
          default: function*(aoRecord) {
            var asAttr, put, ref, vhResult;
            ref = aoRecord.constructor.embeddings;
            for (asAttr in ref) {
              if (!hasProp.call(ref, asAttr)) continue;
              ({put} = ref[asAttr]);
              yield put.call(aoRecord);
            }
            vhResult = (yield this.super(aoRecord));
            return vhResult;
          }
        })));

        _Class.public(_Class.static(_Class.async({
          recoverize: FuncG([MaybeG(Object), CollectionInterface], MaybeG(RecordInterface))
        }, {
          default: function*(...args) {
            var ahPayload, asAttr, ref, restore, voRecord;
            [ahPayload] = args;
            voRecord = (yield this.super(...args));
            ref = voRecord.constructor.embeddings;
            for (asAttr in ref) {
              if (!hasProp.call(ref, asAttr)) continue;
              ({restore} = ref[asAttr]);
              if (asAttr in ahPayload) {
                voRecord[asAttr] = (yield restore.call(voRecord, ahPayload[asAttr]));
              }
            }
            return voRecord;
          }
        })));

        _Class.public(_Class.static({
          objectize: FuncG([MaybeG(RecordInterface), MaybeG(Object)], MaybeG(Object))
        }, {
          default: function(...args) {
            var aoRecord, asAttr, ref, replicate, vhResult;
            [aoRecord] = args;
            vhResult = this.super(...args);
            ref = aoRecord.constructor.embeddings;
            for (asAttr in ref) {
              if (!hasProp.call(ref, asAttr)) continue;
              ({replicate} = ref[asAttr]);
              if (aoRecord[asAttr] != null) {
                vhResult[asAttr] = replicate.call(aoRecord);
              }
            }
            return vhResult;
          }
        }));

        _Class.public(_Class.static({
          makeSnapshotWithEmbeds: FuncG(RecordInterface, MaybeG(Object))
        }, {
          default: function(aoRecord) {
            var asAttr, ref, replicate, vhResult;
            vhResult = aoRecord[ipoInternalRecord];
            ref = aoRecord.constructor.embeddings;
            for (asAttr in ref) {
              if (!hasProp.call(ref, asAttr)) continue;
              ({replicate} = ref[asAttr]);
              vhResult[asAttr] = replicate.call(aoRecord);
            }
            return vhResult;
          }
        }));

        _Class.public(_Class.async({
          reloadRecord: FuncG(UnionG(Object, RecordInterface))
        }, {
          default: function*(response) {
            var asEmbed, ref;
            yield this.super(response);
            if (response != null) {
              ref = this.constructor.embeddings;
              for (asEmbed in ref) {
                if (!hasProp.call(ref, asEmbed)) continue;
                this[asEmbed] = response[asEmbed];
              }
              this[ipoInternalRecord] = response[ipoInternalRecord];
            }
          }
        }));

        // TODO: не учтены установки значений, которые раньше не были установлены
        _Class.public(_Class.async({
          changedAttributes: FuncG([], DictG(String, Array))
        }, {
          default: function*() {
            var ref, ref1, replicate, vhResult, voNewValue, voOldValue, vsAttrName;
            vhResult = (yield this.super());
            ref = this.constructor.embeddings;
            for (vsAttrName in ref) {
              if (!hasProp.call(ref, vsAttrName)) continue;
              ({replicate} = ref[vsAttrName]);
              voOldValue = (ref1 = this[ipoInternalRecord]) != null ? ref1[vsAttrName] : void 0;
              voNewValue = replicate.call(this);
              if (!_.isEqual(voNewValue, voOldValue)) {
                vhResult[vsAttrName] = [voOldValue, voNewValue];
              }
            }
            return vhResult;
          }
        }));

        _Class.public(_Class.async({
          resetAttribute: FuncG(String)
        }, {
          default: function*(...args) {
            var asAttribute, attrConf, restore, voOldValue;
            yield this.super(...args);
            [asAttribute] = args;
            if (this[ipoInternalRecord] != null) {
              if ((attrConf = this.constructor.embeddings[asAttribute]) != null) {
                ({restore} = attrConf);
                voOldValue = this[ipoInternalRecord][asAttribute];
                this[asAttribute] = (yield restore.call(this, voOldValue));
              }
            }
          }
        }));

        _Class.public(_Class.async({
          rollbackAttributes: Function
        }, {
          default: function*(...args) {
            var ref, restore, voOldValue, vsAttrName;
            yield this.super(...args);
            if (this[ipoInternalRecord] != null) {
              ref = this.constructor.embeddings;
              for (vsAttrName in ref) {
                if (!hasProp.call(ref, vsAttrName)) continue;
                ({restore} = ref[vsAttrName]);
                voOldValue = this[ipoInternalRecord][vsAttrName];
                this[vsAttrName] = (yield restore.call(this, voOldValue));
              }
            }
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
