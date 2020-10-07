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

  // semver        = require 'semver'
  var slice = [].slice;

  module.exports = function(Module) {
    var APPLICATION_MEDIATOR, AnyT, ChainsMixin, CollectionInterface, ConfigurableMixin, ContextInterface, DELAYED_JOBS_QUEUE, DictG, EnumG, FORBIDDEN, FuncG, HANDLER_RESULT, HTTP_NOT_FOUND, ListG, MIGRATIONS, MaybeG, NotificationInterface, RESQUE, Resource, ResourceInterface, SimpleCommand, StructG, TupleG, UNAUTHORIZED, UPGRADE_REQUIRED, UnionG, _, assign, inflect, isArangoDB, statuses;
    ({
      APPLICATION_MEDIATOR,
      HANDLER_RESULT,
      DELAYED_JOBS_QUEUE,
      RESQUE,
      MIGRATIONS,
      AnyT,
      FuncG,
      UnionG,
      TupleG,
      MaybeG,
      DictG,
      StructG,
      EnumG,
      ListG,
      ResourceInterface,
      CollectionInterface,
      ContextInterface,
      NotificationInterface,
      ConfigurableMixin,
      ChainsMixin,
      SimpleCommand,
      Utils: {_, inflect, assign, statuses, isArangoDB}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    UNAUTHORIZED = statuses('unauthorized');
    FORBIDDEN = statuses('forbidden');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return Resource = (function() {
      class Resource extends SimpleCommand {};

      Resource.inheritProtected();

      Resource.include(ConfigurableMixin);

      Resource.include(ChainsMixin);

      Resource.implements(ResourceInterface);

      Resource.module(Module);

      Resource.public({
        entityName: String
      }, {
        get: function*() {
          throw new Error('Not implemented specific property');
        }
      });

      // example of usage
      /*
      @initialHook 'checkApiVersion'
      @initialHook 'checkSession'
      @initialHook 'adminOnly', only: ['create'] # required checkSession before
      @initialHook 'checkOwner', only: ['detail', 'update', 'delete'] # required checkSession before

      @beforeHook 'filterOwnerByCurrentUser', only: ['list']
      @beforeHook 'setOwnerId',       only: ['create']
      @beforeHook 'protectOwnerId',   only: ['update']

      */
      Resource.public({
        needsLimitation: Boolean
      }, {
        default: true
      });

      Resource.public(Resource.async({
        checkApiVersion: Function
      }, {
        default: function*(...args) {
          var ref, semver, vCurrentVersion, vNeedVersion, vVersion;
          vVersion = this.context.pathParams.v;
          vCurrentVersion = this.configs.version;
          if (vCurrentVersion == null) {
            throw new Error('No `version` specified in the configuration');
          }
          [vNeedVersion] = (ref = vCurrentVersion.match(/^\d{1,}[.]\d{1,}/)) != null ? ref : [];
          if (vNeedVersion == null) {
            throw new Error('Incorrect `version` specified in the configuration');
          }
          semver = require('semver');
          if (!semver.satisfies(vCurrentVersion, vVersion)) {
            this.context.throw(UPGRADE_REQUIRED, `Upgrade: v${vCurrentVersion}`);
          }
          return args;
        }
      }));

      Resource.public(Resource.async({
        setOwnerId: Function
      }, {
        default: function*(...args) {
          var ref;
          this.recordBody.ownerId = (ref = this.session.uid) != null ? ref : null;
          return args;
        }
      }));

      Resource.public(Resource.async({
        protectOwnerId: Function
      }, {
        default: function*(...args) {
          this.recordBody = _.omit(this.recordBody, ['ownerId']);
          return args;
        }
      }));

      Resource.public(Resource.async({
        filterOwnerByCurrentUser: Function
      }, {
        default: function*(...args) {
          if (!this.session.userIsAdmin) {
            if (this.listQuery == null) {
              this.listQuery = {};
            }
          }
          if (this.listQuery.$filter != null) {
            this.listQuery.$filter = {
              $and: [
                this.listQuery.$filter,
                {
                  '@doc.ownerId': {
                    $eq: this.session.uid
                  }
                }
              ]
            };
          } else {
            this.listQuery.$filter = {
              '@doc.ownerId': {
                $eq: this.session.uid
              }
            };
          }
          return args;
        }
      }));

      Resource.public(Resource.async({
        checkOwner: Function
      }, {
        default: function*(...args) {
          var doc, key;
          if (this.session.uid == null) {
            this.context.throw(UNAUTHORIZED);
            return;
          }
          if (this.session.userIsAdmin) {
            return args;
          }
          if ((key = this.context.pathParams[this.keyName]) == null) {
            return args;
          }
          doc = (yield this.collection.find(key));
          if (doc == null) {
            this.context.throw(HTTP_NOT_FOUND);
          }
          if (!doc.ownerId) {
            return args;
          }
          if (this.session.uid !== doc.ownerId) {
            this.context.throw(FORBIDDEN);
            return;
          }
          return args;
        }
      }));

      Resource.public(Resource.async({
        checkExistence: Function
      }, {
        default: function*(...args) {
          if (this.recordId == null) {
            this.context.throw(HTTP_NOT_FOUND);
          }
          if (!(yield this.collection.includes(this.recordId))) {
            this.context.throw(HTTP_NOT_FOUND);
          }
          return args;
        }
      }));

      Resource.public(Resource.async({
        adminOnly: Function
      }, {
        default: function*(...args) {
          if (this.session.uid == null) {
            this.context.throw(UNAUTHORIZED);
            return;
          }
          if (!this.session.userIsAdmin) {
            this.context.throw(FORBIDDEN);
            return;
          }
          return args;
        }
      }));

      Resource.public(Resource.async({
        checkSchemaVersion: Function
      }, {
        default: function*(...args) {
          var includes, lastMigration, ref, voMigrations;
          voMigrations = this.facade.retrieveProxy(MIGRATIONS);
          ref = this.Module.prototype.MIGRATION_NAMES, [lastMigration] = slice.call(ref, -1);
          if (lastMigration == null) {
            return args;
          }
          includes = (yield voMigrations.includes(lastMigration));
          if (includes) {
            return args;
          } else {
            throw new Error('Code schema version is not equal current DB version');
            return;
          }
          return args;
        }
      }));

      Resource.public({
        keyName: String
      }, {
        get: function() {
          return inflect.singularize(inflect.underscore(this.entityName));
        }
      });

      Resource.public({
        itemEntityName: String
      }, {
        get: function() {
          return inflect.singularize(inflect.underscore(this.entityName));
        }
      });

      Resource.public({
        listEntityName: String
      }, {
        get: function() {
          return inflect.pluralize(inflect.underscore(this.entityName));
        }
      });

      Resource.public({
        collectionName: String
      }, {
        get: function() {
          return `${inflect.pluralize(inflect.camelize(this.entityName))}Collection`;
        }
      });

      Resource.public({
        collection: CollectionInterface
      }, {
        get: function() {
          return this.facade.retrieveProxy(this.collectionName);
        }
      });

      Resource.public({
        context: MaybeG(ContextInterface)
      });

      Resource.public({
        listQuery: MaybeG(Object)
      });

      Resource.public({
        recordId: MaybeG(String)
      });

      Resource.public({
        recordBody: MaybeG(Object)
      });

      Resource.public({
        actionResult: MaybeG(AnyT)
      });

      Resource.public(Resource.static({
        actions: DictG(String, Object)
      }, {
        get: function() {
          return this.metaObject.getGroup('actions', false);
        }
      }));

      Resource.public(Resource.static({
        action: FuncG([UnionG(Object, TupleG(Object, Object))])
      }, {
        default: function(...args) {
          var name;
          // default: (nameDefinition, config)->
          // [actionName] = Object.keys nameDefinition
          // if nameDefinition.attr? and not config?
          //   @metaObject.addMetaData 'actions', nameDefinition.attr, nameDefinition
          // else
          //   @metaObject.addMetaData 'actions', actionName, config
          name = this.public(...args);
          this.metaObject.addMetaData('actions', name, this.instanceMethods[name]);
        }
      }));

      Resource.action(Resource.async({
        list: FuncG([], StructG({
          meta: StructG({
            pagination: StructG({
              limit: UnionG(Number, EnumG(['not defined'])),
              offset: UnionG(Number, EnumG(['not defined']))
            })
          }),
          items: ListG(Object)
        }))
      }, {
        default: function*() {
          var vlItems;
          vlItems = (yield ((yield this.collection.takeAll())).toArray());
          return {
            meta: {
              pagination: {
                limit: 'not defined',
                offset: 'not defined'
              }
            },
            items: vlItems
          };
        }
      }));

      Resource.action(Resource.async({
        detail: FuncG([], Object)
      }, {
        default: function*() {
          return (yield this.collection.find(this.recordId));
        }
      }));

      Resource.action(Resource.async({
        create: FuncG([], Object)
      }, {
        default: function*() {
          return (yield this.collection.create(this.recordBody));
        }
      }));

      Resource.action(Resource.async({
        update: FuncG([], Object)
      }, {
        default: function*() {
          return (yield this.collection.update(this.recordId, this.recordBody));
        }
      }));

      Resource.action(Resource.async({
        delete: Function
      }, {
        default: function*() {
          yield this.collection.delete(this.recordId);
          this.context.status = 204;
        }
      }));

      Resource.action(Resource.async({
        destroy: Function
      }, {
        default: function*() {
          yield this.collection.destroy(this.recordId);
          this.context.status = 204;
        }
      }));

      // ------------ Chains definitions ---------
      Resource.chains(['list', 'detail', 'create', 'update', 'delete', 'destroy']);

      Resource.initialHook('beforeActionHook');

      Resource.beforeHook('getQuery', {
        only: ['list']
      });

      Resource.beforeHook('getRecordId', {
        only: ['detail', 'update', 'delete', 'destroy']
      });

      Resource.beforeHook('checkExistence', {
        only: ['detail', 'update', 'delete', 'destroy']
      });

      Resource.beforeHook('getRecordBody', {
        only: ['create', 'update']
      });

      Resource.beforeHook('omitBody', {
        only: ['create', 'update']
      });

      Resource.beforeHook('beforeUpdate', {
        only: ['update']
      });

      Resource.public({
        beforeActionHook: Function
      }, {
        default: function(...args) {
          [this.context] = args;
          return args;
        }
      });

      Resource.public({
        getQuery: Function
      }, {
        default: function(...args) {
          var ref;
          this.listQuery = JSON.parse((ref = this.context.query['query']) != null ? ref : "{}");
          return args;
        }
      });

      Resource.public({
        getRecordId: Function
      }, {
        default: function(...args) {
          this.recordId = this.context.pathParams[this.keyName];
          return args;
        }
      });

      Resource.public({
        getRecordBody: Function
      }, {
        default: function(...args) {
          var ref;
          this.recordBody = (ref = this.context.request.body) != null ? ref[this.itemEntityName] : void 0;
          return args;
        }
      });

      Resource.public({
        omitBody: Function
      }, {
        default: function(...args) {
          var moduleName, name;
          this.recordBody = _.omit(this.recordBody, ['_id', '_rev', 'rev', 'type', '_type', '_owner', '_space', '_from', '_to']);
          moduleName = this.collection.delegate.moduleName();
          name = this.collection.delegate.name;
          this.recordBody.type = `${moduleName}::${name}`;
          return args;
        }
      });

      Resource.public({
        beforeUpdate: Function
      }, {
        default: function(...args) {
          this.recordBody = assign({}, this.recordBody, {
            id: this.recordId
          });
          return args;
        }
      });

      Resource.public(Resource.async({
        doAction: FuncG([String, ContextInterface], MaybeG(AnyT))
      }, {
        default: function*(action, context) {
          var voResult;
          voResult = (yield (typeof this[action] === "function" ? this[action](context) : void 0));
          this.actionResult = voResult;
          yield this.saveDelayeds();
          return voResult;
        }
      }));

      Resource.public(Resource.async({
        writeTransaction: FuncG([String, ContextInterface], Boolean)
      }, {
        default: function*(asAction, aoContext) {
          return aoContext.method.toUpperCase() !== 'GET';
        }
      }));

      Resource.public(Resource.async({
        saveDelayeds: Function
      }, {
        default: function*() {
          var data, delay, delayed, i, len, queue, queueName, ref, resque, scriptName;
          resque = this.facade.retrieveProxy(RESQUE);
          ref = (yield resque.getDelayed());
          for (i = 0, len = ref.length; i < len; i++) {
            delayed = ref[i];
            ({queueName, scriptName, data, delay} = delayed);
            queue = (yield resque.get(queueName != null ? queueName : DELAYED_JOBS_QUEUE));
            yield queue.push(scriptName, data, delay);
          }
        }
      }));

      Resource.public(Resource.async({
        execute: FuncG(NotificationInterface)
      }, {
        default: function*(aoNotification) {
          var DEBUG, ERROR, LEVELS, SEND_TO_LOG, action, app, err, resourceName, service, t1, t2, voBody, voResult;
          ({ERROR, DEBUG, LEVELS, SEND_TO_LOG} = Module.prototype.LogMessage);
          resourceName = aoNotification.getName();
          voBody = aoNotification.getBody();
          action = aoNotification.getType();
          service = this.facade.retrieveMediator(APPLICATION_MEDIATOR).getViewComponent();
          try {
            if (isArangoDB()) {
              service.context = voBody.context;
            }
            if (service.context != null) {
              this.sendNotification(SEND_TO_LOG, '>>>>>>>>>>>>>> EXECUTION START', LEVELS[DEBUG]);
              voResult = {
                result: (yield this.doAction(action, voBody.context)),
                resource: this
              };
              this.sendNotification(SEND_TO_LOG, '>>>>>>>>>>>>>> EXECUTION END', LEVELS[DEBUG]);
            } else {
              this.sendNotification(SEND_TO_LOG, '>>>>>>>>>> LIGHTWEIGHT CREATE', LEVELS[DEBUG]);
              t1 = Date.now();
              app = this.Module.prototype.MainApplication.new(Module.prototype.LIGHTWEIGHT);
              app.start();
              this.sendNotification(SEND_TO_LOG, `>>>>>>>>>> LIGHTWEIGHT START after ${Date.now() - t1}`, LEVELS[DEBUG]);
              voResult = (yield app.execute(resourceName, voBody, action));
              this.sendNotification(SEND_TO_LOG, '>>>>>>>>>> LIGHTWEIGHT END', LEVELS[DEBUG]);
              t2 = Date.now();
              app.finish();
              this.sendNotification(SEND_TO_LOG, `>>>>>>>>>> LIGHTWEIGHT DESTROYED after ${Date.now() - t2}`, LEVELS[DEBUG]);
            }
          } catch (error) {
            err = error;
            voResult = {
              error: err,
              resource: this
            };
          }
          this.sendNotification(HANDLER_RESULT, voResult, voBody.reverse);
        }
      }));

      Resource.initialize();

      return Resource;

    }).call(this);
  };

}).call(this);
