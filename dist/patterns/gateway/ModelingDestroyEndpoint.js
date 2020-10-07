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
    var CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, HTTP_NOT_FOUND, InterfaceG, ModelingDestroyEndpoint, UNAUTHORIZED, UPGRADE_REQUIRED, joi, statuses;
    ({
      FuncG,
      InterfaceG,
      GatewayInterface,
      CrudEndpointMixin,
      Endpoint,
      Utils: {statuses, joi}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    UNAUTHORIZED = statuses('unauthorized');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return ModelingDestroyEndpoint = (function() {
      class ModelingDestroyEndpoint extends Endpoint {};

      ModelingDestroyEndpoint.inheritProtected();

      ModelingDestroyEndpoint.include(CrudEndpointMixin);

      ModelingDestroyEndpoint.module(Module);

      ModelingDestroyEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.header('Authorization', joi.string().required(), "Authorization header for internal services.");
          this.error(HTTP_NOT_FOUND);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.response(null);
          this.summary(`Remove the ${this.itemEntityName}`);
          this.description(`Deletes the ${this.itemEntityName} from the database.`);
        }
      });

      ModelingDestroyEndpoint.initialize();

      return ModelingDestroyEndpoint;

    }).call(this);
  };

}).call(this);
