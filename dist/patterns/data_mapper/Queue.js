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
  var hasProp = {}.hasOwnProperty;

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
    var AnyT, CoreObject, FuncG, ListG, MaybeG, Queue, QueueInterface, ResqueInterface, SubsetG, UnionG;
    ({AnyT, FuncG, SubsetG, MaybeG, UnionG, ListG, QueueInterface, ResqueInterface, CoreObject} = Module.prototype);
    return Queue = (function() {
      class Queue extends CoreObject {};

      Queue.inheritProtected();

      Queue.implements(QueueInterface);

      Queue.module(Module);

      // конструктор принимает второй аргумент, ссылку на resque proxy.
      Queue.public({
        resque: ResqueInterface
      });

      Queue.public({
        name: String
      });

      Queue.public({
        concurrency: Number
      });

      Queue.public(Queue.async({
        delay: FuncG([String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }, {
        default: function*(scriptName, data, delayUntil) {
          return (yield this.resque.delay(this.name, scriptName, data, delayUntil));
        }
      }));

      Queue.public(Queue.async({
        push: FuncG([String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }, {
        default: function*(scriptName, data, delayUntil) {
          return (yield this.resque.pushJob(this.name, scriptName, data, delayUntil));
        }
      }));

      Queue.public(Queue.async({
        get: FuncG([UnionG(String, Number)], MaybeG(Object))
      }, {
        default: function*(jobId) {
          return (yield this.resque.getJob(this.name, jobId));
        }
      }));

      Queue.public(Queue.async({
        delete: FuncG([UnionG(String, Number)], Boolean)
      }, {
        default: function*(jobId) {
          return (yield this.resque.deleteJob(this.name, jobId));
        }
      }));

      Queue.public(Queue.async({
        abort: FuncG([UnionG(String, Number)])
      }, {
        default: function*(jobId) {
          yield this.resque.abortJob(this.name, jobId);
        }
      }));

      Queue.public(Queue.async({
        all: FuncG([MaybeG(String)], ListG(Object))
      }, {
        default: function*(scriptName) {
          return (yield this.resque.allJobs(this.name, scriptName));
        }
      }));

      Queue.public(Queue.async({
        pending: FuncG([MaybeG(String)], ListG(Object))
      }, {
        default: function*(scriptName) {
          return (yield this.resque.pendingJobs(this.name, scriptName));
        }
      }));

      Queue.public(Queue.async({
        progress: FuncG([MaybeG(String)], ListG(Object))
      }, {
        default: function*(scriptName) {
          return (yield this.resque.progressJobs(this.name, scriptName));
        }
      }));

      Queue.public(Queue.async({
        completed: FuncG([MaybeG(String)], ListG(Object))
      }, {
        default: function*(scriptName) {
          return (yield this.resque.completedJobs(this.name, scriptName));
        }
      }));

      Queue.public(Queue.async({
        failed: FuncG([MaybeG(String)], ListG(Object))
      }, {
        default: function*(scriptName) {
          return (yield this.resque.failedJobs(this.name, scriptName));
        }
      }));

      Queue.public(Queue.static(Queue.async({
        restoreObject: FuncG([SubsetG(Module), Object], QueueInterface)
      }, {
        default: function*(Module, replica) {
          var Facade, facade, instance, ref, resque;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            Facade = (ref = Module.prototype.ApplicationFacade) != null ? ref : Module.prototype.Facade;
            facade = Facade.getInstance(replica.multitonKey);
            resque = facade.retrieveProxy(replica.resqueName);
            instance = (yield resque.get(replica.name));
            return instance;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      Queue.public(Queue.static(Queue.async({
        replicateObject: FuncG(QueueInterface, Object)
      }, {
        default: function*(instance) {
          var ipsMultitonKey, replica;
          replica = (yield this.super(instance));
          ipsMultitonKey = Symbol.for('~multitonKey');
          replica.multitonKey = instance.resque[ipsMultitonKey];
          replica.resqueName = instance.resque.getProxyName();
          replica.name = instance.name;
          return replica;
        }
      })));

      Queue.public({
        init: FuncG([Object, ResqueInterface])
      }, {
        default: function(aoProperties, aoResque) {
          var voAttrValue, vsAttrName;
          this.super(...arguments);
          this.resque = aoResque;
          for (vsAttrName in aoProperties) {
            if (!hasProp.call(aoProperties, vsAttrName)) continue;
            voAttrValue = aoProperties[vsAttrName];
            this[vsAttrName] = voAttrValue;
          }
        }
      });

      Queue.initialize();

      return Queue;

    }).call(this);
  };

}).call(this);
