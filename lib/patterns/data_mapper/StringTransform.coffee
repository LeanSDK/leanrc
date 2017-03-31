_ = require 'lodash'
RC = require 'RC'


module.exports = (LeanRC)->
  class LeanRC::StringTransform extends RC::CoreObject
    @inheritProtected()
    @implements LeanRC::TransformInterface

    @Module: LeanRC

    @public @static normalize: Function,
      default: (serialized)->
        if _.isNil(serialized) then null else String serialized

    @public @static serialize: Function,
      default: (deserialized)->
        if _.isNil(deserialized) then null else String deserialized


  return LeanRC::StringTransform.initialize()
