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
  var indexOf = [].indexOf;

  /*
  ```coffee
  Module = require 'Module'

  module.exports = (App)->
    App::CrudGateway extends Module::Gateway
      @inheritProtected()
      @include Module::CrudGatewayMixin

      @module App

    return App::CrudGateway.initialize()
  ```

  ```coffee
  module.exports = (App)->
    App::PrepareModelCommand extends Module::SimpleCommand
      @public execute: Function,
        default: ->
          #...
          @facade.registerProxy App::CrudGateway.new 'DefaultGateway',
            entityName: null # какие-то конфиги и что-то опорное для подключения эндов
          @facade.registerProxy App::CrudGateway.new 'CucumbersGateway',
            entityName: 'cucumber'
            schema: App::CucumberRecord.schema
          @facade.registerProxy App::CrudGateway.new 'TomatosGateway',
            entityName: 'tomato'
            schema: App::TomatoRecord.schema
            endpoints: {
              changeColor: App::TomatosChangeColorEndpoint
            }
          @facade.registerProxy Module::Gateway.new 'AuthGateway',
            entityName: 'user'
            endpoints: {
              signin: App::AuthSigninEndpoint
              signout: App::AuthSignoutEndpoint
              whoami: App::AuthWhoamiEndpoint
            }
          #...
          return
  ```
   */
  module.exports = function(Module) {
    var APPLICATION_MEDIATOR, AnyT, ConfigurableMixin, DictG, EndpointInterface, FuncG, Gateway, GatewayInterface, JoiT, ListG, MaybeG, PointerT, SubsetG, assign, filesListSync, inflect;
    ({
      APPLICATION_MEDIATOR,
      AnyT,
      PointerT,
      JoiT,
      FuncG,
      SubsetG,
      DictG,
      ListG,
      MaybeG,
      GatewayInterface,
      EndpointInterface,
      ConfigurableMixin,
      Utils: {inflect, assign, filesListSync}
    } = Module.prototype);
    return Gateway = (function() {
      var iphSchemas, iplKnownEndpoints, ipsEndpointsPath;

      class Gateway extends Module.prototype.Proxy {};

      Gateway.inheritProtected();

      Gateway.include(ConfigurableMixin);

      Gateway.implements(GatewayInterface);

      Gateway.module(Module);

      // ipsMultitonKey = Symbol.for '~multitonKey' #PointerT @protected multitonKey: String
      iplKnownEndpoints = PointerT(Gateway.protected({
        knownEndpoints: ListG(String)
      }));

      // ipcApplicationModule = PointerT @protected ApplicationModule: MaybeG SubsetG Module
      iphSchemas = PointerT(Gateway.protected({
        schemas: DictG(String, MaybeG(JoiT))
      }));

      ipsEndpointsPath = PointerT(Gateway.protected({
        endpointsPath: String
      }, {
        get: function() {
          return `${this.ApplicationModule.prototype.ROOT}/endpoints`;
        }
      }));

      // @public ApplicationModule: SubsetG(Module),
      //   get: ->
      //     @[ipcApplicationModule] ?= if @[ipsMultitonKey]?
      //       @facade
      //         ?.retrieveMediator APPLICATION_MEDIATOR
      //         ?.getViewComponent()
      //         ?.Module ? @Module
      //     else
      //       @Module
      Gateway.public({
        tryLoadEndpoint: FuncG(String, MaybeG(SubsetG(EndpointInterface)))
      }, {
        default: function(asName) {
          var vsEndpointPath;
          if (indexOf.call(this[iplKnownEndpoints], asName) >= 0) {
            vsEndpointPath = `${this[ipsEndpointsPath]}/${asName}`;
            try {
              return require(vsEndpointPath)(this.ApplicationModule);
            } catch (error) {}
          }
        }
      });

      Gateway.public({
        getEndpointByName: FuncG(String, MaybeG(SubsetG(EndpointInterface)))
      }, {
        default: function(asName) {
          var ref, ref1;
          return (ref = ((ref1 = this.ApplicationModule.NS) != null ? ref1 : this.ApplicationModule.prototype)[asName]) != null ? ref : this.tryLoadEndpoint(asName);
        }
      });

      Gateway.public({
        getEndpointName: FuncG([String, String], String)
      }, {
        default: function(asResourse, asAction) {
          var vsPath;
          vsPath = `${asResourse}_${asAction}_endpoint`.replace(/\//g, '_').replace(/\_+/g, '_');
          return inflect.camelize(vsPath);
        }
      });

      Gateway.public({
        getStandardActionEndpoint: FuncG([String, String], SubsetG(EndpointInterface))
      }, {
        default: function(asResourse, asAction) {
          var ref, ref1, vsEndpointName;
          vsEndpointName = `${inflect.camelize(asAction)}Endpoint`;
          return (ref = ((ref1 = this.ApplicationModule.NS) != null ? ref1 : this.ApplicationModule.prototype)[vsEndpointName]) != null ? ref : this.ApplicationModule.prototype.Endpoint;
        }
      });

      Gateway.public({
        getEndpoint: FuncG([String, String], SubsetG(EndpointInterface))
      }, {
        default: function(asResourse, asAction) {
          var ref, vsEndpointName;
          vsEndpointName = this.getEndpointName(asResourse, asAction);
          return (ref = this.getEndpointByName(vsEndpointName)) != null ? ref : this.getStandardActionEndpoint(asResourse, asAction);
        }
      });

      Gateway.public({
        swaggerDefinitionFor: FuncG([String, String, MaybeG(Object)], EndpointInterface)
      }, {
        default: function(asResourse, asAction, opts) {
          var options, vcEndpoint;
          vcEndpoint = this.getEndpoint(asResourse, asAction);
          options = assign({}, opts, {
            gateway: this
          });
          return vcEndpoint.new(options);
        }
      });

      Gateway.public({
        getSchema: FuncG(String, JoiT)
      }, {
        default: function(asRecordName) {
          var base, ref;
          if ((base = this[iphSchemas])[asRecordName] == null) {
            base[asRecordName] = ((ref = this.ApplicationModule.NS) != null ? ref : this.ApplicationModule.prototype)[asRecordName].schema;
          }
          return this[iphSchemas][asRecordName];
        }
      });

      Gateway.public({
        init: FuncG([String, MaybeG(AnyT)])
      }, {
        default: function(...args) {
          var vPostfixMask, vlKnownEndpoints;
          this.super(...args);
          this[iphSchemas] = {};
          vPostfixMask = /\.(js|coffee)$/;
          vlKnownEndpoints = (function() {
            try {
              return filesListSync(this[ipsEndpointsPath]);
            } catch (error) {}
          }).call(this);
          this[iplKnownEndpoints] = vlKnownEndpoints != null ? vlKnownEndpoints.filter(function(asFileName) {
            return vPostfixMask.test(asFileName);
          }).map(function(asFileName) {
            return asFileName.replace(vPostfixMask, '');
          }) : [];
        }
      });

      Gateway.initialize();

      return Gateway;

    }).call(this);
  };

}).call(this);
