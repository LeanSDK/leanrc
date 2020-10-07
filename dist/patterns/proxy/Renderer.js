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
  пример темплейта
  ```coffee
  _         = require 'lodash'
  inflect   = do require 'i'

   * это специально не класс, а функция чтобы съэкономить процессорные ресурсы
  module.exports = (resource, action, aoData)->
    resource = resource.replace(/[/]/g, '_').replace /[_]$/g, ''
    meta: aoData.meta
    "#{inflect.pluralize inflect.underscore resource}": aoData.items.map (i)->
      _.omit i, '_key', '_type', '_owner'

  ```
  но также могут быть созданы обобщенные шаблоны, с каким-то кодом представления одного или нескольких итемов, чтобы в темплейтах рекваить (с них доп-параметры можно передавать аргументами или через карирование)
   */
  // Возможно стоит обдумать такую идею: валидировать выходящей joi схемой (которая нужна для свайгера) выходящий результат после рендера (но это применимо только для json)
  module.exports = function(Module) {
    var APPLICATION_MEDIATOR, AnyT, ContextInterface, FuncG, InterfaceG, MaybeG, Renderer, RendererInterface, ResourceInterface;
    // ConfigurableMixin
    ({APPLICATION_MEDIATOR, AnyT, FuncG, MaybeG, InterfaceG, ContextInterface, ResourceInterface, RendererInterface} = Module.prototype);
    return Renderer = (function() {
      class Renderer extends Module.prototype.Proxy {};

      Renderer.inheritProtected();

      // @include ConfigurableMixin
      Renderer.implements(RendererInterface);

      Renderer.module(Module);

      // may be redefine at inheritance
      Renderer.public(Renderer.async({
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
        default: function*(ctx, aoData, resource, {
            path,
            resource: resourceName,
            action,
            template: templatePath
          } = {}) {
          var ref, ref1, ref2, service, templates;
          if ((path != null) && (resourceName != null) && (action != null)) {
            service = (ref = this.facade.retrieveMediator(APPLICATION_MEDIATOR)) != null ? ref.getViewComponent() : void 0;
            ({templates} = service.Module);
            return (yield Module.prototype.Promise.resolve((ref1 = templates != null ? (ref2 = templates[templatePath]) != null ? ref2.call(resource, resourceName, action, aoData) : void 0 : void 0) != null ? ref1 : aoData));
          } else {
            return aoData;
          }
        }
      }));

      Renderer.initialize();

      return Renderer;

    }).call(this);
  };

}).call(this);
