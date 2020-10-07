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
  /*
  ```coffee
  Module = require 'Module'

  module.exports = (App)->
    App::ModelingGateway extends Module::Gateway
      @inheritProtected()
      @include Module::ModelingGatewayMixin

      @module App

    return App::ModelingGateway.initialize()
  ```

  */
  module.exports = function(Module) {
    var EndpointInterface, FORBIDDEN, FuncG, Gateway, HTTP_CONFLICT, HTTP_NOT_FOUND, Mixin, SubsetG, UNAUTHORIZED, UPGRADE_REQUIRED, _, inflect, joi, statuses;
    ({
      FuncG,
      SubsetG,
      EndpointInterface,
      Gateway,
      Mixin,
      Utils: {_, inflect, joi, statuses}
    } = Module.prototype);
    HTTP_NOT_FOUND = statuses('not found');
    HTTP_CONFLICT = statuses('conflict');
    UNAUTHORIZED = statuses('unauthorized');
    FORBIDDEN = statuses('forbidden');
    UPGRADE_REQUIRED = statuses('upgrade required');
    return Module.defineMixin(Mixin('ModelingGatewayMixin', function(BaseClass = Gateway) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          getStandardActionEndpoint: FuncG([String, String], SubsetG(EndpointInterface))
        }, {
          default: function(asResourse, asAction) {
            var ref, vsEndpointName;
            vsEndpointName = _.startsWith(asResourse.toLowerCase(), 'modeling') ? `Modeling${inflect.camelize(asAction)}Endpoint` : `${inflect.camelize(asAction)}Endpoint`;
            return (ref = this.ApplicationModule.prototype[vsEndpointName]) != null ? ref : this.ApplicationModule.prototype.Endpoint;
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
