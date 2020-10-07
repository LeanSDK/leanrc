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
    var AnyT, CoreObject, FuncG, MaybeG, Notification, NotificationInterface, PointerT, SubsetG;
    ({AnyT, PointerT, FuncG, MaybeG, SubsetG, NotificationInterface, CoreObject} = Module.prototype);
    return Notification = (function() {
      var ipoBody, ipsName, ipsType;

      class Notification extends CoreObject {};

      Notification.inheritProtected();

      Notification.implements(NotificationInterface);

      Notification.module(Module);

      ipsName = PointerT(Notification.private({
        name: String
      }));

      ipoBody = PointerT(Notification.private({
        body: MaybeG(AnyT)
      }));

      ipsType = PointerT(Notification.private({
        type: MaybeG(String)
      }));

      Notification.public({
        getName: FuncG([], String)
      }, {
        default: function() {
          return this[ipsName];
        }
      });

      Notification.public({
        setBody: FuncG([MaybeG(AnyT)])
      }, {
        default: function(aoBody) {
          this[ipoBody] = aoBody;
        }
      });

      Notification.public({
        getBody: FuncG([], MaybeG(AnyT))
      }, {
        default: function() {
          return this[ipoBody];
        }
      });

      Notification.public({
        setType: FuncG(String)
      }, {
        default: function(asType) {
          this[ipsType] = asType;
        }
      });

      Notification.public({
        getType: FuncG([], MaybeG(String))
      }, {
        default: function() {
          return this[ipsType];
        }
      });

      Notification.public({
        toString: FuncG([], String)
      }, {
        default: function() {
          return `Notification Name: ${this.getName()}
Body: ${this.getBody() != null ? this.getBody().toString() : 'null'}
Type: ${this.getType() != null ? this.getType() : 'null'}`;
        }
      });

      Notification.public(Notification.static(Notification.async({
        restoreObject: FuncG([SubsetG(Module), Object], NotificationInterface)
      }, {
        default: function*(Module, replica) {
          var body, instance, name, type;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            ({name, body, type} = replica.notification);
            instance = this.new(name, body, type);
            return instance;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      Notification.public(Notification.static(Notification.async({
        replicateObject: FuncG(NotificationInterface, Object)
      }, {
        default: function*(instance) {
          var replica;
          replica = (yield this.super(instance));
          replica.notification = {
            name: instance.getName(),
            body: instance.getBody(),
            type: instance.getType()
          };
          return replica;
        }
      })));

      Notification.public({
        init: FuncG([String, MaybeG(AnyT), MaybeG(String)])
      }, {
        default: function(asName, aoBody, asType) {
          this.super(...arguments);
          this[ipsName] = asName;
          this[ipoBody] = aoBody;
          if (asType != null) {
            this[ipsType] = asType;
          }
        }
      });

      Notification.initialize();

      return Notification;

    }).call(this);
  };

}).call(this);
