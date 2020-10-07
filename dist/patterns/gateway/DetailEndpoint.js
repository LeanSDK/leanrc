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
    var CrudEndpointMixin, DetailEndpoint, Endpoint, FuncG, GatewayInterface, HTTP_NOT_FOUND, InterfaceG, UNAUTHORIZED, UPGRADE_REQUIRED, statuses;
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
    return DetailEndpoint = (function() {
      class DetailEndpoint extends Endpoint {};

      DetailEndpoint.inheritProtected();

      DetailEndpoint.include(CrudEndpointMixin);

      DetailEndpoint.module(Module);

      DetailEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.response(this.itemSchema, `The ${this.itemEntityName}.`);
          this.error(HTTP_NOT_FOUND);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.summary(`Fetch the ${this.itemEntityName}`);
          this.description(`Retrieves the ${this.itemEntityName} by its key.`);
        }
      });

      DetailEndpoint.initialize();

      return DetailEndpoint;

    }).call(this);
  };

}).call(this);
