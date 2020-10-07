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

  // здесь нужно определить интерфейс класса Router
  // ApplicationRouter будет наследоваться от Command класса, и в него будет подмешиваться миксин RouterMixin
  // на основе декларативно объявленной карты роутов, он будет оркестрировать медиаторы, которые будут отвечать за принятие сигналов от Express или Foxx
  module.exports = function(Module) {
    var EnumG, FuncG, InterfaceG, ListG, MaybeG, ProxyInterface, RouterInterface, UnionG;
    ({FuncG, MaybeG, InterfaceG, EnumG, ListG, UnionG, ProxyInterface} = Module.prototype);
    return RouterInterface = (function() {
      class RouterInterface extends ProxyInterface {};

      RouterInterface.inheritProtected();

      RouterInterface.module(Module);

      RouterInterface.virtual({
        path: MaybeG(String)
      });

      RouterInterface.virtual({
        name: MaybeG(String)
      });

      RouterInterface.virtual({
        above: MaybeG(Object)
      });

      RouterInterface.virtual({
        tag: MaybeG(String)
      });

      RouterInterface.virtual({
        templates: MaybeG(String)
      });

      RouterInterface.virtual({
        param: MaybeG(String)
      });

      RouterInterface.virtual({
        defaultEntityName: FuncG([], String)
      });

      RouterInterface.virtual(RouterInterface.static({
        map: FuncG([MaybeG(Function)])
      }));

      RouterInterface.virtual({
        map: Function
      });

      RouterInterface.virtual({
        root: FuncG([
          InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String)
          })
        ])
      });

      RouterInterface.virtual({
        defineMethod: FuncG([
          MaybeG(ListG(InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          }))),
          String,
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        get: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        post: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        put: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        delete: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        head: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        options: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        patch: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      });

      RouterInterface.virtual({
        resource: FuncG([
          String,
          MaybeG(UnionG(InterfaceG({
            path: MaybeG(String),
            module: MaybeG(String),
            only: MaybeG(UnionG(String,
          ListG(String))),
            via: MaybeG(UnionG(String,
          ListG(String))),
            except: MaybeG(UnionG(String,
          ListG(String))),
            tag: MaybeG(String),
            templates: MaybeG(String),
            param: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            above: MaybeG(Object)
          }),
          Function)),
          MaybeG(Function)
        ])
      });

      RouterInterface.virtual({
        namespace: FuncG([
          MaybeG(String),
          UnionG(InterfaceG({
            module: MaybeG(String),
            prefix: MaybeG(String),
            tag: MaybeG(String),
            templates: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            above: MaybeG(Object)
          }),
          Function),
          MaybeG(Function)
        ])
      });

      RouterInterface.virtual({
        member: FuncG(Function)
      });

      RouterInterface.virtual({
        collection: FuncG(Function)
      });

      RouterInterface.virtual({
        routes: ListG(InterfaceG({
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
      });

      RouterInterface.initialize();

      return RouterInterface;

    }).call(this);
  };

}).call(this);
