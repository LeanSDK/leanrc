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
  for example

  ```coffee
  module.exports = (Module)->
    {
      Resource
      BodyParseMixin
    } = Module::

    class CucumbersResource extends Resource
      @inheritProtected()
      @include BodyParseMixin
      @module Module

      @initialHook 'parseBody', only: ['create', 'update']

      @public entityName: String,
        default: 'cucumber'

    CucumbersResource.initialize()
  ```
  */
  module.exports = function(Module) {
    var Mixin, Resource, isArangoDB;
    ({
      Resource,
      Mixin,
      Utils: {isArangoDB}
    } = Module.prototype);
    return Module.defineMixin(Mixin('BodyParseMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public(_Class.async({
          parseBody: Function
        }, {
          default: function*(...args) {
            var parse;
            if (isArangoDB()) {
              this.context.request.body = this.context.req.body;
            } else {
              parse = require('co-body');
              this.context.request.body = (yield parse(this.context.req));
            }
            return args;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
