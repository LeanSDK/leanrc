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
  /*
  http://edgeguides.rubyonrails.org/active_record_migrations.html
  http://api.rubyonrails.org/
  http://guides.rubyonrails.org/v3.2/migrations.html
  http://rusrails.ru/rails-database-migrations
  http://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/SchemaStatements.html
  */
  /*
  ```coffee
  module.exports = (Module)->
    class BaseMigration extends Module::Migration
      @inheritProtected()
      @include Module::ArangoMigrationMixin # в этом миксине должны быть реализованы платформозависимые методы, которые будут посылать нативные запросы к реальной базе данных

      @module Module

    return BaseMigration.initialize()
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

  ```coffee
  module.exports = (Module)->
    class CreateUsersCollectionMigration extends Module::BaseMigration
      @inheritProtected()
      @include Module::ArangoMigrationMixin # в этом миксине должны быть реализованы платформозависимые методы, которые будут посылать нативные запросы к реальной базе данных

      @module Module

      @up ->
        yield @createCollection 'users'
        yield @addField 'users', name, 'string'
        yield @addField 'users', description, 'text'
        yield @addField 'users', createdAt, 'date'
        yield @addField 'users', updatedAt, 'date'
        yield @addField 'users', deletedAt, 'date'
        yield return

      @down ->
        yield @dropCollection 'users'
        yield return

    return CreateUsersCollectionMigration.initialize()
  ```

  Это эквивалентно

  ```coffee
  module.exports = (Module)->
    class CreateUsersCollectionMigration extends Module::BaseMigration
      @inheritProtected()
      @include Module::ArangoMigrationMixin # в этом миксине должны быть реализованы платформозависимые методы, которые будут посылать нативные запросы к реальной базе данных

      @module Module

      @change ->
        @createCollection 'users'
        @addField 'users', name, 'string'
        @addField 'users', description, 'text'
        @addField 'users', createdAt, 'date'
        @addField 'users', updatedAt, 'date'
        @addField 'users', deletedAt, 'date'

    return CreateUsersCollectionMigration.initialize()
  ```
   */
  module.exports = function(Module) {
    var AnyT, AsyncFuncG, AsyncFunctionT, EnumG, FuncG, InterfaceG, ListG, MaybeG, Migration, MigrationInterface, PointerT, Record, RecordInterface, StructG, SubsetG, UnionG, _, assign, co, forEach;
    ({
      AnyT,
      AsyncFunctionT,
      PointerT,
      FuncG,
      ListG,
      StructG,
      EnumG,
      MaybeG,
      UnionG,
      InterfaceG,
      AsyncFuncG,
      SubsetG,
      MigrationInterface,
      RecordInterface,
      Record,
      Utils: {_, forEach, assign, co}
    } = Module.prototype);
    return Migration = (function() {
      var DOWN, REVERSE_MAP, SUPPORTED_TYPES, UP, iplSteps;

      class Migration extends Record {};

      Migration.inheritProtected();

      Migration.implements(MigrationInterface);

      Migration.module(Module);

      ({UP, DOWN, SUPPORTED_TYPES} = Migration.prototype);

      // @const UP: UP = Symbol 'UP'
      // @const DOWN: DOWN = Symbol 'DOWN'
      // @const SUPPORTED_TYPES: SUPPORTED_TYPES = {
      //   json:         'json'
      //   binary:       'binary'
      //   boolean:      'boolean'
      //   date:         'date'
      //   datetime:     'datetime'
      //   number:       'number'
      //   decimal:      'decimal'
      //   float:        'float'
      //   integer:      'integer'
      //   primary_key:  'primary_key'
      //   string:       'string'
      //   text:         'text'
      //   time:         'time'
      //   timestamp:    'timestamp'
      //   array:        'array'
      //   hash:         'hash'
      // }
      Migration.const({
        REVERSE_MAP: REVERSE_MAP = {
          createCollection: 'dropCollection',
          dropCollection: 'dropCollection',
          createEdgeCollection: 'dropEdgeCollection',
          dropEdgeCollection: 'dropEdgeCollection',
          addField: 'removeField',
          removeField: 'removeField',
          addIndex: 'removeIndex',
          removeIndex: 'removeIndex',
          addTimestamps: 'removeTimestamps',
          removeTimestamps: 'addTimestamps',
          changeCollection: 'changeCollection',
          changeField: 'changeField',
          renameField: 'renameField',
          renameIndex: 'renameIndex',
          renameCollection: 'renameCollection'
        }
      });

      iplSteps = PointerT(Migration.private({
        steps: MaybeG(ListG(StructG({
          args: Array,
          method: EnumG(['createCollection', 'createEdgeCollection', 'addField', 'addIndex', 'addTimestamps', 'changeCollection', 'changeField', 'renameField', 'renameIndex', 'renameCollection', 'dropCollection', 'dropEdgeCollection', 'removeField', 'removeIndex', 'removeTimestamps', 'reversible'])
        })))
      }));

      Migration.public({
        steps: ListG(StructG({
          args: Array,
          method: EnumG(['createCollection', 'createEdgeCollection', 'addField', 'addIndex', 'addTimestamps', 'changeCollection', 'changeField', 'renameField', 'renameIndex', 'renameCollection', 'dropCollection', 'dropEdgeCollection', 'removeField', 'removeIndex', 'removeTimestamps', 'reversible'])
        }))
      }, {
        get: function() {
          var ref;
          return assign([], (ref = this[iplSteps]) != null ? ref : []);
        }
      });

      // так же в рамках DSL нужны:
      // Creation
      //@createCollection #name, options
      Migration.public(Migration.static({
        createCollection: FuncG([String, MaybeG(Object)])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'createCollection'
          });
        }
      }));

      Migration.public(Migration.async({
        createCollection: FuncG([String, MaybeG(Object)])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      // @createEdgeCollection #для хранения связей М:М #collection_1, collection_2, options
      Migration.public(Migration.static({
        createEdgeCollection: FuncG([String, String, MaybeG(Object)])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'createEdgeCollection'
          });
        }
      }));

      Migration.public(Migration.async({
        createEdgeCollection: FuncG([String, String, MaybeG(Object)])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@addField #collection_name, field_name, options #{type}
      Migration.public(Migration.static({
        addField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES),
            default: AnyT
          }))
        ])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'addField'
          });
        }
      }));

      Migration.public(Migration.async({
        addField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES),
            default: AnyT
          }))
        ])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@addIndex #collection_name, field_names, options
      Migration.public(Migration.static({
        addIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'addIndex'
          });
        }
      }));

      Migration.public(Migration.async({
        addIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@addTimestamps # создание полей createdAt, updatedAt, deletedAt #collection_name, options
      Migration.public(Migration.static({
        addTimestamps: FuncG([String, MaybeG(Object)])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'addTimestamps'
          });
        }
      }));

      Migration.public(Migration.async({
        addTimestamps: FuncG([String, MaybeG(Object)])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      // Modification
      //@changeCollection #name, options
      Migration.public(Migration.static({
        changeCollection: FuncG([String, Object])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'changeCollection'
          });
        }
      }));

      Migration.public(Migration.async({
        changeCollection: FuncG([String, Object])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@changeField #collection_name, field_name, options #{type}
      Migration.public(Migration.static({
        changeField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES)
          }))
        ])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'changeField'
          });
        }
      }));

      Migration.public(Migration.async({
        changeField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES)
          }))
        ])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@renameField #collection_name, field_name, new_field_name
      Migration.public(Migration.static({
        renameField: FuncG([String, String, String])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'renameField'
          });
        }
      }));

      Migration.public(Migration.async({
        renameField: FuncG([String, String, String])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@renameIndex #collection_name, old_name, new_name
      Migration.public(Migration.static({
        renameIndex: FuncG([String, String, String])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'renameIndex'
          });
        }
      }));

      Migration.public(Migration.async({
        renameIndex: FuncG([String, String, String])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@renameCollection #collection_name, old_name, new_name
      Migration.public(Migration.static({
        renameCollection: FuncG([String, String])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'renameCollection'
          });
        }
      }));

      Migration.public(Migration.async({
        renameCollection: FuncG([String, String])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //Deletion
      //@dropCollection #name
      Migration.public(Migration.static({
        dropCollection: FuncG(String)
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'dropCollection'
          });
        }
      }));

      Migration.public(Migration.async({
        dropCollection: FuncG(String)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      // @dropEdgeCollection #collection_1, collection_2
      Migration.public(Migration.static({
        dropEdgeCollection: FuncG([String, String])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'dropEdgeCollection'
          });
        }
      }));

      Migration.public(Migration.async({
        dropEdgeCollection: FuncG([String, String])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@removeField #collection_name, field_name
      Migration.public(Migration.static({
        removeField: FuncG([String, String])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'removeField'
          });
        }
      }));

      Migration.public(Migration.async({
        removeField: FuncG([String, String])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@removeIndex #collection_name, field_names, options
      Migration.public(Migration.static({
        removeIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'removeIndex'
          });
        }
      }));

      Migration.public(Migration.async({
        removeIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      //@removeTimestamps # удаление полей createdAt, updatedAt, deletedAt #collection_name, options
      Migration.public(Migration.static({
        removeTimestamps: FuncG([String, MaybeG(Object)])
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'removeTimestamps'
          });
        }
      }));

      Migration.public(Migration.async({
        removeTimestamps: FuncG([String, MaybeG(Object)])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      // Special
      // нужен для того, чтобы обернуть операцию изменения множества документов в удобном виде внутри `change` чтобы не писать много кода в up и down
      // пример использования:
      /*
      ```
        {wrap} = RC::Utils.co
       * без асинхронности - 'addField', 'reversible' и 'removeField' части DSL.
       * Они сохранят в метаданные все необходимое.
       * а реальный запускаемый код (автоматический или кастомынй)
       * будет в 'up' и 'down'
        @change ->
          @addField 'users', 'first_name', 'string'
          @addField 'users', 'last_name', 'string'

          @reversible wrap (dir)->
            UsersCollection = @collection.facade.retrieveProxy USERS
            yield UsersCollection.forEach wrap (u)->
              yield dir.up   wrap ->
                [u.first_name, u.last_name] = u.full_name.split(' ')
                yield return
              yield dir.down wrap ->
                u.full_name = "#{u.first_name} #{u.last_name}"
                yield return
              yield u.save()
              yield return
            yield return

          @removeField 'users', 'full_name'
          return
      ```
       */
      Migration.public(Migration.static({
        reversible: FuncG(AsyncFuncG(StructG({
          up: AsyncFuncG(AsyncFunctionT),
          down: AsyncFuncG(AsyncFunctionT)
        })))
      }, {
        default: function(...args) {
          this.prototype[iplSteps].push({
            args,
            method: 'reversible'
          });
        }
      }));

      // Custom
      // будет выполняться функция содержащая платформозависимый код.
      // пример использования
      /*
      ```
        {wrap} = RC::Utils.co
        @up ->
          yield @execute wrap ->
            { db } = require '@arangodb'
            unless db._collection 'cucumbers'
              db._createDocumentCollection 'cucumbers', waitForSync: yes
            db._collection('cucumbers').ensureIndex
              type: 'hash'
              fields: ['type']
            yield return
          yield return
        @down ->
          yield @execute wrap ->
            { db } = require '@arangodb'
            if db._collection 'cucumbers'
              db._drop 'cucumbers'
            yield return
          yield return
      ```
      */
      Migration.public(Migration.async({
        execute: FuncG(AsyncFunctionT)
      }, {
        default: function*(lambda) {
          yield lambda.apply(this, []);
        }
      }));

      // управляющие методы
      //@migrate #direction - переопределять не надо, тут главная точка вызова снаружи.
      Migration.public(Migration.async({
        migrate: FuncG([EnumG(UP, DOWN)])
      }, {
        default: function*(direction) {
          switch (direction) {
            case UP:
              yield this.up();
              break;
            case DOWN:
              yield this.down();
          }
        }
      }));

      // если объявлена реализация метода `change`, то `up` и `down` объявлять не нужно (будут автоматически выдавать ответ на основе методанных объявленных в `change`)
      // использовать показанные выше DSL-методы надо именно в `change`
      Migration.public(Migration.static({
        change: FuncG(Function)
      }, {
        default: function(lambda) {
          var base;
          if ((base = this.prototype)[iplSteps] == null) {
            base[iplSteps] = [];
          }
          lambda.apply(this, []);
        }
      }));

      // с кодом Collections и Records объявленных в приложении надо работать именно в `up` и в `down`
      // асинхронные, потому что будут работать с базой данных возможно через I/O
      // здесь должна быть объявлена логика "автоматическая" - если вызов `change` создает метаданные, то заиспользовать эти метаданные для выполнения. Если метаданных нет, то скорее всего либо это пока еще пустая миграция без кода вообще, либо в унаследованном классе будут переопределны и `up` и `down`
      Migration.public(Migration.async({
        up: Function
      }, {
        default: function*() {
          var ref, ref1, steps;
          steps = (ref = (ref1 = this[iplSteps]) != null ? ref1.slice(0) : void 0) != null ? ref : [];
          yield forEach(steps, function*({method, args}) {
            var lambda;
            if (method === 'reversible') {
              [lambda] = args;
              return (yield lambda.call(this, {
                up: co.wrap(function*(f) {
                  return (yield f());
                }),
                down: co.wrap(function*() {
                  return (yield Module.prototype.Promise.resolve());
                })
              }));
            } else {
              return (yield this[method](...args));
            }
          }, this);
        }
      }));

      Migration.public(Migration.static({
        up: FuncG(AsyncFunctionT)
      }, {
        default: function(lambda) {
          var base;
          if ((base = this.prototype)[iplSteps] == null) {
            base[iplSteps] = [];
          }
          this.public(this.async({
            up: AsyncFunctionT
          }, {
            default: lambda
          }));
        }
      }));

      Migration.public(Migration.async({
        down: Function
      }, {
        default: function*() {
          var ref, ref1, steps;
          steps = (ref = (ref1 = this[iplSteps]) != null ? ref1.slice(0) : void 0) != null ? ref : [];
          steps.reverse();
          yield forEach(steps, function*({method, args}) {
            var collectionName, lambda, newName, oldName;
            if (method === 'reversible') {
              [lambda] = args;
              return (yield lambda.call(this, {
                up: co.wrap(function*() {
                  return (yield Module.prototype.Promise.resolve());
                }),
                down: co.wrap(function*(f) {
                  return (yield f());
                })
              }));
            } else if (_.includes(['renameField', 'renameIndex'], method)) {
              [collectionName, oldName, newName] = args;
              return (yield this[method](collectionName, newName, oldName));
            } else if (method === 'renameCollection') {
              [collectionName, newName] = args;
              return (yield this[method](newName, collectionName));
            } else {
              return (yield this[REVERSE_MAP[method]](...args));
            }
          }, this);
        }
      }));

      Migration.public(Migration.static({
        down: FuncG(AsyncFunctionT)
      }, {
        default: function(lambda) {
          var base;
          if ((base = this.prototype)[iplSteps] == null) {
            base[iplSteps] = [];
          }
          this.public(this.async({
            down: AsyncFunctionT
          }, {
            default: lambda
          }));
        }
      }));

      Migration.public(Migration.static(Migration.async({
        restoreObject: FuncG([SubsetG(Module), Object], RecordInterface)
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Migration.public(Migration.static(Migration.async({
        replicateObject: FuncG(RecordInterface, Object)
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Migration.initialize();

      return Migration;

    }).call(this);
  };

}).call(this);
