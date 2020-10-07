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
  for example

  ```coffee
  module.exports = (Module)->
    {
      Resource
      BodyParseMixin
    } = Module::

    class CucumbersResource extends Resource
      @inheritProtected()
      @include BodyParseMixin
      @module Module

      @initialHook 'parseBody', only: ['create', 'update']

      @public entityName: String,
        default: 'cucumber'

    CucumbersResource.initialize()
  ```
  */
  module.exports = function(Module) {
    var AnyT, ContextInterface, EventEmitterT, FuncG, HANDLER_RESULT, JOB_RESULT, MIGRATE, MaybeG, Mediator, Mixin, NotificationInterface, PointerT, ROLLBACK, ResourceInterface, STOPPED_MIGRATE, STOPPED_ROLLBACK, StructG, genRandomAlphaNumbers;
    ({
      MIGRATE,
      ROLLBACK,
      JOB_RESULT,
      HANDLER_RESULT,
      STOPPED_MIGRATE,
      STOPPED_ROLLBACK,
      AnyT,
      PointerT,
      EventEmitterT,
      FuncG,
      MaybeG,
      StructG,
      ContextInterface,
      ResourceInterface,
      NotificationInterface,
      Mediator,
      Mixin,
      Utils: {genRandomAlphaNumbers}
    } = Module.prototype);
    return Module.defineMixin(Mixin('ApplicationMediatorMixin', function(BaseClass = Mediator) {
      return (function() {
        var _Class, ipoEmitter;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        ipoEmitter = PointerT(_Class.private({
          emitter: EventEmitterT
        }));

        _Class.public({
          listNotificationInterests: FuncG([], Array)
        }, {
          default: function(...args) {
            var interests;
            interests = this.super(...args);
            interests.push(HANDLER_RESULT);
            interests.push(JOB_RESULT);
            interests.push(STOPPED_MIGRATE);
            interests.push(STOPPED_ROLLBACK);
            return interests;
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
              case HANDLER_RESULT:
              case STOPPED_MIGRATE:
              case STOPPED_ROLLBACK:
              case JOB_RESULT:
                this[ipoEmitter].emit(vsType, voBody);
                break;
              default:
                this.super(aoNotification);
            }
          }
        });

        _Class.public(_Class.async({
          migrate: FuncG([
            MaybeG(StructG({
              until: MaybeG(String)
            }))
          ])
        }, {
          default: function*(opts) {
            return (yield Module.prototype.Promise.new((resolve, reject) => {
              var err, reverse;
              try {
                reverse = genRandomAlphaNumbers(32);
                this[ipoEmitter].once(reverse, function({error}) {
                  if (error != null) {
                    reject(error);
                    return;
                  }
                  resolve();
                });
                this.facade.sendNotification(MIGRATE, opts, reverse);
              } catch (error1) {
                err = error1;
                reject(err);
              }
            }));
          }
        }));

        _Class.public(_Class.async({
          rollback: FuncG([
            MaybeG(StructG({
              steps: MaybeG(Number),
              until: MaybeG(String)
            }))
          ])
        }, {
          default: function*(opts) {
            return (yield Module.prototype.Promise.new((resolve, reject) => {
              var err, reverse;
              try {
                reverse = genRandomAlphaNumbers(32);
                this[ipoEmitter].once(reverse, function({error}) {
                  if (error != null) {
                    reject(error);
                    return;
                  }
                  resolve();
                });
                this.facade.sendNotification(ROLLBACK, opts, reverse);
              } catch (error1) {
                err = error1;
                reject(err);
              }
            }));
          }
        }));

        _Class.public(_Class.async({
          run: FuncG([String, MaybeG(AnyT)], MaybeG(AnyT))
        }, {
          default: function*(scriptName, data) {
            return (yield Module.prototype.Promise.new((resolve, reject) => {
              var err, reverse;
              try {
                reverse = genRandomAlphaNumbers(32);
                this[ipoEmitter].once(reverse, function({error, result}) {
                  if (error != null) {
                    reject(error);
                    return;
                  }
                  resolve(result);
                });
                this.facade.sendNotification(scriptName, data, reverse);
              } catch (error1) {
                err = error1;
                reject(err);
              }
            }));
          }
        }));

        _Class.public(_Class.async({
          execute: FuncG([
            String,
            StructG({
              context: ContextInterface,
              reverse: String
            }),
            String
          ], StructG({
            result: MaybeG(AnyT),
            resource: ResourceInterface
          }))
        }, {
          default: function*(resourceName, {context, reverse}, action) {
            return (yield Module.prototype.Promise.new((resolve, reject) => {
              var err;
              try {
                this[ipoEmitter].once(reverse, function({error, result, resource}) {
                  if (error != null) {
                    reject(error);
                    return;
                  }
                  resolve({result, resource});
                });
                this.sendNotification(resourceName, {context, reverse}, action, null);
              } catch (error1) {
                err = error1;
                reject(err);
              }
            }));
          }
        }));

        _Class.public({
          init: FuncG([String, AnyT])
        }, {
          default: function(...args) {
            var EventEmitter, voEmitter;
            EventEmitter = require('events');
            voEmitter = new EventEmitter();
            this[ipoEmitter] = voEmitter;
            return this.super(...args);
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
