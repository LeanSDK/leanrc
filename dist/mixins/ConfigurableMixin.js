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

  // миксин может подмешиваться в наследники классов Proxy, Command, Mediator
  module.exports = function(Module) {
    var CONFIGURATION, CoreObject, Mixin;
    ({CONFIGURATION, CoreObject, Mixin} = Module.prototype);
    return Module.defineMixin(Mixin('ConfigurableMixin', function(BaseClass = CoreObject) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          configs: Object
        }, {
          get: function() {
            return this.facade.retrieveProxy(CONFIGURATION);
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
