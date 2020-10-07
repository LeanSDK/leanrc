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
    var AnyT, ContextInterface, FuncG, InterfaceG, MaybeG, Mixin, Renderer, ResourceInterface;
    ({AnyT, FuncG, MaybeG, InterfaceG, ContextInterface, ResourceInterface, Renderer, Mixin} = Module.prototype);
    return Module.defineMixin(Mixin('CountMethodsRendererMixin', function(BaseClass = Renderer) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          count: FuncG([String, String, AnyT], Number)
        }, {
          default: function(resource, action, aoData) {
            return aoData;
          }
        });

        _Class.public({
          length: FuncG([String, String, AnyT], Number)
        }, {
          default: function(resource, action, aoData) {
            return aoData;
          }
        });

        _Class.public(_Class.async({
          render: FuncG([
            ContextInterface,
            AnyT,
            ResourceInterface,
            MaybeG(InterfaceG({
              method: String,
              path: String,
              resource: String,
              action: String,
              tag: String,
              template: String,
              keyName: MaybeG(String),
              entityName: String,
              recordName: MaybeG(String)
            }))
          ], MaybeG(AnyT))
        }, {
          default: function*(...args) {
            var action, aoData, ctx, options, path, ref, resource, resourceName, templatePath, templates;
            [ctx, aoData, resource, options = {}] = args;
            ({
              path,
              resource: resourceName,
              action,
              template: templatePath
            } = options);
            if ((path != null) && (resourceName != null) && (action != null)) {
              ({templates} = this.Module);
              return (yield Module.prototype.Promise.resolve((templates != null ? templates[templatePath] : void 0) != null ? templates != null ? (ref = templates[templatePath]) != null ? ref.call(resource, resourceName, action, aoData) : void 0 : void 0 : action === 'count' || action === 'length' ? this[action].call(resource, resourceName, action, aoData, templatePath) : (yield this.super(...args))));
            } else {
              return aoData;
            }
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
