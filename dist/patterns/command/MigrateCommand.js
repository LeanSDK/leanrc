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

  // можно унаследовать от SimpleCommand
  // внутри он должен обратиться к фасаду чтобы тот вернул ему 'MigrationsCollection'
  /*
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
   */
  // !!! Коллекция должна быть зарегистрирована через Module::MIGRATIONS константу
  module.exports = function(Module) {
    var APPLICATION_MEDIATOR, CollectionInterface, ConfigurableMixin, FuncG, ListG, MaybeG, MigrateCommand, NilT, NotificationInterface, STOPPED_MIGRATE, SimpleCommand, StructG, UnionG, _, inflect;
    ({
      APPLICATION_MEDIATOR,
      STOPPED_MIGRATE,
      NilT,
      FuncG,
      ListG,
      MaybeG,
      StructG,
      UnionG,
      NotificationInterface,
      CollectionInterface,
      ConfigurableMixin,
      SimpleCommand,
      Utils: {_, inflect}
    } = Module.prototype);
    return MigrateCommand = (function() {
      class MigrateCommand extends SimpleCommand {};

      MigrateCommand.inheritProtected();

      MigrateCommand.include(ConfigurableMixin);

      MigrateCommand.module(Module);

      MigrateCommand.public({
        migrationsCollection: CollectionInterface
      });

      MigrateCommand.public({
        migrationNames: ListG(String)
      }, {
        get: function() {
          var app, ref;
          app = this.facade.retrieveMediator(APPLICATION_MEDIATOR).getViewComponent();
          return (ref = app.Module.prototype.MIGRATION_NAMES) != null ? ref : [];
        }
      });

      MigrateCommand.public({
        migrationsDir: String
      }, {
        get: function() {
          return `${this.configs.ROOT}/migrations`;
        }
      });

      MigrateCommand.public({
        initializeNotifier: FuncG(String)
      }, {
        default: function(...args) {
          this.super(...args);
          this.migrationsCollection = this.facade.retrieveProxy(Module.prototype.MIGRATIONS);
        }
      });

      MigrateCommand.public(MigrateCommand.async({
        execute: FuncG(NotificationInterface)
      }, {
        default: function*(aoNotification) {
          var err, voBody, vsType;
          voBody = aoNotification.getBody();
          vsType = aoNotification.getType();
          err = (yield this.migrate(voBody != null ? voBody : {}));
          this.facade.sendNotification(STOPPED_MIGRATE, {
            error: err
          }, vsType);
        }
      }));

      MigrateCommand.public(MigrateCommand.async({
        migrate: FuncG([
          MaybeG(StructG({
            until: MaybeG(String)
          }))
        ], UnionG(NilT, Error))
      }, {
        default: function*(options) {
          var app, clearedMigrationName, err, error, i, id, len, migrationClassName, migrationName, ref, type, vcMigration, voMigration;
          app = this.facade.retrieveMediator(APPLICATION_MEDIATOR).getViewComponent();
          ref = this.migrationNames;
          for (i = 0, len = ref.length; i < len; i++) {
            migrationName = ref[i];
            if (!(yield this.migrationsCollection.includes(migrationName))) {
              id = String(migrationName);
              clearedMigrationName = migrationName.replace(/^\d{14}[_]/, '');
              migrationClassName = inflect.camelize(clearedMigrationName);
              vcMigration = app.Module.prototype[migrationClassName];
              type = `${app.Module.name}::${migrationClassName}`;
              try {
                voMigration = (yield this.migrationsCollection.find(id));
                if (voMigration == null) {
                  voMigration = vcMigration.new({id, type}, this.migrationsCollection);
                  yield voMigration.migrate(Module.prototype.Migration.prototype.UP);
                  yield voMigration.save();
                }
              } catch (error1) {
                err = error1;
                error = `!!! Error in migration ${migrationName}`;
                console.error(error, err.message, err.stack);
                break;
              }
            }
            if (((options != null ? options.until : void 0) != null) && options.until === migrationName) {
              break;
            }
          }
          return err;
        }
      }));

      MigrateCommand.initialize();

      return MigrateCommand;

    }).call(this);
  };

}).call(this);
