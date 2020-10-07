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
    App::CrudGateway extends Module::Gateway
      @inheritProtected()
      @include Module::NamespacedGatewayMixin

      @module App

    return App::CrudGateway.initialize()
  ```

  */
  module.exports = function(Module) {
    var EndpointInterface, FORBIDDEN, FuncG, Gateway, HTTP_CONFLICT, HTTP_NOT_FOUND, ListG, MaybeG, Mixin, PointerT, SubsetG, UNAUTHORIZED, UPGRADE_REQUIRED, _, inflect, joi, statuses;
    ({
      PointerT,
      FuncG,
      ListG,
      SubsetG,
      MaybeG,
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
    return Module.defineMixin(Mixin('NamespacedGatewayMixin', function(BaseClass = Gateway) {
      return (function() {
        var _Class, ipoJoinedNamespacesMask;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        ipoJoinedNamespacesMask = PointerT(_Class.private({
          joinedNamespacesMask: MaybeG(RegExp)
        }));

        _Class.public({
          namespaces: FuncG([], ListG(String))
        }, {
          default: function() {
            return ['admining', 'globaling', 'guesting', 'modeling', 'personing', 'sharing'];
          }
        });

        _Class.public({
          joinedNamespacesMask: RegExp
        }, {
          get: function() {
            var ref;
            return (ref = this[ipoJoinedNamespacesMask]) != null ? ref : new RegExp(`^(${this.namespaces().join('|')})_`);
          }
        });

        _Class.public({
          getTrimmedEndpointName: FuncG([String, String], String)
        }, {
          default: function(asResourse, asAction) {
            var vsPath;
            vsPath = `${inflect.underscore(asResourse)}_${asAction}_endpoint`.replace(/\//g, '_').replace(/\_+/g, '_').replace(this.joinedNamespacesMask, '');
            return inflect.camelize(vsPath);
          }
        });

        _Class.public({
          getEndpoint: FuncG([String, String], SubsetG(EndpointInterface))
        }, {
          default: function(asResourse, asAction) {
            var ref, ref1;
            return (ref = (ref1 = this.getEndpointByName(this.getEndpointName(asResourse, asAction))) != null ? ref1 : this.getEndpointByName(this.getTrimmedEndpointName(asResourse, asAction))) != null ? ref : this.getStandardActionEndpoint(asResourse, asAction);
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
