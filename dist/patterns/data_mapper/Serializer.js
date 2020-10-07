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

  // класс, который должен отвечать за сериализацию отдельной записи при сохранении ее через collection прокси в некоторое хранилище. т.е. за сериализацию отдельных атрибутов и их десериализацию при получении из хранилища.
  module.exports = function(Module) {
    var AnyT, CollectionInterface, CoreObject, FuncG, MaybeG, RecordInterface, Serializer, SerializerInterface, SubsetG;
    ({AnyT, FuncG, SubsetG, MaybeG, CollectionInterface, RecordInterface, SerializerInterface, CoreObject} = Module.prototype);
    return Serializer = (function() {
      class Serializer extends CoreObject {};

      Serializer.inheritProtected();

      Serializer.implements(SerializerInterface);

      Serializer.module(Module);

      Serializer.public({
        collection: CollectionInterface
      });

      Serializer.public(Serializer.async({
        normalize: FuncG([SubsetG(RecordInterface), MaybeG(AnyT)], RecordInterface)
      }, {
        default: function*(acRecord, ahPayload) {
          return (yield acRecord.normalize(ahPayload, this.collection));
        }
      }));

      Serializer.public(Serializer.async({
        serialize: FuncG([MaybeG(RecordInterface), MaybeG(Object)], MaybeG(AnyT))
      }, {
        default: function*(aoRecord, options = null) {
          var vcRecord;
          vcRecord = aoRecord.constructor;
          return (yield vcRecord.serialize(aoRecord, options));
        }
      }));

      Serializer.public(Serializer.static(Serializer.async({
        restoreObject: FuncG([SubsetG(Module), Object], SerializerInterface)
      }, {
        default: function*(Module, replica) {
          var Facade, collection, facade, ref;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            Facade = (ref = Module.prototype.ApplicationFacade) != null ? ref : Module.prototype.Facade;
            facade = Facade.getInstance(replica.multitonKey);
            collection = facade.retrieveProxy(replica.collectionName);
            return collection.serializer;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      Serializer.public(Serializer.static(Serializer.async({
        replicateObject: FuncG(SerializerInterface, Object)
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

      Serializer.public({
        init: FuncG(CollectionInterface)
      }, {
        default: function(...args) {
          this.super(...args);
          [this.collection] = args;
        }
      });

      Serializer.initialize();

      return Serializer;

    }).call(this);
  };

}).call(this);
