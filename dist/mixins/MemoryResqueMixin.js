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
  ```coffee
  module.exports = (Module)->
    class BaseResque extends Module::Resque
      @inheritProtected()
      @module Module
      @include Module::MemoryResqueMixin

    return BaseResque.initialize()
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
          @facade.registerProxy Module::BaseResque.new RESQUE
          #...

    PrepareModelCommand.initialize()
  ```
   */
  module.exports = function(Module) {
    var AnyT, DEFAULT_QUEUE, DictG, EnumG, FuncG, InterfaceG, ListG, MaybeG, Mixin, PointerT, Resque, StructG, UnionG, _, inflect;
    ({
      DEFAULT_QUEUE,
      AnyT,
      PointerT,
      FuncG,
      DictG,
      ListG,
      StructG,
      EnumG,
      MaybeG,
      InterfaceG,
      UnionG,
      Resque,
      Mixin,
      Utils: {_, inflect}
    } = Module.prototype);
    return Module.defineMixin(Mixin('MemoryResqueMixin', function(BaseClass = Resque) {
      return (function() {
        var _Class, ipoJobs, ipoQueues;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        ipoJobs = PointerT(_Class.protected({
          jobs: DictG(String, MaybeG(ListG(MaybeG(InterfaceG({
            queueName: String,
            data: StructG({
              scriptName: String,
              data: AnyT
            }),
            delayUntil: Number,
            status: EnumG(['scheduled', 'failed', 'queued', 'running', 'completed']),
            lockLifetime: EnumG([5000]),
            lockLimit: EnumG([2])
          })))))
        }));

        ipoQueues = PointerT(_Class.protected({
          queues: DictG(String, MaybeG(StructG({
            name: String,
            concurrency: Number
          })))
        }));

        _Class.public({
          onRegister: Function
        }, {
          default: function(...args) {
            var fullName;
            this.super(...args);
            this[ipoQueues] = {};
            this[ipoJobs] = {};
            fullName = this.fullQueueName(DEFAULT_QUEUE);
            this[ipoQueues][fullName] = {
              name: DEFAULT_QUEUE,
              concurrency: 1
            };
          }
        });

        _Class.public({
          onRemove: Function
        }, {
          default: function(...args) {
            var i, j, len, len1, queueName, ref, ref1;
            this.super(...args);
            ref = Reflect.ownKeys(this[ipoQueues]);
            for (i = 0, len = ref.length; i < len; i++) {
              queueName = ref[i];
              delete this[ipoQueues][queueName];
            }
            this[ipoQueues] = {};
            ref1 = Reflect.ownKeys(this[ipoJobs]);
            // delete @[ipoQueues]
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              queueName = ref1[j];
              delete this[ipoJobs][queueName];
            }
            // delete @[ipoJobs]
            this[ipoJobs] = {};
          }
        });

        _Class.public(_Class.async({
          ensureQueue: FuncG([String, MaybeG(Number)], StructG({
            name: String,
            concurrency: Number
          }))
        }, {
          default: function*(name, concurrency = 1) {
            var fullName, queue;
            fullName = this.fullQueueName(name);
            if ((queue = this[ipoQueues][fullName]) != null) {
              queue.concurrency = concurrency;
              this[ipoQueues][fullName] = queue;
            } else {
              this[ipoQueues][fullName] = {name, concurrency};
            }
            return {name, concurrency};
          }
        }));

        _Class.public(_Class.async({
          getQueue: FuncG(String, MaybeG(StructG({
            name: String,
            concurrency: Number
          })))
        }, {
          default: function*(name) {
            var concurrency, fullName, queue;
            fullName = this.fullQueueName(name);
            if ((queue = this[ipoQueues][fullName]) != null) {
              ({concurrency} = queue);
              return {name, concurrency};
            } else {

            }
          }
        }));

        _Class.public(_Class.async({
          removeQueue: FuncG(String)
        }, {
          default: function*(queueName) {
            var fullName, queue;
            fullName = this.fullQueueName(queueName);
            if ((queue = this[ipoQueues][fullName]) != null) {
              delete this[ipoQueues][fullName];
            }
          }
        }));

        _Class.public(_Class.async({
          allQueues: FuncG([], ListG(StructG({
            name: String,
            concurrency: Number
          })))
        }, {
          default: function*() {
            return _.values(this[ipoQueues]).map(function({name, concurrency}) {
              return {name, concurrency};
            });
          }
        }));

        _Class.public(_Class.async({
          pushJob: FuncG([String, String, AnyT, MaybeG(Number)], UnionG(String, Number))
        }, {
          default: function*(queueName, scriptName, data, delayUntil) {
            var base, fullName, jobId, length;
            fullName = this.fullQueueName(queueName);
            if (delayUntil == null) {
              delayUntil = Date.now();
            }
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            length = this[ipoJobs][fullName].push({
              queueName: fullName,
              data: {scriptName, data},
              delayUntil: delayUntil,
              status: 'scheduled',
              lockLifetime: 5000,
              lockLimit: 2
            });
            jobId = length - 1;
            return jobId;
          }
        }));

        _Class.public(_Class.async({
          getJob: FuncG([String, UnionG(String, Number)], MaybeG(Object))
        }, {
          default: function*(queueName, jobId) {
            var base, fullName, ref;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            return (ref = this[ipoJobs][fullName][jobId]) != null ? ref : null;
          }
        }));

        _Class.public(_Class.async({
          deleteJob: FuncG([String, UnionG(String, Number)], Boolean)
        }, {
          default: function*(queueName, jobId) {
            var base, fullName, isDeleted;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            if (this[ipoJobs][fullName][jobId] != null) {
              delete this[ipoJobs][fullName][jobId];
              isDeleted = true;
            } else {
              isDeleted = false;
            }
            return isDeleted;
          }
        }));

        _Class.public(_Class.async({
          abortJob: FuncG([String, UnionG(String, Number)])
        }, {
          default: function*(queueName, jobId) {
            var base, fullName, job;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            if ((job = this[ipoJobs][fullName][jobId]) != null) {
              if (job.status === 'scheduled') {
                job.status = 'failed';
                job.reason = new Error('Job has been aborted');
              }
            }
          }
        }));

        _Class.public(_Class.async({
          allJobs: FuncG([String, MaybeG(String)], ListG(Object))
        }, {
          default: function*(queueName, scriptName = null) {
            var base, fullName, res;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            res = this[ipoJobs][fullName].filter(function(job) {
              if (scriptName != null) {
                if (job.data.scriptName === scriptName) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }
            });
            return res != null ? res : [];
          }
        }));

        _Class.public(_Class.async({
          pendingJobs: FuncG([String, MaybeG(String)], ListG(Object))
        }, {
          default: function*(queueName, scriptName) {
            var base, fullName, res;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            res = this[ipoJobs][fullName].filter(function(job) {
              var ref, ref1;
              if (scriptName != null) {
                if (job.data.scriptName === scriptName && ((ref = job.status) === 'scheduled' || ref === 'queued')) {
                  return true;
                } else {
                  return false;
                }
              } else {
                if ((ref1 = job.status) === 'scheduled' || ref1 === 'queued') {
                  return true;
                } else {
                  return false;
                }
              }
            });
            return res != null ? res : [];
          }
        }));

        _Class.public(_Class.async({
          progressJobs: FuncG([String, MaybeG(String)], ListG(Object))
        }, {
          default: function*(queueName, scriptName) {
            var base, fullName, res;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            res = this[ipoJobs][fullName].filter(function(job) {
              if (scriptName != null) {
                if (job.data.scriptName === scriptName && job.status === 'running') {
                  return true;
                } else {
                  return false;
                }
              } else {
                if (job.status === 'running') {
                  return true;
                } else {
                  return false;
                }
              }
            });
            return res != null ? res : [];
          }
        }));

        _Class.public(_Class.async({
          completedJobs: FuncG([String, MaybeG(String)], ListG(Object))
        }, {
          default: function*(queueName, scriptName) {
            var base, fullName, res;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            res = this[ipoJobs][fullName].filter(function(job) {
              if (scriptName != null) {
                if (job.data.scriptName === scriptName && job.status === 'completed') {
                  return true;
                } else {
                  return false;
                }
              } else {
                if (job.status === 'completed') {
                  return true;
                } else {
                  return false;
                }
              }
            });
            return res != null ? res : [];
          }
        }));

        _Class.public(_Class.async({
          failedJobs: FuncG([String, MaybeG(String)], ListG(Object))
        }, {
          default: function*(queueName, scriptName) {
            var base, fullName, res;
            fullName = this.fullQueueName(queueName);
            if ((base = this[ipoJobs])[fullName] == null) {
              base[fullName] = [];
            }
            res = this[ipoJobs][fullName].filter(function(job) {
              if (scriptName != null) {
                if (job.data.scriptName === scriptName && job.status === 'failed') {
                  return true;
                } else {
                  return false;
                }
              } else {
                if (job.status === 'failed') {
                  return true;
                } else {
                  return false;
                }
              }
            });
            return res != null ? res : [];
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
