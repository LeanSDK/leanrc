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
  var hasProp = {}.hasOwnProperty;

  /*
  ```coffee
  module.exports = (Module)->
    class BaseResqueExecutor extends Module::MemoryResqueExecutor
      @inheritProtected()
      @module Module

    return BaseResqueExecutor.initialize()
  ```

  ```coffee
  module.exports = (Module)->
    {RESQUE} = Module::

    class PrepareViewCommand extends Module::SimpleCommand
      @inheritProtected()

      @module Module

      @public execute: Function,
        default: ->
          #...
          @facade.registerMediator Module::BaseResqueExecutor.new RESQUE_EXECUTOR
          #...

    PrepareViewCommand.initialize()
  ```
   */
  // Чтобы запустить экзекютор нужно послать сиграл с ключем START_RESQUE
  // Медиатор надо регистрировать с ключем RESQUE_EXECUTOR
  module.exports = function(Module) {
    var ConfigurableMixin, DelayableMixin, DictG, FuncG, JOB_RESULT, MaybeG, Mediator, Mixin, NotificationInterface, PointerT, RESQUE, RESQUE_EXECUTOR, ResqueInterface, START_RESQUE, StructG, UnionG, _, co, genRandomAlphaNumbers, isArangoDB;
    ({
      JOB_RESULT,
      START_RESQUE,
      RESQUE,
      RESQUE_EXECUTOR,
      PointerT,
      FuncG,
      DictG,
      StructG,
      MaybeG,
      UnionG,
      ResqueInterface,
      NotificationInterface,
      Mediator,
      Mixin,
      DelayableMixin,
      ConfigurableMixin,
      Utils: {_, co, isArangoDB, genRandomAlphaNumbers}
    } = Module.prototype);
    return Module.defineMixin(Mixin('MemoryExecutorMixin', function(BaseClass = Mediator) {
      return (function() {
        var _Class, ipbIsStopped, ipoConcurrencyCount, ipoDefinedProcessors, ipoResque, ipoTimer, ipsMultitonKey;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.include(DelayableMixin);

        _Class.include(ConfigurableMixin);

        _Class.public({
          fullQueueName: FuncG(String, String)
        }, {
          default: function(queueName) {
            return this[ipoResque].fullQueueName(queueName);
          }
        });

        ipsMultitonKey = PointerT(Symbol.for('~multitonKey'));

        ipoTimer = PointerT(_Class.private({
          timer: MaybeG(UnionG(Object, Number))
        }));

        ipbIsStopped = PointerT(_Class.private({
          isStopped: Boolean
        }));

        ipoDefinedProcessors = PointerT(_Class.private({
          definedProcessors: DictG(String, StructG({
            listener: Function,
            concurrency: Number
          }))
        }));

        ipoConcurrencyCount = PointerT(_Class.private({
          concurrencyCount: DictG(String, Number)
        }));

        ipoResque = PointerT(_Class.private({
          resque: ResqueInterface
        }));

        _Class.public({
          listNotificationInterests: FuncG([], Array)
        }, {
          default: function() {
            return [JOB_RESULT, START_RESQUE];
          }
        });

        _Class.public({
          handleNotification: FuncG(NotificationInterface)
        }, {
          default: function(aoNotification) {
            var voBody, vsName, vsType;
            vsName = aoNotification.getName();
            voBody = aoNotification.getBody();
            vsType = aoNotification.getType();
            switch (vsName) {
              case JOB_RESULT:
                this.getViewComponent().emit(vsType, voBody);
                break;
              case START_RESQUE:
                this.start();
            }
          }
        });

        _Class.public({
          onRegister: Function
        }, {
          default: function(...args) {
            var EventEmitter;
            this.super(...args);
            EventEmitter = require('events');
            this.setViewComponent(new EventEmitter());
            this[ipoConcurrencyCount] = {};
            this[ipoDefinedProcessors] = {};
            this[ipoResque] = this.facade.retrieveProxy(RESQUE);
            this.defineProcessors();
          }
        });

        _Class.public(_Class.async({
          reDefineProcessors: Function
        }, {
          default: function*() {
            this.stop();
            this[ipoDefinedProcessors] = {};
            yield this.defineProcessors();
          }
        }));

        _Class.public(_Class.async({
          defineProcessors: Function
        }, {
          default: function*() {
            var concurrency, fullQueueName, i, len, moduleName, name, ref, self;
            ref = (yield this[ipoResque].allQueues());
            for (i = 0, len = ref.length; i < len; i++) {
              ({name, concurrency} = ref[i]);
              fullQueueName = this[ipoResque].fullQueueName(name);
              [moduleName] = fullQueueName.split('|>');
              if (moduleName === this.moduleName()) {
                self = this;
                this.define(name, {concurrency}, co.wrap(function(job, done) {
                  var data, reverse, scriptName;
                  reverse = genRandomAlphaNumbers(32);
                  self.getViewComponent().once(reverse, function(aoError) {
                    return done(aoError);
                  });
                  ({scriptName, data} = job.data);
                  self.sendNotification(scriptName, data, reverse);
                }));
              }
              continue;
            }
          }
        }));

        _Class.public({
          onRemove: Function
        }, {
          default: function(...args) {
            this.super(...args);
            this.stop();
          }
        });

        _Class.public(_Class.async({
          cyclePart: Function
        }, {
          default: function*() {
            var concurrency, currentQC, i, j, job, len, len1, listener, now, pendingJobs, progressJobs, queueConfig, queueName, ref;
            ref = this[ipoDefinedProcessors];
            for (queueName in ref) {
              if (!hasProp.call(ref, queueName)) continue;
              queueConfig = ref[queueName];
              ({listener, concurrency} = queueConfig);
              currentQC = this[ipoConcurrencyCount][queueName];
              now = Date.now();
              progressJobs = (yield this[ipoResque].progressJobs(queueName));
              for (i = 0, len = progressJobs.length; i < len; i++) {
                job = progressJobs[i];
                if ((now - job.startedAt) < job.lockLifetime) {
                  job.status = 'scheduled';
                }
              }
              pendingJobs = (yield this[ipoResque].pendingJobs(queueName));
              if (((currentQC != null) && currentQC < concurrency) || (currentQC == null)) {
                for (j = 0, len1 = pendingJobs.length; j < len1; j++) {
                  job = pendingJobs[j];
                  if (job.delayUntil < now) {
                    listener(job);
                  }
                  if (currentQC >= concurrency) {
                    break;
                  }
                }
              }
            }
            this.recursion();
          }
        }));

        _Class.public(_Class.async({
          recursion: Function
        }, {
          default: function*() {
            var self;
            if (this[ipbIsStopped]) {
              return;
            }
            self = this;
            this[ipoTimer] = setTimeout(co.wrap(function*() {
              clearTimeout(self[ipoTimer]);
              return (yield self.cyclePart());
            }), 100);
          }
        }));

        _Class.public(_Class.async({
          start: Function
        }, {
          default: function*() {
            if (isArangoDB()) {
              throw new Error('MemoryExecutorMixin can not been used for ArrangoDB apps');
              return;
            }
            this[ipbIsStopped] = false;
            yield this.recursion();
          }
        }));

        _Class.public({
          stop: Function
        }, {
          default: function() {
            if (isArangoDB()) {
              throw new Error('MemoryExecutorMixin can not been used for ArrangoDB apps');
              return;
            }
            this[ipbIsStopped] = true;
            if (this[ipoTimer] != null) {
              clearTimeout(this[ipoTimer]);
            }
          }
        });

        _Class.public({
          define: FuncG([
            String,
            StructG({
              concurrency: Number
            }),
            Function
          ])
        }, {
          default: function(queueName, {concurrency}, lambda) {
            var listener;
            listener = (job) => {
              var base, done;
              done = (err) => {
                if (err != null) {
                  job.status = 'failed';
                  job.reason = err;
                } else {
                  job.status = 'completed';
                }
                this[ipoConcurrencyCount][queueName] -= 1;
              };
              if ((base = this[ipoConcurrencyCount])[queueName] == null) {
                base[queueName] = 0;
              }
              this[ipoConcurrencyCount][queueName] += 1;
              job.status = 'running';
              job.startedAt = Date.now();
              lambda(job, done);
            };
            this[ipoDefinedProcessors][queueName] = {listener, concurrency};
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
