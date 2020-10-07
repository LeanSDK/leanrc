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
    var CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, HTTP_CONFLICT, HTTP_NOT_FOUND, InterfaceG, UNAUTHORIZED, UPGRADE_REQUIRED, UpdateEndpoint, statuses;
    ({
      FuncG,
      InterfaceG,
      GatewayInterface,
      CrudEndpointMixin,
      Endpoint,
      Utils: {statuses}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    HTTP_CONFLICT = statuses('conflict');
    UNAUTHORIZED = statuses('unauthorized');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return UpdateEndpoint = (function() {
      class UpdateEndpoint extends Endpoint {};

      UpdateEndpoint.inheritProtected();

      UpdateEndpoint.include(CrudEndpointMixin);

      UpdateEndpoint.module(Module);

      UpdateEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.body(this.itemSchema.required(), `The data to replace the ${this.itemEntityName} with.`);
          this.response(this.itemSchema, `The replaced ${this.itemEntityName}.`);
          this.error(HTTP_NOT_FOUND);
          this.error(HTTP_CONFLICT);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.summary(`Replace the ${this.itemEntityName}`);
          this.description(`Replaces an existing ${this.itemEntityName} with the request body and returns the new document.`);
        }
      });

      UpdateEndpoint.initialize();

      return UpdateEndpoint;

    }).call(this);
  };

}).call(this);
