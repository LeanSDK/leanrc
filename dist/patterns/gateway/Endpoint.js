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
  module.exports = function(Module) {
    var CoreObject, DictG, Endpoint, EndpointInterface, FuncG, GatewayInterface, InterfaceG, JoiT, MaybeG, NilT, UnionG;
    ({JoiT, NilT, FuncG, InterfaceG, DictG, MaybeG, UnionG, EndpointInterface, GatewayInterface, CoreObject} = Module.prototype);
    return Endpoint = (function() {
      class Endpoint extends CoreObject {};

      Endpoint.inheritProtected();

      Endpoint.implements(EndpointInterface);

      Endpoint.module(Module);

      Endpoint.public(Endpoint.static({
        keyNames: DictG(String, MaybeG(String))
      }, {
        default: {}
      }));

      Endpoint.public(Endpoint.static({
        itemEntityNames: DictG(String, MaybeG(String))
      }, {
        default: {}
      }));

      Endpoint.public(Endpoint.static({
        listEntityNames: DictG(String, MaybeG(String))
      }, {
        default: {}
      }));

      Endpoint.public(Endpoint.static({
        itemSchemas: DictG(String, MaybeG(JoiT))
      }, {
        default: {}
      }));

      Endpoint.public(Endpoint.static({
        listSchemas: DictG(String, MaybeG(JoiT))
      }, {
        default: {}
      }));

      Endpoint.public({
        gateway: GatewayInterface
      });

      Endpoint.public({
        tags: MaybeG(Array)
      });

      Endpoint.public({
        headers: MaybeG(Array)
      });

      Endpoint.public({
        pathParams: MaybeG(Array)
      });

      Endpoint.public({
        queryParams: MaybeG(Array)
      });

      Endpoint.public({
        payload: MaybeG(Object)
      });

      Endpoint.public({
        responses: MaybeG(Array)
      });

      Endpoint.public({
        errors: MaybeG(Array)
      });

      Endpoint.public({
        title: MaybeG(String)
      });

      Endpoint.public({
        synopsis: MaybeG(String)
      });

      Endpoint.public({
        isDeprecated: Boolean
      }, {
        default: false
      });

      Endpoint.public({
        tag: FuncG(String, EndpointInterface)
      }, {
        default: function(asName) {
          if (this.tags == null) {
            this.tags = [];
          }
          this.tags.push(asName);
          return this;
        }
      });

      Endpoint.public({
        header: FuncG([String, JoiT, MaybeG(String)], EndpointInterface)
      }, {
        default: function(name, schema, description) {
          if (this.headers == null) {
            this.headers = [];
          }
          this.headers.push({name, schema, description});
          return this;
        }
      });

      Endpoint.public({
        pathParam: FuncG([String, JoiT, MaybeG(String)], EndpointInterface)
      }, {
        default: function(name, schema, description) {
          if (this.pathParams == null) {
            this.pathParams = [];
          }
          this.pathParams.push({name, schema, description});
          return this;
        }
      });

      Endpoint.public({
        queryParam: FuncG([String, JoiT, MaybeG(String)], EndpointInterface)
      }, {
        default: function(name, schema, description) {
          if (this.queryParams == null) {
            this.queryParams = [];
          }
          this.queryParams.push({name, schema, description});
          return this;
        }
      });

      Endpoint.public({
        body: FuncG([JoiT, MaybeG(UnionG(Array, String)), MaybeG(String)], EndpointInterface)
      }, {
        default: function(schema, mimes, description) {
          this.payload = {schema, mimes, description};
          return this;
        }
      });

      Endpoint.public({
        response: FuncG([UnionG(Number, String, JoiT, NilT), MaybeG(UnionG(JoiT, String, Array)), MaybeG(UnionG(Array, String)), MaybeG(String)], EndpointInterface)
      }, {
        default: function(status, schema, mimes, description) {
          if (this.responses == null) {
            this.responses = [];
          }
          this.responses.push({status, schema, mimes, description});
          return this;
        }
      });

      Endpoint.public({
        error: FuncG([UnionG(Number, String), MaybeG(String)], EndpointInterface)
      }, {
        default: function(status, description) {
          if (this.errors == null) {
            this.errors = [];
          }
          this.errors.push({status, description});
          return this;
        }
      });

      Endpoint.public({
        summary: FuncG(String, EndpointInterface)
      }, {
        default: function(asSummary) {
          this.title = asSummary;
          return this;
        }
      });

      Endpoint.public({
        description: FuncG(String, EndpointInterface)
      }, {
        default: function(asDescription) {
          this.synopsis = asDescription;
          return this;
        }
      });

      Endpoint.public({
        deprecated: FuncG(Boolean, EndpointInterface)
      }, {
        default: function(abDeprecated) {
          this.isDeprecated = abDeprecated;
          return this;
        }
      });

      Endpoint.public(Endpoint.static(Endpoint.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Endpoint.public(Endpoint.static(Endpoint.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Endpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          var options;
          this.super(...args);
          [options] = args;
          ({gateway: this.gateway} = options);
        }
      });

      Endpoint.initialize();

      return Endpoint;

    }).call(this);
  };

}).call(this);
