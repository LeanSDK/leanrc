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

  // класс, который должен отвечать за деобжектизацию json-структуры в Record запись при получении из браузера например и за обжектизацию Record-объекта в json-структуру для отправки например в браузер.
  module.exports = function(Module) {
    var AnyT, CollectionInterface, CoreObject, FuncG, MaybeG, Objectizer, ObjectizerInterface, RecordInterface, SubsetG;
    ({AnyT, FuncG, SubsetG, MaybeG, CollectionInterface, RecordInterface, ObjectizerInterface, CoreObject} = Module.prototype);
    return Objectizer = (function() {
      class Objectizer extends CoreObject {};

      Objectizer.inheritProtected();

      Objectizer.implements(ObjectizerInterface);

      Objectizer.module(Module);

      Objectizer.public({
        collection: CollectionInterface
      });

      Objectizer.public(Objectizer.async({
        recoverize: FuncG([SubsetG(RecordInterface), MaybeG(Object)], MaybeG(RecordInterface))
      }, {
        default: function*(acRecord, ahPayload) {
          if (ahPayload.type == null) {
            ahPayload.type = `${acRecord.moduleName()}::${acRecord.name}`;
          }
          return (yield acRecord.recoverize(ahPayload, this.collection));
        }
      }));

      Objectizer.public(Objectizer.async({
        objectize: FuncG([MaybeG(RecordInterface), MaybeG(Object)], MaybeG(Object))
      }, {
        default: function*(aoRecord, options = null) {
          var vcRecord;
          vcRecord = aoRecord.constructor;
          return vcRecord.objectize(aoRecord, options);
        }
      }));

      Objectizer.public(Objectizer.static(Objectizer.async({
        restoreObject: FuncG([SubsetG(Module), Object], ObjectizerInterface)
      }, {
        default: function*(Module, replica) {
          var Facade, collection, facade, ref;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            Facade = (ref = Module.prototype.ApplicationFacade) != null ? ref : Module.prototype.Facade;
            facade = Facade.getInstance(replica.multitonKey);
            collection = facade.retrieveProxy(replica.collectionName);
            return collection.objectizer;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      Objectizer.public(Objectizer.static(Objectizer.async({
        replicateObject: FuncG(ObjectizerInterface, Object)
      }, {
        default: function*(instance) {
          var ipsMultitonKey, replica;
          replica = (yield this.super(instance));
          ipsMultitonKey = Symbol.for('~multitonKey');
          replica.multitonKey = instance.collection[ipsMultitonKey];
          replica.collectionName = instance.collection.getProxyName();
          return replica;
        }
      })));

      Objectizer.public({
        init: FuncG(CollectionInterface)
      }, {
        default: function(...args) {
          this.super(...args);
          [this.collection] = args;
        }
      });

      Objectizer.initialize();

      return Objectizer;

    }).call(this);
  };

}).call(this);
