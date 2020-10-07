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
    {
      Endpoint
      CrudEndpointMixin
    }
    UploadsDownloadEndpoint extends Endpoint
      @inheritProtected()
      @include CrudEndpointMixin
      @module Module

      @public init: Function,
        default: (args...)->
          @super args...
          @pathParam    'v', @versionSchema
          .pathParam    'space', joi.string().required()
          .pathParam    @keyName, @keySchema
          .pathParam    'attachment', joi.string().required()
          .response     joi.binary(), 'The binary stream of upload file'
          .error        UNAUTHORIZED
          .summary      'Download attached file'
          .description  '
            Find and send as stream attached file.
          '

    UploadsDownloadEndpoint.initialize()
  ```
  */
  module.exports = function(Module) {
    var APPLICATION_MEDIATOR, CrudableInterface, Endpoint, FuncG, GatewayInterface, InterfaceG, JoiT, MaybeG, Mixin, PointerT, SubsetG, _, inflect, joi;
    ({
      APPLICATION_MEDIATOR,
      PointerT,
      JoiT,
      FuncG,
      SubsetG,
      InterfaceG,
      MaybeG,
      GatewayInterface,
      CrudableInterface,
      Endpoint,
      Mixin,
      Utils: {_, joi, inflect}
    } = Module.prototype);
    return Module.defineMixin(Mixin('CrudEndpointMixin', function(BaseClass = Endpoint) {
      return (function() {
        var _Class, ipoSchema, ipsEntityName, ipsKeyName, ipsRecordName;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.implements(CrudableInterface);

        ipsKeyName = PointerT(_Class.private({
          keyName: MaybeG(String)
        }));

        ipsEntityName = PointerT(_Class.private({
          entityName: MaybeG(String)
        }));

        ipsRecordName = PointerT(_Class.private({
          recordName: MaybeG(String)
        }));

        ipoSchema = PointerT(_Class.private({
          schema: MaybeG(Object)
        }));

        // Endpoint.keyNames ?= {}
        // Endpoint.itemEntityNames ?= {}
        // Endpoint.listEntityNames ?= {}
        // Endpoint.itemSchemas ?= {}
        // Endpoint.listSchemas ?= {}
        _Class.public({
          keyName: String
        }, {
          get: function() {
            var base, keyName, ref;
            keyName = (ref = this[ipsKeyName]) != null ? ref : this[ipsEntityName];
            return (base = Endpoint.keyNames)[keyName] != null ? base[keyName] : base[keyName] = inflect.singularize(inflect.underscore(keyName));
          }
        });

        _Class.public({
          itemEntityName: String
        }, {
          get: function() {
            var base, name;
            return (base = Endpoint.itemEntityNames)[name = this[ipsEntityName]] != null ? base[name] : base[name] = inflect.singularize(inflect.underscore(this[ipsEntityName]));
          }
        });

        _Class.public({
          listEntityName: String
        }, {
          get: function() {
            var base, name;
            return (base = Endpoint.listEntityNames)[name = this[ipsEntityName]] != null ? base[name] : base[name] = inflect.pluralize(inflect.underscore(this[ipsEntityName]));
          }
        });

        _Class.public({
          schema: JoiT
        }, {
          get: function() {
            return this[ipoSchema];
          }
        });

        _Class.public({
          listSchema: JoiT
        }, {
          get: function() {
            var base, name;
            return (base = Endpoint.listSchemas)[name = `${this[ipsEntityName]}|${this[ipsRecordName]}`] != null ? base[name] : base[name] = joi.object({
              meta: joi.object(),
              [`${this.listEntityName}`]: joi.array().items(this.schema)
            });
          }
        });

        _Class.public({
          itemSchema: JoiT
        }, {
          get: function() {
            var base, name;
            return (base = Endpoint.itemSchemas)[name = `${this[ipsEntityName]}|${this[ipsRecordName]}`] != null ? base[name] : base[name] = joi.object({
              [`${this.itemEntityName}`]: this.schema
            });
          }
        });

        _Class.public({
          keySchema: JoiT
        }, {
          default: joi.string().required().description('The key of the objects.')
        });

        _Class.public({
          querySchema: JoiT
        }, {
          default: joi.string().empty('{}').optional().default('{}', 'The query for finding objects.')
        });

        _Class.public({
          executeQuerySchema: JoiT
        }, {
          default: joi.object({
            query: joi.object().required()
          }).required()
        }, 'The query for execute.');

        _Class.public({
          bulkResponseSchema: JoiT
        }, {
          default: joi.object({
            success: joi.boolean()
          })
        });

        _Class.public({
          versionSchema: JoiT
        }, {
          default: joi.string().required().description('The version of api endpoint in semver format `^x.x`')
        });

        _Class.public({
          ApplicationModule: SubsetG(Module)
        }, {
          get: function() {
            var ref, ref1;
            return (ref = (ref1 = this.gateway) != null ? ref1.ApplicationModule : void 0) != null ? ref : this.Module;
          }
        });

        _Class.public({
          init: FuncG(InterfaceG({
            gateway: GatewayInterface
          }))
        }, {
          default: function(...args) {
            var entityName, keyName, options, recordName, ref, ref1, voSchema;
            this.super(...args);
            [options] = args;
            ({keyName, entityName, recordName} = options);
            this[ipsKeyName] = keyName;
            this[ipsEntityName] = entityName;
            this[ipsRecordName] = recordName;
            if ((recordName != null) && _.isString(recordName)) {
              recordName = inflect.camelize(recordName);
              if (!/Record$/.test(recordName)) {
                recordName += 'Record';
              }
              voSchema = (ref = this.gateway) != null ? ref.getSchema(recordName) : void 0;
              if (voSchema == null) {
                voSchema = ((ref1 = this.ApplicationModule.NS) != null ? ref1 : this.ApplicationModule.prototype)[recordName].schema;
              }
              this[ipoSchema] = voSchema;
            }
            if (this[ipoSchema] == null) {
              this[ipoSchema] = joi.object();
            }
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
