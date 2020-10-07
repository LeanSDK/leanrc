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
    var CreateEndpoint, CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, HTTP_CONFLICT, InterfaceG, UNAUTHORIZED, UPGRADE_REQUIRED, statuses;
    ({
      FuncG,
      InterfaceG,
      GatewayInterface,
      CrudEndpointMixin,
      Endpoint,
      Utils: {statuses}
    } = Module.prototype);
    HTTP_CONFLICT = statuses('conflict');
    UNAUTHORIZED = statuses('unauthorized');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return CreateEndpoint = (function() {
      class CreateEndpoint extends Endpoint {};

      CreateEndpoint.inheritProtected();

      CreateEndpoint.include(CrudEndpointMixin);

      CreateEndpoint.module(Module);

      CreateEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.body(this.itemSchema.required(), `The ${this.itemEntityName} to create.`);
          this.response(201, this.itemSchema, `The created ${this.itemEntityName}.`);
          this.error(HTTP_CONFLICT, `The ${this.itemEntityName} already exists.`);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.summary(`Create a new ${this.itemEntityName}`);
          this.description(`Creates a new ${this.itemEntityName} from the request body and returns the saved document.`);
        }
      });

      CreateEndpoint.initialize();

      return CreateEndpoint;

    }).call(this);
  };

}).call(this);
