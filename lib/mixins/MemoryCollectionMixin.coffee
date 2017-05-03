_             = require 'lodash'
inflect       = do require 'i'


module.exports = (Module)->
  {ANY, NILL} = Module::

  Module.defineMixin (BaseClass) ->
    class MemoryCollectionMixin extends BaseClass
      @inheritProtected()

      ipoCollection = @protected collection: Object

      @public @async onRegister: Function,
        default: (args...)->
          @super args...
          @[ipoCollection] = {}
          return

      @public @async push: Function,
        default: (aoRecord)->
          vsKey = aoRecord.id
          @[ipoCollection][vsKey] = @serializer.serialize aoRecord
          yield return yes

      @public @async remove: Function,
        default: (id)->
          delete @[ipoCollection][id]
          yield return yes

      @public @async take: Function,
        default: (id)->
          yield return Module::Cursor.new @delegate, [@[ipoCollection][id]]

      @public @async takeMany: Function,
        default: (ids)->
          yield return Module::Cursor.new @delegate, ids.map (id)=>
            @[ipoCollection][id]

      @public @async takeAll: Function,
        default: ->
          yield return Module::Cursor.new @delegate, _.values @[ipoCollection]

      @public @async override: Function,
        default: (id, aoRecord)->
          @[ipoCollection][id] = @serializer.serialize aoRecord
          yield return Module::Cursor.new @delegate, [@[ipoCollection][id]]

      @public @async patch: Function,
        default: (id, aoRecord)->
          @[ipoCollection][id] = @serializer.serialize aoRecord
          yield return Module::Cursor.new @delegate, [@[ipoCollection][id]]

      @public @async includes: Function,
        default: (id)->
          yield return @[ipoCollection][id]?

      @public @async length: Function,
        default: ->
          yield return Object.keys(@[ipoCollection]).length()


    MemoryCollectionMixin.initializeMixin()