# NOTE: through источники для relatedTo и belongsTo связей с опцией through НАДО ОБЪЯВЛЯТЬ ЧЕРЕЗ hasEmbed чтобы корректно отрабатывал сеттер сохраняющий данные об айдишнике подвязанного объекта в промежуточную коллекцию


module.exports = (Module)->
  {
    RecordInterface
    Record
    Utils: { _, inflect, joi, co }
  } = Module::

  Module.defineMixin 'EmbeddableRecordMixin', (BaseClass = Record) ->
    class extends BaseClass
      @inheritProtected()

      ipoInternalRecord = @instanceVariables['~internalRecord'].pointer

      @public @static schema: Object,
        default: {}
        get: (_data)->
          _data[@name] ?= do =>
            vhAttrs = {}
            for own asAttr, ahValue of @attributes
              vhAttrs[asAttr] = do (asAttr, ahValue)=>
                if _.isFunction ahValue.validate
                  ahValue.validate.call(@)
                else
                  ahValue.validate

            for own asAttr, ahValue of @computeds
              vhAttrs[asAttr] = do (asAttr, ahValue)=>
                if _.isFunction ahValue.validate
                  ahValue.validate.call(@)
                else
                  ahValue.validate

            for own asAttr, ahValue of @embeddings
              vhAttrs[asAttr] = do (asAttr, ahValue)=>
                if _.isFunction ahValue.validate
                  ahValue.validate.call(@)
                else
                  ahValue.validate
            joi.object vhAttrs
          _data[@name]

      @public @static relatedEmbed: Function,
        default: (typeDefinition, opts={})->
          recordClass = @
          [vsAttr] = Object.keys typeDefinition
          opts.refKey ?= 'id'
          opts.inverse ?= "#{inflect.pluralize inflect.camelize @name.replace(/Record$/, ''), no}"
          opts.attr ?= "#{vsAttr}Id"
          opts.embedding = 'relatedEmbed'

          opts.putOnly ?= no
          opts.loadOnly ?= no

          opts.recordName ?= ->
            [vsModuleName, vsRecordName] = recordClass.parseRecordName vsAttr
            vsRecordName
          opts.collectionName ?= ->
            "#{
              inflect.pluralize opts.recordName().replace /Record$/, ''
            }Collection"

          opts.validate = ->
            EmbedRecord = @findRecordByName opts.recordName()
            return EmbedRecord.schema.allow(null).optional()
          opts.load = co.wrap ->
            if opts.putOnly
              yield return null
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            # NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::

            res = unless opts.through
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{opts.refKey}": @[opts.attr]
              ,
                $limit: 1
              )).first()
            else
              # NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода relatedEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
              through = @constructor.embeddings[opts.through[0]]
              unless through?
                throw new Error "Metadata about #{opts.through[0]} must be defined by `EmbeddableRecordMixin.relatedEmbed` method"
              ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
              ThroughRecord = @findRecordByName through.recordName()
              inverse = ThroughRecord.relations[opts.through[1].by]
              embedId = (yield (yield ThroughCollection.takeBy(
                "@doc.#{through.inverse}": @[through.refKey]
              ,
                $limit: 1
              )).first())[opts.through[1].by]
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{inverse.refKey}": embedId
              ,
                $limit: 1
              )).first()

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbed.load #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.put = co.wrap ->
            if opts.loadOnly
              yield return
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()
            aoRecord = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbed.put #{vsAttr} embed #{JSON.stringify aoRecord}", LEVELS[DEBUG])

            if aoRecord?
              if aoRecord.constructor is Object
                aoRecord.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
                aoRecord = yield EmbedsCollection.build aoRecord
              unless opts.through
                aoRecord.spaceId = @spaceId if @spaceId?
                aoRecord.teamId = @teamId if @teamId?
                aoRecord.spaces = @spaces
                aoRecord.creatorId = @creatorId
                aoRecord.editorId = @editorId
                aoRecord.ownerId = @ownerId
                if (yield aoRecord.isNew()) or Object.keys(yield aoRecord.changedAttributes()).length
                  savedRecord = yield aoRecord.save()
                else
                  savedRecord = aoRecord
                @[opts.attr] = savedRecord[opts.refKey]
              else
                # NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода relatedEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                through = @constructor.embeddings[opts.through[0]]
                unless through?
                  throw new Error "Metadata about #{opts.through[0]} must be defined by `EmbeddableRecordMixin.relatedEmbed` method"
                ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
                ThroughRecord = @findRecordByName through.recordName()
                inverse = ThroughRecord.relations[opts.through[1].by]
                aoRecord.spaceId = @spaceId if @spaceId?
                aoRecord.teamId = @teamId if @teamId?
                aoRecord.spaces = @spaces
                aoRecord.creatorId = @creatorId
                aoRecord.editorId = @editorId
                aoRecord.ownerId = @ownerId
                if yield aoRecord.isNew()
                  savedRecord = yield aoRecord.save()
                  yield ThroughCollection.create(
                    "#{through.inverse}": @[through.refKey]
                    "#{opts.through[1].by}": savedRecord[inverse.refKey]
                    spaceId: @spaceId if @spaceId?
                    teamId: @teamId if @teamId?
                    spaces: @spaces
                    creatorId: @creatorId
                    editorId: @editorId
                    ownerId: @ownerId
                  )
                else
                  if Object.keys(yield aoRecord.changedAttributes()).length
                    savedRecord = yield aoRecord.save()
                  else
                    savedRecord = aoRecord
                yield (yield ThroughCollection.takeBy(
                  "@doc.#{through.inverse}": @[through.refKey]
                  "@doc.#{opts.through[1].by}": $ne: savedRecord[inverse.refKey]
                )).forEach co.wrap (voRecord)->
                  yield voRecord.destroy()
                  yield return
            yield return

          opts.restore = co.wrap (replica)->
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbed.restore #{vsAttr} replica #{JSON.stringify replica}", LEVELS[DEBUG])

            res = if replica?
              replica.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
              yield EmbedsCollection.build replica
            else
              null

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbed.restore #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.replicate = ->
            aoRecord = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbed.replicate #{vsAttr} embed #{JSON.stringify aoRecord}", LEVELS[DEBUG])

            res = aoRecord.constructor.objectize aoRecord

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbed.replicate #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            res

          @metaObject.addMetaData 'embeddings', vsAttr, opts
          @public "#{vsAttr}": RecordInterface
          return

      @public @static relatedEmbeds: Function,
        default: (typeDefinition, opts={})->
          recordClass = @
          [vsAttr] = Object.keys typeDefinition
          opts.refKey ?= 'id'
          opts.inverse ?= "#{inflect.pluralize inflect.camelize @name.replace(/Record$/, ''), no}"
          opts.attr ?= "#{inflect.pluralize inflect.camelize vsAttr, no}"
          opts.embedding = 'relatedEmbeds'

          opts.putOnly ?= no
          opts.loadOnly ?= no

          opts.recordName ?= ->
            [vsModuleName, vsRecordName] = recordClass.parseRecordName vsAttr
            vsRecordName
          opts.collectionName ?= ->
            "#{
              inflect.pluralize opts.recordName().replace /Record$/, ''
            }Collection"

          opts.validate = ->
            EmbedRecord = @findRecordByName opts.recordName()
            return EmbedRecord.schema.allow(null).optional()
          opts.load = co.wrap ->
            if opts.putOnly
              yield return null
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            # NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::

            res = unless opts.through
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{opts.refKey}": $in: @[opts.attr]
              ,
                $limit: 1
              )).first()
            else
              through = @constructor.embeddings[opts.through[0]] ? @constructor.relations?[opts.through[0]]
              ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
              ThroughRecord = @findRecordByName through.recordName()
              inverse = ThroughRecord.relations[opts.through[1].by]
              embedIds = yield (yield ThroughCollection.takeBy(
                "@doc.#{through.inverse}": @[through.refKey]
              )).map (voRecord)-> voRecord[opts.through[1].by]
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{inverse.refKey}": $in: embedIds
              )).toArray()

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbeds.load #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.put = co.wrap ->
            if opts.loadOnly
              yield return
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()
            alRecords = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbeds.put #{vsAttr} embeds #{JSON.stringify alRecords}", LEVELS[DEBUG])

            if alRecords.length > 0
              unless opts.through
                alRecordIds = []
                for aoRecord in alRecords
                  if aoRecord.constructor is Object
                    aoRecord.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
                    aoRecord = yield EmbedsCollection.build aoRecord
                  aoRecord.spaceId = @spaceId if @spaceId?
                  aoRecord.teamId = @teamId if @teamId?
                  aoRecord.spaces = @spaces
                  aoRecord.creatorId = @creatorId
                  aoRecord.editorId = @editorId
                  aoRecord.ownerId = @ownerId
                  if (yield aoRecord.isNew()) or Object.keys(yield aoRecord.changedAttributes()).length
                    { id } = yield aoRecord.save()
                  else
                    { id } = aoRecord
                  alRecordIds.push id
                @[opts.attr] = alRecordIds
              else
                through = @constructor.embeddings[opts.through[0]] ? @constructor.relations?[opts.through[0]]
                ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
                ThroughRecord = @findRecordByName through.recordName()
                inverse = ThroughRecord.relations[opts.through[1].by]
                alRecordIds = []
                newRecordIds = []
                for aoRecord in alRecords
                  if aoRecord.constructor is Object
                    aoRecord.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
                    aoRecord = yield EmbedsCollection.build aoRecord
                  aoRecord.spaceId = @spaceId if @spaceId?
                  aoRecord.teamId = @teamId if @teamId?
                  aoRecord.spaces = @spaces
                  aoRecord.creatorId = @creatorId
                  aoRecord.editorId = @editorId
                  aoRecord.ownerId = @ownerId
                  if yield aoRecord.isNew()
                    savedRecord = yield aoRecord.save()
                    alRecordIds.push savedRecord[inverse.refKey]
                    newRecordIds.push savedRecord[inverse.refKey]
                  else
                    if Object.keys(yield aoRecord.changedAttributes()).length
                      savedRecord = yield aoRecord.save()
                    else
                      savedRecord = aoRecord
                    alRecordIds.push savedRecord[inverse.refKey]
                unless opts.putOnly
                  yield (yield ThroughCollection.takeBy(
                    "@doc.#{through.inverse}": @[through.refKey]
                    "@doc.#{opts.through[1].by}": $nin: alRecordIds
                  )).forEach co.wrap (voRecord)->
                    yield voRecord.destroy()
                    yield return
                for newRecordId in newRecordIds
                  yield ThroughCollection.create(
                    "#{through.inverse}": @[through.refKey]
                    "#{opts.through[1].by}": newRecordId
                    spaceId: @spaceId if @spaceId?
                    teamId: @teamId if @teamId?
                    spaces: @spaces
                    creatorId: @creatorId
                    editorId: @editorId
                    ownerId: @ownerId
                  )
            yield return

          opts.restore = co.wrap (replica)->
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbeds.restore #{vsAttr} replica #{JSON.stringify replica}", LEVELS[DEBUG])

            res = if replica?
              replica.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
              yield EmbedsCollection.build replica
            else
              null

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbeds.restore #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.replicate = ->
            aoRecord = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbeds.replicate #{vsAttr} embed #{JSON.stringify aoRecord}", LEVELS[DEBUG])

            res = aoRecord.constructor.objectize aoRecord

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.relatedEmbeds.replicate #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            res

          @metaObject.addMetaData 'embeddings', vsAttr, opts
          @public "#{vsAttr}": RecordInterface
          return

      @public @static hasEmbed: Function,
        default: (typeDefinition, opts={})->
          recordClass = @
          [vsAttr] = Object.keys typeDefinition
          opts.refKey ?= 'id'
          opts.inverse ?= "#{inflect.singularize inflect.camelize @name.replace(/Record$/, ''), no}Id"
          opts.embedding = 'hasEmbed'

          opts.putOnly ?= no
          opts.loadOnly ?= no

          opts.recordName ?= ->
            [vsModuleName, vsRecordName] = recordClass.parseRecordName vsAttr
            vsRecordName
          opts.collectionName ?= ->
            "#{
              inflect.pluralize opts.recordName().replace /Record$/, ''
            }Collection"

          opts.validate = ->
            EmbedRecord = @findRecordByName opts.recordName()
            return EmbedRecord.schema.allow(null).optional()
          opts.load = co.wrap ->
            if opts.putOnly
              yield return null
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            # NOTE: может быть ситуация, что hasOne связь не хранится в классическом виде атрибуте рекорда, а хранение вынесено в отдельную промежуточную коллекцию по аналогии с М:М , но с добавленным uniq констрейнтом на одном поле (чтобы эмулировать 1:М связи)

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::

            res = unless opts.through
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{opts.inverse}": @[opts.refKey]
              ,
                $limit: 1
              )).first()
            else
              # NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
              through = @constructor.embeddings[opts.through[0]]
              unless through?
                throw new Error "Metadata about #{opts.through[0]} must be defined by `EmbeddableRecordMixin.hasEmbed` method"
              ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
              ThroughRecord = @findRecordByName through.recordName()
              inverse = ThroughRecord.relations[opts.through[1].by]
              embedId = (yield (yield ThroughCollection.takeBy(
                "@doc.#{through.inverse}": @[opts.refKey]
              ,
                $limit: 1
              )).first())[opts.through[1].by]
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{inverse.refKey}": embedId
              ,
                $limit: 1
              )).first()

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbed.load #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.put = co.wrap ->
            if opts.loadOnly
              yield return
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()
            aoRecord = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbed.put #{vsAttr} embed #{JSON.stringify aoRecord}", LEVELS[DEBUG])

            if aoRecord?
              if aoRecord.constructor is Object
                aoRecord.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
                aoRecord = yield EmbedsCollection.build aoRecord
              unless opts.through
                aoRecord[opts.inverse] = @[opts.refKey]
                aoRecord.spaceId = @spaceId if @spaceId?
                aoRecord.teamId = @teamId if @teamId?
                aoRecord.spaces = @spaces
                aoRecord.creatorId = @creatorId
                aoRecord.editorId = @editorId
                aoRecord.ownerId = @ownerId
                if (yield aoRecord.isNew()) or Object.keys(yield aoRecord.changedAttributes()).length
                  savedRecord = yield aoRecord.save()
                else
                  savedRecord = aoRecord
                yield (yield EmbedsCollection.takeBy(
                  "@doc.#{opts.inverse}": @[opts.refKey]
                  "@doc.id": $ne: savedRecord.id # NOTE: проверяем по айдишнику только-что сохраненного
                )).forEach co.wrap (voRecord)-> yield voRecord.destroy()
              else
                # NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                through = @constructor.embeddings[opts.through[0]]
                unless through?
                  throw new Error "Metadata about #{opts.through[0]} must be defined by `EmbeddableRecordMixin.hasEmbed` method"
                ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
                ThroughRecord = @findRecordByName through.recordName()
                inverse = ThroughRecord.relations[opts.through[1].by]
                aoRecord.spaceId = @spaceId if @spaceId?
                aoRecord.teamId = @teamId if @teamId?
                aoRecord.spaces = @spaces
                aoRecord.creatorId = @creatorId
                aoRecord.editorId = @editorId
                aoRecord.ownerId = @ownerId
                if yield aoRecord.isNew()
                  savedRecord = yield aoRecord.save()
                  yield ThroughCollection.create(
                    "#{through.inverse}": @[opts.refKey]
                    "#{opts.through[1].by}": savedRecord[inverse.refKey]
                    spaceId: @spaceId if @spaceId?
                    teamId: @teamId if @teamId?
                    spaces: @spaces
                    creatorId: @creatorId
                    editorId: @editorId
                    ownerId: @ownerId
                  )
                else
                  if Object.keys(yield aoRecord.changedAttributes()).length
                    savedRecord = yield aoRecord.save()
                  else
                    savedRecord = aoRecord
                embedIds = yield (yield ThroughCollection.takeBy(
                  "@doc.#{through.inverse}": @[opts.refKey]
                  "@doc.#{opts.through[1].by}": $ne: savedRecord[inverse.refKey]
                )).map co.wrap (voRecord)->
                  id = voRecord[opts.through[1].by]
                  yield voRecord.destroy()
                  yield return id
                yield (yield EmbedsCollection.takeBy(
                  "@doc.#{inverse.refKey}": $in: embedIds
                )).forEach co.wrap (voRecord)-> yield voRecord.destroy()
            else unless opts.putOnly
              unless opts.through
                voRecord = yield (yield EmbedsCollection.takeBy(
                  "@doc.#{opts.inverse}": @[opts.refKey]
                ,
                  $limit: 1
                )).first()
                if voRecord?
                  yield voRecord.destroy()
              else
                # NOTE: метаданные о through в случае с релейшеном к одному объекту должны быть описаны с помощью метода hasEmbed. Поэтому здесь идет обращение только к @constructor.embeddings
                through = @constructor.embeddings[opts.through[0]]
                unless through?
                  throw new Error "Metadata about #{opts.through[0]} must be defined by `EmbeddableRecordMixin.hasEmbed` method"
                ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
                ThroughRecord = @findRecordByName through.recordName()
                inverse = ThroughRecord.relations[opts.through[1].by]
                embedIds = yield (yield ThroughCollection.takeBy(
                  "@doc.#{through.inverse}": @[opts.refKey]
                ,
                  $limit: 1
                )).map co.wrap (voRecord)->
                  id = voRecord[opts.through[1].by]
                  yield voRecord.destroy()
                  yield return id
                yield (yield EmbedsCollection.takeBy(
                  "@doc.#{inverse.refKey}": $in: embedIds
                ,
                  $limit: 1
                )).forEach co.wrap (voRecord)-> yield voRecord.destroy()
            yield return

          opts.restore = co.wrap (replica)->
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbed.restore #{vsAttr} replica #{JSON.stringify replica}", LEVELS[DEBUG])

            res = if replica?
              replica.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
              yield EmbedsCollection.build replica
            else
              null

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbed.restore #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.replicate = ->
            aoRecord = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbed.replicate #{vsAttr} embed #{JSON.stringify aoRecord}", LEVELS[DEBUG])

            res = aoRecord.constructor.objectize aoRecord

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbed.replicate #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            res

          @metaObject.addMetaData 'embeddings', vsAttr, opts
          @public "#{vsAttr}": RecordInterface
          return

      @public @static hasEmbeds: Function,
        default: (typeDefinition, opts={})->
          recordClass = @
          [vsAttr] = Object.keys typeDefinition
          opts.refKey ?= 'id'
          opts.inverse ?= "#{inflect.singularize inflect.camelize @name.replace(/Record$/, ''), no}Id"
          opts.embedding = 'hasEmbeds'

          opts.putOnly ?= no
          opts.loadOnly ?= no

          opts.recordName ?= ->
            [vsModuleName, vsRecordName] = recordClass.parseRecordName vsAttr
            vsRecordName
          opts.collectionName ?= ->
            "#{
              inflect.pluralize opts.recordName().replace /Record$/, ''
            }Collection"

          opts.validate = ->
            EmbedRecord = @findRecordByName opts.recordName()
            return joi.array().items [EmbedRecord.schema, joi.any().strip()]

          opts.load = co.wrap ->
            if opts.putOnly
              yield return []
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::

            res = unless opts.through
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{opts.inverse}": @[opts.refKey]
              )).toArray()
            else
              through = @constructor.embeddings[opts.through[0]] ? @constructor.relations?[opts.through[0]]
              ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
              ThroughRecord = @findRecordByName through.recordName()
              inverse = ThroughRecord.relations[opts.through[1].by]
              embedIds = yield (yield ThroughCollection.takeBy(
                "@doc.#{through.inverse}": @[opts.refKey]
              )).map (voRecord)-> voRecord[opts.through[1].by]
              yield (yield EmbedsCollection.takeBy(
                "@doc.#{inverse.refKey}": $in: embedIds
              )).toArray()

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbeds.load #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.put = co.wrap ->
            if opts.loadOnly
              yield return
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()
            alRecords = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbeds.put #{vsAttr} embeds #{JSON.stringify alRecords}", LEVELS[DEBUG])

            if alRecords.length > 0
              unless opts.through
                alRecordIds = []
                for aoRecord in alRecords
                  if aoRecord.constructor is Object
                    aoRecord.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
                    aoRecord = yield EmbedsCollection.build aoRecord
                  aoRecord[opts.inverse] = @[opts.refKey]
                  aoRecord.spaceId = @spaceId if @spaceId?
                  aoRecord.teamId = @teamId if @teamId?
                  aoRecord.spaces = @spaces
                  aoRecord.creatorId = @creatorId
                  aoRecord.editorId = @editorId
                  aoRecord.ownerId = @ownerId
                  if (yield aoRecord.isNew()) or Object.keys(yield aoRecord.changedAttributes()).length
                    { id } = yield aoRecord.save()
                  else
                    { id } = aoRecord
                  alRecordIds.push id
                unless opts.putOnly
                  yield (yield EmbedsCollection.takeBy(
                    "@doc.#{opts.inverse}": @[opts.refKey]
                    "@doc.id": $nin: alRecordIds # NOTE: проверяем айдишники всех только-что сохраненных
                  )).forEach co.wrap (voRecord)-> yield voRecord.destroy()
              else
                through = @constructor.embeddings[opts.through[0]] ? @constructor.relations?[opts.through[0]]
                ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
                ThroughRecord = @findRecordByName through.recordName()
                inverse = ThroughRecord.relations[opts.through[1].by]
                alRecordIds = []
                newRecordIds = []
                for aoRecord in alRecords
                  if aoRecord.constructor is Object
                    aoRecord.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
                    aoRecord = yield EmbedsCollection.build aoRecord
                  aoRecord.spaceId = @spaceId if @spaceId?
                  aoRecord.teamId = @teamId if @teamId?
                  aoRecord.spaces = @spaces
                  aoRecord.creatorId = @creatorId
                  aoRecord.editorId = @editorId
                  aoRecord.ownerId = @ownerId
                  if yield aoRecord.isNew()
                    savedRecord = yield aoRecord.save()
                    alRecordIds.push savedRecord[inverse.refKey]
                    newRecordIds.push savedRecord[inverse.refKey]
                  else
                    if Object.keys(yield aoRecord.changedAttributes()).length
                      savedRecord = yield aoRecord.save()
                    else
                      savedRecord = aoRecord
                    alRecordIds.push savedRecord[inverse.refKey]
                unless opts.putOnly
                  embedIds = yield (yield ThroughCollection.takeBy(
                    "@doc.#{through.inverse}": @[opts.refKey]
                    "@doc.#{opts.through[1].by}": $nin: alRecordIds
                  )).map co.wrap (voRecord)->
                    id = voRecord[opts.through[1].by]
                    yield voRecord.destroy()
                    yield return id
                  yield (yield EmbedsCollection.takeBy(
                    "@doc.#{inverse.refKey}": $in: embedIds
                  )).forEach co.wrap (voRecord)-> yield voRecord.destroy()
                for newRecordId in newRecordIds
                  yield ThroughCollection.create(
                    "#{through.inverse}": @[opts.refKey]
                    "#{opts.through[1].by}": newRecordId
                    spaceId: @spaceId if @spaceId?
                    teamId: @teamId if @teamId?
                    spaces: @spaces
                    creatorId: @creatorId
                    editorId: @editorId
                    ownerId: @ownerId
                  )
            else unless opts.putOnly
              unless opts.through
                yield (yield EmbedsCollection.takeBy(
                  "@doc.#{opts.inverse}": @[opts.refKey]
                )).forEach co.wrap (voRecord)-> yield voRecord.destroy()
              else
                through = @constructor.embeddings[opts.through[0]] ? @constructor.relations?[opts.through[0]]
                ThroughCollection = @collection.facade.retrieveProxy through.collectionName()
                ThroughRecord = @findRecordByName through.recordName()
                inverse = ThroughRecord.relations[opts.through[1].by]
                embedIds = yield (yield ThroughCollection.takeBy(
                  "@doc.#{through.inverse}": @[opts.refKey]
                )).map co.wrap (voRecord)->
                  id = voRecord[opts.through[1].by]
                  yield voRecord.destroy()
                  yield return id
                yield (yield EmbedsCollection.takeBy(
                  "@doc.#{inverse.refKey}": $in: embedIds
                )).forEach co.wrap (voRecord)-> yield voRecord.destroy()
            yield return

          opts.restore = co.wrap (replica)->
            EmbedsCollection = @collection.facade.retrieveProxy opts.collectionName()
            EmbedRecord = @findRecordByName opts.recordName()

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbeds.restore #{vsAttr} replica #{JSON.stringify replica}", LEVELS[DEBUG])

            res = if replica? and replica.length > 0
              for item in replica
                item.type ?= "#{EmbedRecord.moduleName()}::#{EmbedRecord.name}"
                yield EmbedsCollection.build item
            else
              []

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbeds.restore #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            yield return res

          opts.replicate = ->
            alRecords = @[vsAttr]

            {
              LogMessage: {
                SEND_TO_LOG
                LEVELS
                DEBUG
              }
            } = Module::
            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbeds.replicate #{vsAttr} embeds #{JSON.stringify alRecords}", LEVELS[DEBUG])

            res = for item in alRecords
              EmbedRecord = item.constructor
              EmbedRecord.objectize item

            @collection.sendNotification(SEND_TO_LOG, "EmbeddableRecordMixin.hasEmbeds.replicate #{vsAttr} result #{JSON.stringify res}", LEVELS[DEBUG])

            res

          @metaObject.addMetaData 'embeddings', vsAttr, opts
          @public "#{vsAttr}": Array
          return

      @public @static embeddings: Object,
        get: -> @metaObject.getGroup 'embeddings', no

      @chains ['create', 'update']

      @public @async create: Function,
        default: ->
          response = yield @collection.push @
          if response?
            for own asAttr of @constructor.attributes
              @[asAttr] = response[asAttr]
            for own asEmbed of @constructor.embeddings
              @[asEmbed] = response[asEmbed]
            @[ipoInternalRecord] = response[ipoInternalRecord]
          yield return @

      @public @async update: Function,
        default: ->
          response = yield @collection.override @id, @
          if response?
            for own asAttr of @constructor.attributes
              @[asAttr] = response[asAttr]
            for own asEmbed of @constructor.embeddings
              @[asEmbed] = response[asEmbed]
            @[ipoInternalRecord] = response[ipoInternalRecord]
          yield return @

      @public @static @async normalize: Function,
        default: (args...)->
          voRecord = yield @super args...
          for own asAttr, { load } of voRecord.constructor.embeddings
            voRecord[asAttr] = yield load.call voRecord
          voRecord[ipoInternalRecord] = voRecord.constructor.makeSnapshotWithEmbeds voRecord
          yield return voRecord

      @public @static @async serialize: Function,
        default: (aoRecord)->
          for own asAttr, { put } of aoRecord.constructor.embeddings
            yield put.call aoRecord
          vhResult = yield @super aoRecord
          yield return vhResult

      @public @static @async recoverize: Function,
        default: (args...)->
          [ahPayload] = args
          voRecord = yield @super args...
          for own asAttr, { restore } of voRecord.constructor.embeddings when asAttr of ahPayload
            voRecord[asAttr] = yield restore.call voRecord, ahPayload[asAttr]
          yield return voRecord

      @public @static objectize: Function,
        default: (args...)->
          [aoRecord] = args
          vhResult = @super args...
          for own asAttr, { replicate } of aoRecord.constructor.embeddings when aoRecord[asAttr]?
            vhResult[asAttr] = replicate.call aoRecord
          return vhResult

      @public @static makeSnapshotWithEmbeds: Function,
        default: (aoRecord)->
          vhResult = aoRecord[ipoInternalRecord]
          for own asAttr, { replicate } of aoRecord.constructor.embeddings
            vhResult[asAttr] = replicate.call aoRecord
          vhResult

      # TODO: не учтены установки значений, которые раньше не были установлены
      @public @async changedAttributes: Function,
        default: ->
          vhResult = yield @super()
          for own vsAttrName, { replicate } of @constructor.embeddings
            voOldValue = @[ipoInternalRecord]?[vsAttrName]
            voNewValue = replicate.call @
            unless _.isEqual voNewValue, voOldValue
              vhResult[vsAttrName] = [voOldValue, voNewValue]
          yield return vhResult

      @public @async resetAttribute: Function,
        default: (args...)->
          yield @super args...
          [asAttribute] = args
          if @[ipoInternalRecord]?
            if (attrConf = @constructor.embeddings[asAttribute])?
              { restore } = attrConf
              voOldValue = @[ipoInternalRecord][asAttribute]
              @[asAttribute] = yield restore.call @, voOldValue
          yield return

      @public @async rollbackAttributes: Function,
        default: (args...)->
          yield @super args...
          if @[ipoInternalRecord]?
            for own vsAttrName, { restore } of @constructor.embeddings
              voOldValue = @[ipoInternalRecord][vsAttrName]
              @[vsAttrName] = yield restore.call @, voOldValue
          yield return


      @initializeMixin()
