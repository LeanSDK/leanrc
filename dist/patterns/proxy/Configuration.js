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

  // надо унаследовать от Proxy
  // этот класс должен будет использоваться для того, чтобы объявлять в дочерних классах конфигурационные данные.

  // в файле манифеста будут поумолчанию (всегда) объявляться дефолтные конфиги
  // папка configs будет указана в gitignore но в ней можно создавать файлы с конфигами, значения которых должны переопределять дефолтные значения.
  // там же в configs фолдере будут примеры файлов - шаблоны с расширением .example

  // для Arango платформы в конкретном приложении Configuration класс должен быть расширен миксином, который за данными должен обращаться (вместо дефолтного обращения к жесткому диску) к module.context.configuration
  var hasProp = {}.hasOwnProperty;

  /*
  ```coffee
  module.exports = (Module)->
    {
      Configuration
      ArangoConfigurationMixin
    } = Module::

    class AppConfiguration extends Configuration
      @inheritProtected()
      @module Module
      @include ArangoConfigurationMixin

    return AppConfiguration.initialize()
  ```
  */
  /*
  ```coffee
  module.exports = (Module)->
    {
      CONFIGURATION

      SimpleCommand
      AppConfiguration
    } = Module::

    class PrepareModelCommand extends SimpleCommand
      @inheritProtected()

      @module Module

      @public execute: Function,
        default: ->
          #...
          @facade.registerProxy AppConfiguration.new CONFIGURATION, @Module::ROOT

    PrepareModelCommand.initialize()
  ```
   */
  /*
  В папке configs/
  должны быть файлы:
  development.coffee.example
  production.coffee.example
  test.coffee.example

  Они же должны быть разрешены в гитигноре и быть под репозиторием, все остальные файлы должны быть в гитигноре (не под репозиторием)

  Формат данных в конфиг файлах (пример)
  ```coffee
  module.exports =
    cookieSecret:
      description: "Cookie secret for sessions middleware."
      type: "string"
      default: "secret"
      required: yes

    secret:
      description: "Secret key for encoding and decoding tokens."
      type: "string"
      default: "secret"
      required: yes

    apiKey:
      description: "Secret key allowing interactions between servers"
      type: "string"
      default: "c%td_tx=22Wh4k=^Gpe3ZrN+f3Ur2h%K8#qHa!zqU78Jtx7Cy95!%XAg4TngZ"

    resetTokenTTL:
      description: "Reset token time-to-live (in seconds)"
      type: "number"
      default: 86400

    adminEmail:
      description: "Admin email."
      type: "string"
      default: null
      required: yes

    #...
  ```
   */
  module.exports = function(Module) {
    var Configuration, ConfigurationInterface, DEVELOPMENT, PRODUCTION, _, assign, isArangoDB;
    ({
      PRODUCTION,
      DEVELOPMENT,
      ConfigurationInterface,
      Utils: {_, assign, isArangoDB}
    } = Module.prototype);
    return Configuration = (function() {
      class Configuration extends Module.prototype.Proxy {};

      Configuration.inheritProtected();

      Configuration.implements(ConfigurationInterface);

      Configuration.module(Module);

      Configuration.public({
        ROOT: String
      }, {
        get: function() {
          return this.getData();
        }
      });

      Configuration.public({
        environment: String
      }, {
        get: function() {
          var ref;
          if (isArangoDB()) {
            if (module.context.isProduction) {
              return PRODUCTION;
            } else {
              return DEVELOPMENT;
            }
          } else {
            if ((typeof process !== "undefined" && process !== null ? (ref = process.env) != null ? ref.NODE_ENV : void 0 : void 0) === 'production') {
              return PRODUCTION;
            } else {
              return DEVELOPMENT;
            }
          }
        }
      });

      Configuration.public({
        defineConfigProperties: Function
      }, {
        default: function() {
          var configFromFile, configFromManifest, configs, filePath, key, manifest, manifestPath, value;
          manifestPath = `${this.ROOT}/../manifest.json`;
          manifest = require(manifestPath);
          Reflect.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: false,
            value: manifest.name
          });
          Reflect.defineProperty(this, 'description', {
            enumerable: true,
            configurable: true,
            writable: false,
            value: manifest.description
          });
          Reflect.defineProperty(this, 'license', {
            enumerable: true,
            configurable: true,
            writable: false,
            value: manifest.license
          });
          Reflect.defineProperty(this, 'version', {
            enumerable: true,
            configurable: true,
            writable: false,
            value: manifest.version
          });
          Reflect.defineProperty(this, 'keywords', {
            enumerable: true,
            configurable: true,
            writable: false,
            value: manifest.keywords
          });
          configFromManifest = manifest.configuration;
          filePath = `${this.ROOT}/../configs/${this.environment}`;
          configFromFile = require(filePath);
          configs = assign({}, configFromManifest, configFromFile);
          for (key in configs) {
            if (!hasProp.call(configs, key)) continue;
            value = configs[key];
            ((attr, config) => {
              var err;
              if (config.description == null) {
                throw new Error("Description in config definition is required");
                return;
              }
              if (config.required && (config.default == null)) {
                throw new Error(`Attribute '${attr}' is required in config`);
                return;
              }
              // проверка типа
              if (config.type == null) {
                throw new Error("Type in config definition is required");
                return;
              }
              switch (config.type) {
                case 'string':
                  if (!_.isString(config.default)) {
                    throw new Error(`Default for '${attr}' must be string`);
                    return;
                  }
                  break;
                case 'number':
                  if (!_.isNumber(config.default)) {
                    throw new Error(`Default for '${attr}' must be number`);
                    return;
                  }
                  break;
                case 'boolean':
                  if (!_.isBoolean(config.default)) {
                    throw new Error(`Default for '${attr}' must be boolean`);
                    return;
                  }
                  break;
                case 'integer':
                  if (!_.isInteger(config.default)) {
                    throw new Error(`Default for '${attr}' must be integer`);
                    return;
                  }
                  break;
                case 'json':
                  if (!_.isString(config.default)) {
                    throw new Error(`Default for '${attr}' must be JSON string`);
                    return;
                  }
                  try {
                    JSON.parse(config.default);
                  } catch (error) {
                    err = error;
                    throw new Error(`Default for '${attr}' is not valid JSON`);
                  }
                  break;
                case 'password': //like string but will be displayed as a masked input field in the web frontend
                  if (!_.isString(config.default)) {
                    throw new Error(`Default for '${attr}' must be string`);
                    return;
                  }
              }
              value = config.type === 'json' ? JSON.parse(config.default) : config.default;
              Reflect.defineProperty(this, attr, {
                enumerable: true,
                configurable: true,
                writable: false,
                value
              });
            })(key, value);
          }
        }
      });

      Configuration.public({
        onRegister: Function
      }, {
        default: function(...args) {
          this.super(...args);
          this.defineConfigProperties();
        }
      });

      Configuration.initialize();

      return Configuration;

    }).call(this);
  };

}).call(this);
