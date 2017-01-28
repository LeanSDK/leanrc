_             = require 'lodash'
inflect       = require('i')()
fs            = require 'fs'
FoxxRouter    = require '@arangodb/foxx/router'
CoreObject    = require './CoreObject'
extend        = require './utils/extend'

FOLDERS       = [
  'utils'
  'mixins'
  'models'
  'controllers'
]

###
  ```
  ```
###

class FoxxMC::Module extends CoreObject
  Utils:      null # must be defined as {} in child classes
  Scripts:    null # must be defined as {} in child classes
  @context:   null # must be defined as module.context in child classes

  @defineClassProperty 'Module', -> @

  @getClassesFor: (subfolder)->
    subfolderDir = fs.join @context.basePath, 'dist', subfolder

    _files = _.chain fs.listTree subfolderDir
      .filter (i) -> fs.isFile fs.join subfolderDir, i
      .map (i) -> i.replace /\.js$/, ''
      .orderBy()
      .value()
    for _file in _files
      require fs.join subfolderDir, _file
    return

  @initializeModules: ->
    if @context.manifest.dependencies?
      for own dependencyName, dependencyDefinition of @context.manifest.dependencies
        do ({name, version}=dependencyDefinition)->
          @context.dependencies[dependencyName]
          return
    return

  @initialize: ->
    self = super
    global[self.name] = self

    extend self, _.omit self.context.manifest, ['name']

    global['classes'] ?= {}
    global['classes'][self.name] = self
    self.initializeModules()

    FOLDERS.forEach (subfolder)->
      self.getClassesFor subfolder
    require fs.join self.context.basePath, 'dist', 'router'
    self

  @use: ->
    applicationRouter = new @::ApplicationRouter()
    router = FoxxRouter()
    Mapping = {}
    applicationRouter._routes.forEach (item)->
      controllerName = inflect.camelize inflect.underscore "#{item.controller.replace /[/]/g, '_'}Controller"
      Mapping[controllerName] ?= []
      Mapping[controllerName].push item.action unless _.includes Mapping[controllerName], item.action
    allSections = Object.keys Mapping
    availableSections = []
    availableSections.push
      id: 'system'
      module: @name
      actions: ['administrator']
    availableSections.push
      id: 'moderator'
      module: @name
      actions: allSections
    availableSections = availableSections.concat allSections.map (section)->
      id: section
      module: @name
      actions: Mapping[section]
    router.get '/sections', (req, res)->
      res.send {availableSections}
    router.get '/sections/:section', (req, res)=>
      switch req.pathParams.section
        when 'system'
          availableSection =
            id: 'system'
            module: @name
            actions: ['administrator']
        when 'moderator'
          availableSection =
            id: 'moderator'
            module: @name
            actions: allSections
        else
          availableSection =
            id: req.pathParams.section
            module: @name
            actions: Mapping[req.pathParams.section]
      res.send {availableSection}

    @context.use router

    applicationRouter


module.exports = FoxxMC::Module.initialize()