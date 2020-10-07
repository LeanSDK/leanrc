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
    var BulkDestroyEndpoint, CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, InterfaceG, UNAUTHORIZED, UPGRADE_REQUIRED, statuses;
    ({
      FuncG,
      InterfaceG,
      GatewayInterface,
      CrudEndpointMixin,
      Endpoint,
      Utils: {statuses}
    } = Module.prototype);
    UNAUTHORIZED = statuses('unauthorized');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return BulkDestroyEndpoint = (function() {
      class BulkDestroyEndpoint extends Endpoint {};

      BulkDestroyEndpoint.inheritProtected();

      BulkDestroyEndpoint.include(CrudEndpointMixin);

      BulkDestroyEndpoint.module(Module);

      BulkDestroyEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.queryParam('query', this.querySchema, `The query for finding ${this.listEntityName}.`);
          this.response(null);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.summary(`Remove of filtered ${this.listEntityName}`);
          this.description(`Remove a list of filtered ${this.listEntityName} by using query.`);
        }
      });

      BulkDestroyEndpoint.initialize();

      return BulkDestroyEndpoint;

    }).call(this);
  };

}).call(this);
