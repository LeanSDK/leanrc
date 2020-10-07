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
    var CrudEndpointMixin, Endpoint, FuncG, GatewayInterface, InterfaceG, ModelingQueryEndpoint, UNAUTHORIZED, UPGRADE_REQUIRED, joi, statuses;
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
    return ModelingQueryEndpoint = (function() {
      class ModelingQueryEndpoint extends Endpoint {};

      ModelingQueryEndpoint.inheritProtected();

      ModelingQueryEndpoint.include(CrudEndpointMixin);

      ModelingQueryEndpoint.module(Module);

      ModelingQueryEndpoint.public({
        init: FuncG(InterfaceG({
          gateway: GatewayInterface
        }))
      }, {
        default: function(...args) {
          this.super(...args);
          this.pathParam('v', this.versionSchema);
          this.header('Authorization', joi.string().required(), "Authorization header is required.");
          this.body(this.executeQuerySchema, "The query for execute.");
          this.response(joi.array().items(joi.any()), "Any result.");
          this.error(UNAUTHORIZED);
          this.error(UPGRADE_REQUIRED);
          this.summary("Execute some query");
          this.description("This endpoint will been used from HttpCollectionMixin");
        }
      });

      ModelingQueryEndpoint.initialize();

      return ModelingQueryEndpoint;

    }).call(this);
  };

}).call(this);
