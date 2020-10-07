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
    class BaseConfiguration extends Module::Configuration
      @inheritProtected()
      @include Module::MemoryConfigurationMixin
      @module Module

    return BaseConfiguration.initialize()
  ```

  ```coffee
  module.exports = (Module)->
    {CONFIGURATION} = Module::

    class PrepareModelCommand extends Module::SimpleCommand
      @inheritProtected()
      @module Module

      @public execute: Function,
        default: ->
          #...
          @facade.registerProxy Module::BaseConfiguration.new CONFIGURATION,
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
          #...

    PrepareModelCommand.initialize()
  ```
   */
  module.exports = function(Module) {
    var Configuration, Mixin, _, inflect;
    ({
      Configuration,
      Mixin,
      Utils: {_, inflect}
    } = Module.prototype);
    return Module.defineMixin(Mixin('MemoryConfigurationMixin', function(BaseClass = Configuration) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          ROOT: String
        }, {
          get: function() {
            return this.Module.prototype.ROOT;
          }
        });

        _Class.public({
          defineConfigProperties: Function
        }, {
          default: function() {
            var configs, key, value;
            configs = this.getData();
            for (key in configs) {
              if (!hasProp.call(configs, key)) continue;
              value = configs[key];
              ((attr, config) => {
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
                    if (!(_.isObject(config.default) || _.isArray(config.default))) {
                      throw new Error(`Default for '${attr}' must be object or array`);
                      return;
                    }
                    break;
                  case 'password': //like string but will be displayed as a masked input field in the web frontend
                    if (!_.isString(config.default)) {
                      throw new Error(`Default for '${attr}' must be string`);
                      return;
                    }
                }
                Reflect.defineProperty(this, attr, {
                  enumerable: true,
                  configurable: true,
                  writable: false,
                  value: config.default
                });
              })(key, value);
            }
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
