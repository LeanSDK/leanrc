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
  var hasProp = {}.hasOwnProperty;

  /*
  ```coffee
   * in application when its need

  Module = require 'Module'
  ArangoExtension = require 'leanrc-arango-extension'

   * example of concrete application collection for instantuate it in PrepareModelCommand
  module.exports = (App)->
    class App::ArangoCollection extends Module::Collection
      @include ArangoExtension::ArangoCollectionMixin
      #... some other definitions

    return App::ArangoCollection.initialize()
  ```

  ```coffee
  module.exports = (App)->
    App::PrepareModelCommand extends Module::SimpleCommand
      @public execute: Function,
        default: ->
          #...
          @facade.registerProxy App::ArangoCollection.new 'CucumbersCollection',
   * какие-то конфиги
          #...
  ```
   */
  module.exports = function(Module) {
    var AnyT, Collection, CollectionInterface, ConfigurableMixin, CursorInterface, FuncG, InterfaceG, ListG, MaybeG, NilT, Objectizer, ObjectizerInterface, RecordInterface, Serializer, SerializerInterface, SubsetG, UnionG, _, inflect;
    ({
      AnyT,
      NilT,
      FuncG,
      SubsetG,
      MaybeG,
      UnionG,
      ListG,
      InterfaceG,
      CollectionInterface,
      RecordInterface,
      CursorInterface,
      SerializerInterface,
      ObjectizerInterface,
      ConfigurableMixin,
      Serializer,
      Objectizer,
      Utils: {_, inflect}
    } = Module.prototype);
    return Collection = (function() {
      class Collection extends Module.prototype.Proxy {};

      Collection.inheritProtected();

      Collection.include(ConfigurableMixin);

      Collection.implements(CollectionInterface);

      Collection.module(Module);

      Collection.public({
        delegate: SubsetG(RecordInterface)
      }, {
        get: function() {
          var delegate, ref, ref1;
          delegate = (ref = this.getData()) != null ? ref.delegate : void 0;
          UnionG(String, Function, SubsetG(RecordInterface))(delegate);
          if (_.isString(delegate)) {
            delegate = ((ref1 = this.ApplicationModule.NS) != null ? ref1 : this.ApplicationModule.prototype)[delegate];
          } else if (!/Migration$|Record$/.test(delegate.name)) {
            delegate = typeof delegate === "function" ? delegate() : void 0;
          }
          return delegate;
        }
      });

      Collection.public({
        serializer: MaybeG(SerializerInterface)
      });

      Collection.public({
        objectizer: MaybeG(ObjectizerInterface)
      });

      Collection.public({
        collectionName: FuncG([], String)
      }, {
        default: function() {
          var firstClassName;
          firstClassName = _.first(_.remove(this.delegate.parentClassNames(), function(name) {
            return !/Mixin$|Interface$|^CoreObject$|^Record$/.test(name);
          }));
          return inflect.pluralize(inflect.underscore(firstClassName.replace(/Record$/, '')));
        }
      });

      Collection.public({
        collectionPrefix: FuncG([], String)
      }, {
        default: function() {
          return `${inflect.underscore(this.Module.name)}_`;
        }
      });

      Collection.public({
        collectionFullName: FuncG([MaybeG(String)], String)
      }, {
        default: function(asName = null) {
          return `${this.collectionPrefix()}${asName != null ? asName : this.collectionName()}`;
        }
      });

      Collection.public({
        recordHasBeenChanged: FuncG([String, Object])
      }, {
        default: function(asType, aoData) {
          this.sendNotification(Module.prototype.RECORD_CHANGED, aoData, asType);
        }
      });

      Collection.public(Collection.async({
        generateId: FuncG([RecordInterface], UnionG(String, Number, NilT))
      }, {
        default: function*() {}
      }));

      Collection.public(Collection.async({
        build: FuncG(Object, RecordInterface)
      }, {
        default: function*(properties) {
          return (yield this.objectizer.recoverize(this.delegate, properties));
        }
      }));

      Collection.public(Collection.async({
        create: FuncG(Object, RecordInterface)
      }, {
        default: function*(properties) {
          var voRecord;
          voRecord = (yield this.build(properties));
          return (yield voRecord.save());
        }
      }));

      Collection.public(Collection.async({
        push: FuncG(RecordInterface, RecordInterface)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        delete: FuncG([UnionG(String, Number)])
      }, {
        default: function*(id) {
          var voRecord;
          voRecord = (yield this.find(id));
          yield voRecord.delete();
        }
      }));

      Collection.public(Collection.async({
        destroy: FuncG([UnionG(String, Number)])
      }, {
        default: function*(id) {
          var voRecord;
          voRecord = (yield this.find(id));
          yield voRecord.destroy();
        }
      }));

      Collection.public(Collection.async({
        remove: FuncG([UnionG(String, Number)])
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        find: FuncG([UnionG(String, Number)], MaybeG(RecordInterface))
      }, {
        default: function*(id) {
          return (yield this.take(id));
        }
      }));

      Collection.public(Collection.async({
        findMany: FuncG([ListG(UnionG(String, Number))], CursorInterface)
      }, {
        default: function*(ids) {
          return (yield this.takeMany(ids));
        }
      }));

      Collection.public(Collection.async({
        take: FuncG([UnionG(String, Number)], MaybeG(RecordInterface))
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        takeMany: FuncG([ListG(UnionG(String, Number))], CursorInterface)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        takeAll: FuncG([], CursorInterface)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        update: FuncG([UnionG(String, Number), Object], RecordInterface)
      }, {
        default: function*(id, properties) {
          var existedRecord, key, receivedRecord;
          properties.id = id;
          existedRecord = (yield this.find(id));
          receivedRecord = (yield this.objectizer.recoverize(this.delegate, properties));
          for (key in properties) {
            if (!hasProp.call(properties, key)) continue;
            existedRecord[key] = receivedRecord[key];
          }
          return (yield existedRecord.save());
        }
      }));

      Collection.public(Collection.async({
        override: FuncG([UnionG(String, Number), RecordInterface], RecordInterface)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        clone: FuncG(RecordInterface, RecordInterface)
      }, {
        default: function*(aoRecord) {
          var i, key, len, vhAttributes, vlAttributes, voRecord;
          vhAttributes = {};
          vlAttributes = Object.keys(this.delegate.attributes);
          for (i = 0, len = vlAttributes.length; i < len; i++) {
            key = vlAttributes[i];
            vhAttributes[key] = aoRecord[key];
          }
          voRecord = this.delegate.new(vhAttributes, this);
          voRecord.id = (yield this.generateId());
          return voRecord;
        }
      }));

      Collection.public(Collection.async({
        copy: FuncG(RecordInterface, RecordInterface)
      }, {
        default: function*(aoRecord) {
          var voRecord;
          voRecord = (yield this.clone(aoRecord));
          yield voRecord.save();
          return voRecord;
        }
      }));

      Collection.public(Collection.async({
        includes: FuncG([UnionG(String, Number)], Boolean)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        length: FuncG([], Number)
      }, {
        default: function*() {
          throw new Error('Not implemented specific method');
        }
      }));

      Collection.public(Collection.async({
        normalize: FuncG(AnyT, RecordInterface)
      }, {
        default: function*(ahData) {
          return (yield this.serializer.normalize(this.delegate, ahData));
        }
      }));

      Collection.public(Collection.async({
        serialize: FuncG(RecordInterface, AnyT)
      }, {
        default: function*(aoRecord, ahOptions) {
          return (yield this.serializer.serialize(aoRecord, ahOptions));
        }
      }));

      Collection.public({
        init: FuncG([
          String,
          MaybeG(InterfaceG({
            delegate: UnionG(String,
          Function,
          SubsetG(RecordInterface)),
            serializer: MaybeG(UnionG(String,
          Function,
          SubsetG(Serializer))),
            objectizer: MaybeG(UnionG(String,
          Function,
          SubsetG(Objectizer)))
          }))
        ])
      }, {
        default: function(...args) {
          var objectizer, ref, ref1, ref2, ref3, serializer, vcObjectizer, vcSerializer;
          this.super(...args);
          serializer = (ref = this.getData()) != null ? ref.serializer : void 0;
          objectizer = (ref1 = this.getData()) != null ? ref1.objectizer : void 0;
          vcSerializer = serializer == null ? Serializer : _.isString(serializer) ? ((ref2 = this.ApplicationModule.NS) != null ? ref2 : this.ApplicationModule.prototype)[serializer] : !/Serializer$/.test(serializer.name) ? typeof serializer === "function" ? serializer() : void 0 : serializer;
          vcObjectizer = objectizer == null ? Objectizer : _.isString(objectizer) ? ((ref3 = this.ApplicationModule.NS) != null ? ref3 : this.ApplicationModule.prototype)[objectizer] : !/Objectizer$/.test(objectizer.name) ? typeof objectizer === "function" ? objectizer() : void 0 : objectizer;
          this.serializer = vcSerializer.new(this);
          this.objectizer = vcObjectizer.new(this);
        }
      });

      Collection.initialize();

      return Collection;

    }).call(this);
  };

}).call(this);
