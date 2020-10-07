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
    var EndpointInterface, EndpointInterfaceDef, FuncG, GatewayInterface, Interface, JoiT, MaybeG, NilT, UnionG;
    ({
      JoiT,
      NilT,
      FuncG,
      MaybeG,
      UnionG,
      GatewayInterface,
      EndpointInterface: EndpointInterfaceDef,
      Interface
    } = Module.prototype);
    return EndpointInterface = (function() {
      class EndpointInterface extends Interface {};

      EndpointInterface.inheritProtected();

      EndpointInterface.module(Module);

      EndpointInterface.virtual({
        gateway: GatewayInterface
      });

      EndpointInterface.virtual({
        tags: MaybeG(Array)
      });

      EndpointInterface.virtual({
        headers: MaybeG(Array)
      });

      EndpointInterface.virtual({
        pathParams: MaybeG(Array)
      });

      EndpointInterface.virtual({
        queryParams: MaybeG(Array)
      });

      EndpointInterface.virtual({
        payload: MaybeG(Object)
      });

      EndpointInterface.virtual({
        responses: MaybeG(Array)
      });

      EndpointInterface.virtual({
        errors: MaybeG(Array)
      });

      EndpointInterface.virtual({
        title: MaybeG(String)
      });

      EndpointInterface.virtual({
        synopsis: MaybeG(String)
      });

      EndpointInterface.virtual({
        isDeprecated: Boolean
      });

      EndpointInterface.virtual({
        tag: FuncG(String, EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        header: FuncG([String, JoiT, MaybeG(String)], EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        pathParam: FuncG([String, JoiT, MaybeG(String)], EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        queryParam: FuncG([String, JoiT, MaybeG(String)], EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        body: FuncG([JoiT, MaybeG(UnionG(Array, String)), MaybeG(String)], EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        response: FuncG([UnionG(Number, String, JoiT, NilT), MaybeG(UnionG(JoiT, String, Array)), MaybeG(UnionG(Array, String)), MaybeG(String)], EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        error: FuncG([UnionG(Number, String), MaybeG(String)], EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        summary: FuncG(String, EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        description: FuncG(String, EndpointInterfaceDef)
      });

      EndpointInterface.virtual({
        deprecated: FuncG(Boolean, EndpointInterfaceDef)
      });

      EndpointInterface.initialize();

      return EndpointInterface;

    }).call(this);
  };

}).call(this);
