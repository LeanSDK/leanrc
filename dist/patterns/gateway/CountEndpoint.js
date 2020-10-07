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
    var CountEndpoint, CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, InterfaceG, UNAUTHORIZED, UPGRADE_REQUIRED, joi, statuses;
    ({
      FuncG,
      InterfaceG,
      GatewayInterface,
      CrudEndpointMixin,
      Endpoint,
      Utils: {statuses, joi}
    } = Module.prototype);
    UNAUTHORIZED = statuses('unauthorized');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return CountEndpoint = (function() {
      class CountEndpoint extends Endpoint {};

      CountEndpoint.inheritProtected();

      CountEndpoint.include(CrudEndpointMixin);

      CountEndpoint.module(Module);

      CountEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.queryParam('query', this.querySchema, `The query for counting ${this.listEntityName}.`);
          this.response(joi.number(), `The count of ${this.listEntityName}.`);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.summary(`Count of filtered ${this.listEntityName}`);
          this.description(`Retrieves a count of filtered ${this.listEntityName} by using query.`);
        }
      });

      CountEndpoint.initialize();

      return CountEndpoint;

    }).call(this);
  };

}).call(this);
