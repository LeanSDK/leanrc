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
    var AnyT, ContextInterface, FuncG, InterfaceG, MaybeG, Mixin, NilT, Renderer, ResourceInterface;
    ({AnyT, NilT, FuncG, MaybeG, InterfaceG, ContextInterface, ResourceInterface, Renderer, Mixin} = Module.prototype);
    return Module.defineMixin(Mixin('CrudRendererMixin', function(BaseClass = Renderer) {
      var CrudRendererMixin;
      return CrudRendererMixin = (function() {
        class CrudRendererMixin extends BaseClass {};

        CrudRendererMixin.inheritProtected();

        CrudRendererMixin.public({
          create: FuncG([String, String, Object, MaybeG(String)], Object)
        }, {
          default: function(resource, action, aoData, templatePath) {
            var itemDecorator, templateName;
            templateName = templatePath.replace(new RegExp(`/${action}$`), '/itemDecorator');
            itemDecorator = this.Module.templates[templateName];
            if (itemDecorator == null) {
              itemDecorator = CrudRendererMixin.prototype.itemDecorator;
            }
            return {
              [`${this.itemEntityName}`]: itemDecorator.call(this, aoData)
            };
          }
        });

        CrudRendererMixin.public({
          delete: FuncG([String, String, NilT, MaybeG(String)])
        }, {
          default: function(resource, action, aoData) {}
        });

        CrudRendererMixin.public({
          destroy: FuncG([String, String, NilT, MaybeG(String)])
        }, {
          default: function(resource, action, aoData) {}
        });

        CrudRendererMixin.public({
          detail: FuncG([String, String, Object, MaybeG(String)], Object)
        }, {
          default: function(resource, action, aoData, templatePath) {
            var itemDecorator, templateName;
            templateName = templatePath.replace(new RegExp(`/${action}$`), '/itemDecorator');
            itemDecorator = this.Module.templates[templateName];
            if (itemDecorator == null) {
              itemDecorator = CrudRendererMixin.prototype.itemDecorator;
            }
            return {
              [`${this.itemEntityName}`]: itemDecorator.call(this, aoData)
            };
          }
        });

        CrudRendererMixin.public({
          itemDecorator: FuncG([MaybeG(Object)], MaybeG(Object))
        }, {
          default: function(aoData) {
            var ref, ref1, ref2, result;
            if (aoData != null) {
              result = JSON.parse(JSON.stringify(aoData));
              result.createdAt = (ref = aoData.createdAt) != null ? ref.toISOString() : void 0;
              result.updatedAt = (ref1 = aoData.updatedAt) != null ? ref1.toISOString() : void 0;
              result.deletedAt = (ref2 = aoData.deletedAt) != null ? ref2.toISOString() : void 0;
            } else {
              result = null;
            }
            return result;
          }
        });

        CrudRendererMixin.public({
          list: FuncG([String, String, Object, MaybeG(String)], Object)
        }, {
          default: function(resource, action, aoData, templatePath) {
            var itemDecorator, templateName;
            templateName = templatePath.replace(new RegExp(`/${action}$`), '/itemDecorator');
            itemDecorator = this.Module.templates[templateName];
            if (itemDecorator == null) {
              itemDecorator = CrudRendererMixin.prototype.itemDecorator;
            }
            return {
              meta: aoData.meta,
              [`${this.listEntityName}`]: aoData.items.map(itemDecorator.bind(this))
            };
          }
        });

        CrudRendererMixin.public({
          query: FuncG([String, String, MaybeG(AnyT), MaybeG(String)], MaybeG(AnyT))
        }, {
          default: function(resource, action, aoData) {
            return aoData;
          }
        });

        CrudRendererMixin.public({
          update: FuncG([String, String, Object, MaybeG(String)], Object)
        }, {
          default: function(resource, action, aoData, templatePath) {
            var itemDecorator, templateName;
            templateName = templatePath.replace(new RegExp(`/${action}$`), '/itemDecorator');
            itemDecorator = this.Module.templates[templateName];
            if (itemDecorator == null) {
              itemDecorator = CrudRendererMixin.prototype.itemDecorator;
            }
            return {
              [`${this.itemEntityName}`]: itemDecorator.call(this, aoData)
            };
          }
        });

        CrudRendererMixin.public(CrudRendererMixin.async({
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
              return (yield Module.prototype.Promise.resolve((templates != null ? templates[templatePath] : void 0) != null ? templates != null ? (ref = templates[templatePath]) != null ? ref.call(resource, resourceName, action, aoData) : void 0 : void 0 : action === 'create' || action === 'delete' || action === 'destroy' || action === 'detail' || action === 'list' || action === 'update' ? this[action].call(resource, resourceName, action, aoData, templatePath) : (yield this.super(...args))));
            } else {
              return aoData;
            }
          }
        }));

        CrudRendererMixin.initializeMixin();

        return CrudRendererMixin;

      }).call(this);
    }));
  };

}).call(this);
