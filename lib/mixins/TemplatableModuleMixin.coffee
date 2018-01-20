

module.exports = (Module)->
  {
    Module: ModuleClass
    Utils: { _, filesTreeSync }
  } = Module::

  Module.defineMixin 'TemplatableModuleMixin', (BaseClass = ModuleClass) ->
    class extends BaseClass
      @inheritProtected()

      @public @static templates: Object,
        get: -> @metaObject.getGroup 'templates', no

      @public @static defineTemplate: Function,
        default: (filename, fun)->
          vsRoot = @::ROOT ? '.'
          vsTemplatesDir = "#{vsRoot}/templates/"
          templateName = filename
            .replace vsTemplatesDir, ''
            .replace /\.js|\.coffee/, ''
          @metaObject.addMetaData 'templates', templateName, fun
          return fun

      @public @static resolveTemplate: Function,
        default: (args...)->
          vsRoot = @::ROOT ? '.'
          vsTemplatesDir = "#{vsRoot}/templates/"
          path = require 'path'
          templateName = path.resolve args...
            .replace vsTemplatesDir, ''
            .replace /\.js|\.coffee/, ''
          return @templates[templateName]

      @public @static loadTemplates: Function,
        default: ->
          vsRoot = @::ROOT ? '.'
          vsTemplatesDir = "#{vsRoot}/templates"
          files = filesTreeSync vsTemplatesDir, filesOnly: yes
          (files ? []).forEach (i)=>
            templateName = i.replace /\.js|\.coffee/, ''
            vsTemplatePath = "#{vsTemplatesDir}/#{templateName}"
            require(vsTemplatePath) @Module
          return


      @initializeMixin()
