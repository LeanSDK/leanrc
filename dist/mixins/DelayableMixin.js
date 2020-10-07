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

  // миксин может подмешиваеться к любым классам унаследованным от Module::CoreObject
  // в классе появляется статический атрибут `delay` после обращения к которому через '.' можно вызвать один из статических методов класса так, чтобы он отработал асинхронно в фоновом режиме (условно говоря в отдельном внешнем процессе).
  // для этого используется функционал Resque и Queue
  // апи технологии сделано по аналогии с https://github.com/collectiveidea/delayed_job
  module.exports = function(Module) {
    var CoreObject, DelayableInterface, FacadeInterface, FuncG, InterfaceG, MaybeG, Mixin, PointerT, StructG, _, co;
    ({
      PointerT,
      FuncG,
      StructG,
      MaybeG,
      InterfaceG,
      DelayableInterface,
      FacadeInterface,
      CoreObject,
      Mixin,
      Utils: {_, co}
    } = Module.prototype);
    return Module.defineMixin(Mixin('DelayableMixin', function(BaseClass = CoreObject) {
      return (function() {
        var _Class, cpmDelayJob;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.implements(DelayableInterface);

        cpmDelayJob = PointerT(_Class.private(_Class.static(_Class.async({
          delayJob: FuncG([
            FacadeInterface,
            StructG({
              moduleName: String,
              replica: Object,
              methodName: String,
              args: Array,
              opts: InterfaceG({
                queue: MaybeG(String),
                delayUntil: MaybeG(Number)
              })
            }),
            InterfaceG({
              queue: MaybeG(String),
              delayUntil: MaybeG(Number)
            })
          ])
        }, {
          default: function*(facade, data, options) {
            var queue, ref, resque;
            resque = facade.retrieveProxy(Module.prototype.RESQUE);
            queue = (yield resque.get((ref = options.queue) != null ? ref : Module.prototype.DELAYED_JOBS_QUEUE));
            yield queue.delay(Module.prototype.DELAYED_JOBS_SCRIPT, data, options.delayUntil);
          }
        }))));

        /*
        ```coffee
          #...
          yield CucumbersProxy.delay(@facade).calculateAvgPrice 'cucu123'
          #...
        ```
        or
        ```coffee
          #...
          yield TomatoRecord.delay(@facade,
            queue: 'FilesJobs'
            delayUntil: Date.now() + 60000
          ).imageProcessing '480x900'
          #...
        ```
         */
        _Class.public(_Class.static({
          delay: FuncG([
            FacadeInterface,
            MaybeG(InterfaceG({
              queue: MaybeG(String),
              delayUntil: MaybeG(Number)
            }))
          ])
        }, {
          default: function(facade, opts = {}) {
            return new Proxy(this, {
              get: function(target, name, receiver) {
                if (name === 'delay') {
                  throw new Error("Method `delay` can not been delayed");
                }
                if (!(name in target) || typeof target[name] !== "function") {
                  throw new Error(`Method \`${_.isSymbol(name) ? Symbol.keyFor(name) : name}\` absent in class ${target.name}`);
                }
                return co.wrap(function*(...args) {
                  var data;
                  data = {
                    moduleName: target.moduleName(),
                    replica: (yield target.constructor.replicateObject(target)),
                    methodName: name,
                    args,
                    opts
                  };
                  return (yield target[cpmDelayJob](facade, data, opts));
                });
              }
            });
          }
        }));

        _Class.public({
          delay: FuncG([
            FacadeInterface,
            MaybeG(InterfaceG({
              queue: MaybeG(String),
              delayUntil: MaybeG(Number)
            }))
          ])
        }, {
          default: function(facade, opts = {}) {
            return new Proxy(this, {
              get: function(target, name, receiver) {
                if (name === 'delay') {
                  throw new Error("Method `delay` can not been delayed");
                }
                if (!(name in target) || typeof target[name] !== "function") {
                  throw new Error(`Method \`${_.isSymbol(name) ? Symbol.keyFor(name) : name}\` absent in class ${target.name}.prototype`);
                }
                return co.wrap(function*(...args) {
                  var data;
                  data = {
                    moduleName: target.moduleName(),
                    replica: (yield target.constructor.replicateObject(target)),
                    methodName: name,
                    args,
                    opts
                  };
                  return (yield target.constructor[cpmDelayJob](facade, data, opts));
                });
              }
            });
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
