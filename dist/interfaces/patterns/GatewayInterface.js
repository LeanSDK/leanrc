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
    var EndpointInterface, FuncG, GatewayInterface, JoiT, MaybeG, ProxyInterface, SubsetG;
    ({JoiT, FuncG, MaybeG, SubsetG, EndpointInterface, ProxyInterface} = Module.prototype);
    return GatewayInterface = (function() {
      class GatewayInterface extends ProxyInterface {};

      GatewayInterface.inheritProtected();

      GatewayInterface.module(Module);

      GatewayInterface.virtual({
        tryLoadEndpoint: FuncG(String, MaybeG(SubsetG(EndpointInterface)))
      });

      GatewayInterface.virtual({
        getEndpointByName: FuncG(String, MaybeG(SubsetG(EndpointInterface)))
      });

      GatewayInterface.virtual({
        getEndpointName: FuncG([String, String], String)
      });

      GatewayInterface.virtual({
        getStandardActionEndpoint: FuncG([String, String], SubsetG(EndpointInterface))
      });

      GatewayInterface.virtual({
        getEndpoint: FuncG([String, String], SubsetG(EndpointInterface))
      });

      GatewayInterface.virtual({
        swaggerDefinitionFor: FuncG([String, String, MaybeG(Object)], EndpointInterface)
      });

      GatewayInterface.virtual({
        getSchema: FuncG(String, JoiT)
      });

      GatewayInterface.initialize();

      return GatewayInterface;

    }).call(this);
  };

}).call(this);
