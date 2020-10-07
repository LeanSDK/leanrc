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
    var CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, InterfaceG, LengthEndpoint, UNAUTHORIZED, UPGRADE_REQUIRED, joi, statuses;
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
    return LengthEndpoint = (function() {
      class LengthEndpoint extends Endpoint {};

      LengthEndpoint.inheritProtected();

      LengthEndpoint.include(CrudEndpointMixin);

      LengthEndpoint.module(Module);

      LengthEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.response(joi.number(), `The length of ${this.listEntityName} collection.`);
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.summary(`Length of ${this.listEntityName} collection`);
          this.description(`Retrieves a length of ${this.listEntityName} collection.`);
        }
      });

      LengthEndpoint.initialize();

      return LengthEndpoint;

    }).call(this);
  };

}).call(this);
