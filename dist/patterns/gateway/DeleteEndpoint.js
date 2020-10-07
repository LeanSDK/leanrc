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
    var CrudEndpointMixin, DeleteEndpoint, Endpoint, FuncG, GatewayInterface, HTTP_NOT_FOUND, InterfaceG, UNAUTHORIZED, UPGRADE_REQUIRED, statuses;
    ({
      FuncG,
      InterfaceG,
      GatewayInterface,
      CrudEndpointMixin,
      Endpoint,
      Utils: {statuses}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    UNAUTHORIZED = statuses('unauthorized');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return DeleteEndpoint = (function() {
      class DeleteEndpoint extends Endpoint {};

      DeleteEndpoint.inheritProtected();

      DeleteEndpoint.include(CrudEndpointMixin);

      DeleteEndpoint.module(Module);

      DeleteEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.error(HTTP_NOT_FOUND);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.response(null);
          this.summary(`Hide the ${this.itemEntityName}`);
          this.description(`Hide the ${this.itemEntityName} from the database.`);
        }
      });

      DeleteEndpoint.initialize();

      return DeleteEndpoint;

    }).call(this);
  };

}).call(this);
