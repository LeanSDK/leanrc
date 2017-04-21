# можно унаследовать от SimpleCommand
# внутри он должен обратиться к фасаду чтобы тот вернул ему 'MigrationsCollection'

_             = require 'lodash'
inflect       = do require 'i'


###
```coffee
module.exports = (Module)->
  {MIGRATIONS} = Module::

  class BaseMigration extends Module::Migration
    @inheritProtected()
    @include Module::ArangoMigrationMixin

    @module Module

  BaseMigration.initialize()
```

```coffee
module.exports = (Module)->
  {MIGRATIONS} = Module::

  class PrepareModelCommand extends Module::SimpleCommand
    @inheritProtected()

    @module Module

    @public execute: Function,
      default: ->
        #...
        @facade.registerProxy Module::BaseCollection.new MIGRATIONS,
          delegate: Module::BaseMigration
        #...

  PrepareModelCommand.initialize()
```
###

# !!! Коллекция должна быть зарегистрирована через Module::MIGRATIONS константу


module.exports = (Module) ->
  {ANY, NILL} = Module::

  class MigrateCommand extends Module::SimpleCommand
    @inheritProtected()

    @module Module

    @public migrationsCollection: Module::CollectionInterface
    @public migrationNames: Array

    @public migrationsDir: String,
      get: ->
        "#{@Module::ROOT}/compiled_migrations"

    @public init: Function,
      default: (args...)->
        @super args...
        {filesList} = Module::Utils
        @migrationsCollection = @facade.retriveProxy Module::MIGRATIONS
        @migrationNames = _.orderBy filesList(@migrationsDir).map (i)=>
          migrationName = i.replace '.js', ''
          vsMigrationPath = "#{@migrationsDir}/#{migrationName}"
          require(vsMigrationPath) Module
          migrationName
        return

    @public execute: Function,
      default: (options)->
        @migrate options
        return

    @public @async migrate: Function,
      args: []
      return: NILL
      default: (options)->
        for migrationName in @migrationNames
          unless yield @migrationsCollection.includes migrationName
            clearedMigrationName = migrationName.replace /^\d{14}[_]/, ''
            migrationClassName = inflect.camelize clearedMigrationName
            vcMigration = Module::[migrationClassName]
            try
              voMigration = vcMigration.new {}, @migrationsCollection
              yield voMigration.migrate Module::Migration::UP
              yield voMigration.save()
            catch err
              error = "!!! Error in migration #{migrationName}"
              console.error error, err.message, err.stack
              break
          if options?.until? and options.until is migrationName
            break
        yield return


  MigrateCommand.initialize()
