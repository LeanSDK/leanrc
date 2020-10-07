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

  // 1. Некоторая миграция должна создать очередь, чтобы ей потом можно было пользоваться, например Resque.create(<queueName>, <concurrency>)
  // адаптер для аранги реализованный в виде миксина для Resque класса спроецирует запрос с использованием @arango/queue
  // адаптер для nodejs просто сохранит эти данные в какую нибудь базу данных (чтобы в нужный момент к ним обратиться и заиспользовать)
  // 2. В аранго ничего делать в этом пункте не надо, движок базы данных сам будет заниматься менеджментом очередей и будет плодить потоки выполнения. Для nodejs при старте сервера надо проинициализировать Agenda сервис - взять из базы данных сохраненные <queueName> и <concurrency> и задефайнить хендлеры - внутри хендлера из принимаемых данных надо вычленить имя запускаемого скрипта, сделать require(<scriptName>) и заэкзекютить этот скрипт передав в него все данные поступившие в хендлер. (Agenda - должен покрывать функционал аранги по менеджменту очердей.)
  // 3. класс Queue будет работать аналогично Record классу - проксировать вызовы методов к Resque классу (чтобы срабатывала нужная платформозависимая логика из миксина)
  // 4. для job объектов не будет отдельного класса, потому что у них не будет никаких спец-методов - т.е. они будут чистыми структурами (обычный json объект)
  /*
  ```coffee
  module.exports = (Module)->
    class ApplicationResque extends Module::Resque
      @inheritProtected()
      @include Module::ArangoResqueMixin # в этом миксине должны быть реализованы платформозависимые методы, которые будут посылать нативные запросы к реальной базе данных

      @module Module

    return ApplicationResque.initialize()
  ```

  ```coffee
  module.exports = (Module)->
    {RESQUE} = Module::

    class PrepareModelCommand extends Module::SimpleCommand
      @inheritProtected()

      @module Module

      @public execute: Function,
        default: ->
          #...
          @facade.registerProxy Module::ApplicationResque.new RESQUE,
            <config key>: <config value>
          #...

    PrepareModelCommand.initialize()
  ```
   */
  module.exports = function(Module) {
    var AnyT, ConfigurableMixin, DELAYED_JOBS_QUEUE, FuncG, ListG, MaybeG, QueueInterface, Resque, ResqueInterface, StructG, UnionG, uuid;
    ({
      DELAYED_JOBS_QUEUE,
      AnyT,
      FuncG,
      ListG,
      StructG,
      MaybeG,
      UnionG,
      QueueInterface,
      ResqueInterface,
      ConfigurableMixin,
      Utils: {uuid}
    } = Module.prototype);
    return Resque = (function() {
      class Resque extends Module.prototype.Proxy {};

      Resque.inheritProtected();

      Resque.include(ConfigurableMixin);

      Resque.implements(ResqueInterface);

      Resque.module(Module);

      Resque.public({
        tmpJobs: ListG(StructG({
          queueName: String,
          scriptName: String,
          data: AnyT,
          delay: MaybeG(Number),
          id: String
        }))
      });

      Resque.public({
        fullQueueName: FuncG(String, String)
      }, {
        default: function(queueName) {
          var moduleName;
          if (!/\|\>/.test(queueName)) {
            [moduleName] = this.moduleName().split('|>');
            queueName = `${moduleName}|>${queueName}`;
          }
          return queueName;
        }
      });

      Resque.public({
        onRegister: Function
      }, {
        default: function(...args) {
          this.super(...args);
        }
      });

      Resque.public({
        onRemove: Function
      }, {
        default: function(...args) {
          this.super(...args);
          this.tmpJobs = [];
        }
      });

      Resque.public(Resque.async({
        create: FuncG([String, MaybeG(Number)], QueueInterface)
      }, {
        default: function*(queueName, concurrency) {
          var vhNewQueue;
          vhNewQueue = (yield this.ensureQueue(queueName, concurrency));
          return Module.prototype.Queue.new(vhNewQueue, this);
        }
      }));

      Resque.public(Resque.async({
        all: FuncG([], ListG(QueueInterface))
      }, {
        default: function*() {
          var results, vhQueue;
          results = (yield* (function*() {
            var i, len, ref, results1;
            ref = (yield this.allQueues());
            results1 = [];
            for (i = 0, len = ref.length; i < len; i++) {
              vhQueue = ref[i];
              results1.push(Module.prototype.Queue.new(vhQueue, this));
            }
            return results1;
          }).call(this));
          return results;
        }
      }));

      Resque.public(Resque.async({
        get: FuncG(String, MaybeG(QueueInterface))
      }, {
        default: function*(queueName) {
          var vhQueue;
          vhQueue = (yield this.getQueue(queueName));
          if (vhQueue != null) {
            return Module.prototype.Queue.new(vhQueue, this);
          } else {

          }
        }
      }));

      Resque.public(Resque.async({
        remove: FuncG(String)
      }, {
        default: function*(queueName) {
          yield this.removeQueue(queueName);
        }
      }));

      Resque.public(Resque.async({
        update: FuncG([String, Number], QueueInterface)
      }, {
        default: function*(queueName, concurrency) {
          var vhNewQueue;
          vhNewQueue = (yield this.ensureQueue(queueName, concurrency));
          return Module.prototype.Queue.new(vhNewQueue, this);
        }
      }));

      Resque.public(Resque.async({
        delay: FuncG([String, String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }, {
        default: function*(queueName, scriptName, data, delay) {
          var id, queue;
          if (/\|\>/.test(this.facade[Symbol.for('~multitonKey')])) {
            id = uuid.v4();
            this.tmpJobs.push({queueName, scriptName, data, delay, id});
          } else {
            queue = (yield this.get(queueName != null ? queueName : DELAYED_JOBS_QUEUE));
            id = (yield queue.push(scriptName, data, delay));
          }
          return id;
        }
      }));

      Resque.public(Resque.async({
        getDelayed: FuncG([], ListG(StructG({
          queueName: String,
          scriptName: String,
          data: AnyT,
          delay: MaybeG(Number),
          id: String
        })))
      }, {
        default: function*() {
          return this.tmpJobs;
        }
      }));

      Resque.public(Resque.async({
        ensureQueue: FuncG([String, MaybeG(Number)], StructG({
          name: String,
          concurrency: Number
        }))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        getQueue: FuncG(String, MaybeG(StructG({
          name: String,
          concurrency: Number
        })))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        removeQueue: FuncG(String)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        allQueues: FuncG([], ListG(StructG({
          name: String,
          concurrency: Number
        })))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        pushJob: FuncG([String, String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        getJob: FuncG([String, UnionG(String, Number)], MaybeG(Object))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        deleteJob: FuncG([String, UnionG(String, Number)], Boolean)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        abortJob: FuncG([String, UnionG(String, Number)])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        allJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        pendingJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        progressJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        completedJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public(Resque.async({
        failedJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Resque.public({
        init: FuncG([MaybeG(String), MaybeG(AnyT)])
      }, {
        default: function(...args) {
          this.super(...args);
          this.tmpJobs = [];
        }
      });

      Resque.initialize();

      return Resque;

    }).call(this);
  };

}).call(this);
