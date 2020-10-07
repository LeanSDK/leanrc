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
    var BulkDeleteEndpoint, CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, InterfaceG, UNAUTHORIZED, UPGRADE_REQUIRED, statuses;
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
    return BulkDeleteEndpoint = (function() {
      class BulkDeleteEndpoint extends Endpoint {};

      BulkDeleteEndpoint.inheritProtected();

      BulkDeleteEndpoint.include(CrudEndpointMixin);

      BulkDeleteEndpoint.module(Module);

      BulkDeleteEndpoint.public({
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
          this.summary(`Hide of filtered ${this.listEntityName}`);
          this.description(`Hide a list of filtered ${this.listEntityName} by using query.`);
        }
      });

      BulkDeleteEndpoint.initialize();

      return BulkDeleteEndpoint;

    }).call(this);
  };

}).call(this);
