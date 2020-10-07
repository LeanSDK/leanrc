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
    var APPLICATION_MEDIATOR, CollectionInterface, ConfigurableMixin, FuncG, ListG, MaybeG, NilT, NotificationInterface, RollbackCommand, STOPPED_ROLLBACK, SimpleCommand, StructG, UnionG, _, inflect;
    ({
      APPLICATION_MEDIATOR,
      STOPPED_ROLLBACK,
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
    return RollbackCommand = (function() {
      class RollbackCommand extends SimpleCommand {};

      RollbackCommand.inheritProtected();

      RollbackCommand.include(ConfigurableMixin);

      RollbackCommand.module(Module);

      RollbackCommand.public({
        migrationsCollection: CollectionInterface
      });

      RollbackCommand.public({
        migrationNames: ListG(String)
      }, {
        get: function() {
          var app, ref;
          app = this.facade.retrieveMediator(APPLICATION_MEDIATOR).getViewComponent();
          return (ref = app.Module.prototype.MIGRATION_NAMES) != null ? ref : [];
        }
      });

      RollbackCommand.public({
        migrationsDir: String
      }, {
        get: function() {
          return `${this.configs.ROOT}/migrations`;
        }
      });

      RollbackCommand.public({
        initializeNotifier: FuncG(String)
      }, {
        default: function(...args) {
          this.super(...args);
          this.migrationsCollection = this.facade.retrieveProxy(Module.prototype.MIGRATIONS);
        }
      });

      RollbackCommand.public(RollbackCommand.async({
        execute: FuncG(NotificationInterface)
      }, {
        default: function*(aoNotification) {
          var err, voBody, vsType;
          voBody = aoNotification.getBody();
          vsType = aoNotification.getType();
          err = (yield this.rollback(voBody != null ? voBody : {}));
          this.facade.sendNotification(STOPPED_ROLLBACK, {
            error: err
          }, vsType);
        }
      }));

      RollbackCommand.public(RollbackCommand.async({
        rollback: FuncG([
          MaybeG(StructG({
            steps: MaybeG(Number),
            until: MaybeG(String)
          }))
        ], UnionG(NilT, Error))
      }, {
        default: function*(options) {
          var err, error, executedMigration, executedMigrations, i, len, ref;
          if (((options != null ? options.steps : void 0) != null) && !_.isNumber(options.steps)) {
            throw new Error('Not valid steps params');
            return;
          }
          executedMigrations = (yield ((yield this.migrationsCollection.takeAll())).toArray());
          executedMigrations = _.orderBy(executedMigrations, ['id'], ['desc']);
          executedMigrations = executedMigrations.slice(0, ((ref = options.steps) != null ? ref : 1));
          for (i = 0, len = executedMigrations.length; i < len; i++) {
            executedMigration = executedMigrations[i];
            try {
              yield executedMigration.migrate(Module.prototype.Migration.prototype.DOWN);
              yield executedMigration.destroy();
            } catch (error1) {
              err = error1;
              error = `!!! Error in migration ${executedMigration}`;
              console.error(error, err.message, err.stack);
              break;
            }
            if (((options != null ? options.until : void 0) != null) && options.until === executedMigration.id) {
              break;
            }
          }
          return err;
        }
      }));

      RollbackCommand.initialize();

      return RollbackCommand;

    }).call(this);
  };

}).call(this);
