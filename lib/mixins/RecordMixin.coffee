_ = require 'lodash'
joi = require 'joi'
inflect = do require 'i'


module.exports = (Module)->
  Module.defineMixin Module::CoreObject, (BaseClass) ->
    class RecordMixin extends BaseClass
      @inheritProtected()

      # конструктор принимает второй аргумент, ссылку на коллекцию.
      @public collection: Module::CollectionInterface

      ipoInternalRecord = @private internalRecord: Object # тип и формат хранения надо обдумать. Это инкапсулированные данные последнего сохраненного состояния из базы - нужно для функционала вычисления дельты изменений. (относительно изменений которые проведены над объектом но еще не сохранены в базе данных - хранилище.)

      @public @static schema: Object,
        default: {}
        get: (_data)->
          _data[@name] ?= do =>
            vhAttrs = {}
            for own asAttrName, ahAttrValue of @attributes
              do (asAttrName, ahAttrValue)=>
                if _.isFunction ahAttrValue.validate
                  vhAttrs[asAttrName] = ahAttrValue.validate.call(@)
                else
                  vhAttrs[asAttrName] = ahAttrValue.validate
            joi.object vhAttrs
          _data[@name]

      @public @static parseRecordName: Function,
        default: (asName)->
          if /.*[:][:].*/.test(asName)
            [vsModuleName, vsRecordName] = asName.split '::'
          else
            [vsModuleName, vsRecordName] = [@moduleName(), inflect.camelize inflect.underscore asName]
          unless /(Record$)|(Migration$)/.test vsRecordName
            vsRecordName += 'Record'
          [vsModuleName, vsRecordName]

      @public parseRecordName: Function,
        default: -> @constructor.parseRecordName arguments...

      @public @static findRecordByName: Function,
        args: [String]
        return: Module::Class
        default: (asName)->
          [vsModuleName, vsRecordName] = @parseRecordName asName
          @Module::[vsRecordName]

      @public findRecordByName: Function,
        args: [String]
        return: Module::Class
        default: (asName)->
          @constructor.findRecordByName asName

      ############################################################################

      # # под вопросом ??????
      # @public updateEdges: Function, [ANY], -> ANY # any type

      ############################################################################


      @public @static parentClassNames: Function,
        default: (AbstractClass = null)->
          AbstractClass ?= @
          fromSuper = if AbstractClass.__super__?
            @parentClassNames AbstractClass.__super__.constructor
          _.uniq [].concat(fromSuper ? [])
            .concat [AbstractClass.name]

      @public @static attributes: Object,
        get: -> @metaObject.getGroup 'attributes'
      @public @static edges: Object,
        get: -> @metaObject.getGroup 'edges'
      @public @static computeds: Object,
        get: -> @metaObject.getGroup 'computeds'

      @public @static attribute: Function,
        default: ->
          @attr arguments...
          return

      @public @static attr: Function,
        default: (typeDefinition, opts={})->
          [vsAttr] = Object.keys typeDefinition
          vcAttrType = typeDefinition[vsAttr]
          opts.transform ?= switch vcAttrType
            when String, Date, Number, Boolean
              -> Module::["#{vcAttrType.name}Transform"]
            else
              -> Module::Transform
          opts.validate ?= switch vcAttrType
            when String, Date, Number, Boolean
              -> joi[inflect.underscore vcAttrType.name]()
            else
              -> joi.object()
          {set} = opts
          opts.set = (aoData)->
            {value:voData} = opts.validate.call(@).validate aoData
            if _.isFunction set
              set.apply @, [voData]
            else
              voData
          if @attributes[vsAttr]?
            throw new Error "attr `#{vsAttr}` has been defined previously"
          else
            @metaObject.addMetaData 'attributes', vsAttr, opts
            @metaObject.addMetaData 'edges', vsAttr, opts if opts.through
          @public typeDefinition, opts
          return

      @public @static computed: Function,
        default: ->
          @comp arguments...
          return

      @public @static comp: Function,
        default: (typeDefinition, ..., opts)->
          if typeDefinition is opts
            typeDefinition = "#{opts.attr}": opts.attrType
          [vsAttr] = Object.keys typeDefinition
          unless opts.get?
            return throw new Error '`lambda` options is required'
          if @computeds[vsAttr]?
            throw new Error "comp `#{vsAttr}` has been defined previously"
          else
            @metaObject.addMetaData 'computeds', vsAttr, opts
          @public typeDefinition, opts
          return

      @public @static new: Function,
        default: (aoAttributes, aoCollection)->
          aoAttributes ?= {}
          if aoAttributes.type?
            if @name is aoAttributes.type.split('::')[1]
              @super arguments...
            else
              RecordClass = @findRecordByName aoAttributes.type
              RecordClass?.new(aoAttributes, aoCollection) ? @super arguments...
          else
            aoAttributes.type = "#{@moduleName()}::#{@name}"
            @super aoAttributes, aoCollection

      @public @async save: Function,
        default: ->
          result = if yield @isNew()
            yield @create()
          else
            yield @update()
          return result

      @public @async create: Function,
        default: ->
          unless yield @isNew()
            throw new Error 'Document is exist in collection'
          response = yield @collection.push @
          if response?
            { id } = response
            @id ?= id if id
          vhAttributes = {}
          for own key of @constructor.attributes
            vhAttributes[key] = @[key]
          @[ipoInternalRecord] = vhAttributes
          yield return @

      @public @async update: Function,
        default: ->
          if yield @isNew()
            throw new Error 'Document does not exist in collection'
          yield @collection.patch @id, @
          vhAttributes = {}
          for own key of @constructor.attributes
            vhAttributes[key] = @[key]
          @[ipoInternalRecord] = vhAttributes
          yield return @

      @public @async delete: Function,
        default: ->
          if yield @isNew()
            throw new Error 'Document is not exist in collection'
          @isHidden = yes
          @updatedAt = new Date()
          yield @save()

      @public @async destroy: Function,
        default: ->
          if yield @isNew()
            throw new Error 'Document is not exist in collection'
          yield @collection.remove @id
          return

      @public @virtual attributes: Function, # метод должен вернуть список атрибутов данного рекорда.
        args: []
        return: Array

      @public clone: Function,
        default: -> @collection.clone @

      @public @async copy: Function,
        default: -> yield @collection.copy @

      @public @async decrement: Function,
        default: (asAttribute, step = 1)->
          unless _.isNumber @[asAttribute]
            throw new Error "doc.attribute `#{asAttribute}` is not Number"
          @[asAttribute] -= step
          yield @save()

      @public @async increment: Function,
        default: (asAttribute, step = 1)->
          unless _.isNumber @[asAttribute]
            throw new Error "doc.attribute `#{asAttribute}` is not Number"
          @[asAttribute] += step
          yield @save()

      @public @async toggle: Function,
        default: (asAttribute)->
          unless _.isBoolean @[asAttribute]
            throw new Error "doc.attribute `#{asAttribute}` is not Boolean"
          @[asAttribute] = not @[asAttribute]
          yield @save()

      @public @async touch: Function,
        default: ->
          @updatedAt = new Date()
          yield @save()

      @public @async updateAttribute: Function,
        default: (name, value)->
          @[name] = value
          yield @save()

      @public @async updateAttributes: Function,
        default: (aoAttributes)->
          for own vsAttrName, voAttrValue of aoAttributes
            do (vsAttrName, voAttrValue)=>
              @[vsAttrName] = voAttrValue
          yield @save()

      @public @async isNew: Function,
        default: ->
          return yes  unless @id?
          return yes  unless (cursor = yield @collection.find @id)?
          return cursor.length is 0  unless cursor instanceof Module::Cursor
          return not (yield cursor.first())?

      @public @async @virtual reload: Function,
        args: []
        return: Module::RecordInterface

      # TODO: не учтены установки значений, которые раньше не были установлены
      @public changedAttributes: Function,
        default: ->
          vhResult = {}
          for own vsAttrName, voAttrValue of @[ipoInternalRecord]
            do (vsAttrName, voAttrValue)=>
              if @[vsAttrName] isnt voAttrValue
                vhResult[vsAttrName] = [voAttrValue, @[vsAttrName]]
          vhResult

      @public resetAttribute: Function,
        default: (asAttribute)->
          @[asAttribute] = @[ipoInternalRecord][asAttribute]
          return

      @public rollbackAttributes: Function,
        default: ->
          for own vsAttrName, voAttrValue of @[ipoInternalRecord]
            do (vsAttrName, voAttrValue)=>
              @[vsAttrName] = voAttrValue
          return


      @public @static normalize: Function,
        default: (ahPayload, aoCollection)->
          unless ahPayload?
            return null
          vhResult = {}
          for own asAttrName, ahAttrValue of @attributes
            do (asAttrName, {transform} = ahAttrValue)=>
              vhResult[asAttrName] = transform.call(@).normalize ahPayload[asAttrName]
          result = @new vhResult, aoCollection
          vhAttributes = {}
          for own key of @attributes
            vhAttributes[key] = result[key]
          result[ipoInternalRecord] = vhAttributes
          result

      @public @static serialize:   Function,
        default: (aoRecord)->
          unless aoRecord?
            return null
          vhResult = {}
          for own asAttrName, ahAttrValue of @attributes
            do (asAttrName, {transform} = ahAttrValue)=>
              vhResult[asAttrName] = transform.call(@).serialize aoRecord[asAttrName]
          vhResult

      # need test it
      @public @static @async restoreObject: Function,
        default: (Module, replica)->
          if replica?.class is @name and replica?.type is 'instance'
            facade = Module::ApplicationFacade.getInstance replica.multitonKey
            collection = facade.retrieveProxy replica.collectionName
            instance = if replica.isNew
              collection.build replica.attributes
            else
              yield collection.find replica.id
            yield return instance
          else
            return yield @super Module, replica

      # need test it
      @public @static @async replicateObject: Function,
        default: (instance)->
          replica = @super instance
          ipsMultitonKey = Symbol.for '~multitonKey'
          replica.multitonKey = instance.collection[ipsMultitonKey]
          replica.collectionName = instance.collection.getProxyName()
          replica.isNew = yield instance.isNew()
          if replica.isNew
            replica.attributes = @serialize instance
          else
            replica.id = instance.id
          yield return replica

      @public init: Function,
        default: (aoProperties, aoCollection) ->
          @super arguments...
          # console.log 'Init of Record', @constructor.name, aoProperties
          @collection = aoCollection

          # TODO: надо не забыть про internalRecord
          for own vsAttrName, voAttrValue of aoProperties
            do (vsAttrName, voAttrValue)=>
              @[vsAttrName] = voAttrValue

          # console.log 'dfdfdf 666'

      @public toJSON: Function, { default: -> @constructor.serialize @ }


    RecordMixin.initializeMixin()
