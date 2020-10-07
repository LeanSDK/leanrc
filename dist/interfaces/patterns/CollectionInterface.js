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
    var AnyT, CollectionInterface, CursorInterface, FuncG, ListG, MaybeG, NilT, ObjectizerInterface, ProxyInterface, RecordInterface, SerializerInterface, SubsetG, UnionG;
    ({AnyT, NilT, FuncG, SubsetG, MaybeG, UnionG, ListG, RecordInterface, CursorInterface, SerializerInterface, ObjectizerInterface, ProxyInterface} = Module.prototype);
    return CollectionInterface = (function() {
      class CollectionInterface extends ProxyInterface {};

      CollectionInterface.inheritProtected();

      CollectionInterface.module(Module);

      CollectionInterface.virtual({
        recordHasBeenChanged: FuncG([String, Object])
      });

      // надо определиться с этими двумя пунктами, так ли их объявлять?
      CollectionInterface.virtual({
        delegate: SubsetG(RecordInterface)
      });

      // @virtual serializer: MaybeG SerializerInterface
      // @virtual objectizer: MaybeG ObjectizerInterface
      CollectionInterface.virtual({
        collectionName: FuncG([], String)
      });

      CollectionInterface.virtual({
        collectionPrefix: FuncG([], String)
      });

      CollectionInterface.virtual({
        collectionFullName: FuncG([MaybeG(String)], String)
      });

      CollectionInterface.virtual(CollectionInterface.async({
        generateId: FuncG([RecordInterface], UnionG(String, Number, NilT))
      }));

      // NOTE: создает инстанс рекорда
      CollectionInterface.virtual(CollectionInterface.async({
        build: FuncG(Object, RecordInterface)
      }));

      // NOTE: создает инстанс рекорда и делает save
      CollectionInterface.virtual(CollectionInterface.async({
        create: FuncG(Object, RecordInterface)
      }));

      // NOTE: обращается к БД
      CollectionInterface.virtual(CollectionInterface.async({
        push: FuncG(RecordInterface, RecordInterface)
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        delete: FuncG([UnionG(String, Number)])
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        destroy: FuncG([UnionG(String, Number)])
      }));

      // NOTE: обращается к БД
      CollectionInterface.virtual(CollectionInterface.async({
        remove: FuncG([UnionG(String, Number)])
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        find: FuncG([UnionG(String, Number)], MaybeG(RecordInterface))
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        findMany: FuncG([ListG(UnionG(String, Number))], CursorInterface)
      }));

      // NOTE: обращается к БД
      CollectionInterface.virtual(CollectionInterface.async({
        take: FuncG([UnionG(String, Number)], MaybeG(RecordInterface))
      }));

      // NOTE: обращается к БД
      CollectionInterface.virtual(CollectionInterface.async({
        takeMany: FuncG([ListG(UnionG(String, Number))], CursorInterface)
      }));

      // NOTE: обращается к БД
      CollectionInterface.virtual(CollectionInterface.async({
        takeAll: FuncG([], CursorInterface)
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        update: FuncG([UnionG(String, Number), Object], RecordInterface)
      }));

      // NOTE: обращается к БД
      CollectionInterface.virtual(CollectionInterface.async({
        override: FuncG([UnionG(String, Number), RecordInterface], RecordInterface)
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        clone: FuncG(RecordInterface, RecordInterface)
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        copy: FuncG(RecordInterface, RecordInterface)
      }));

      CollectionInterface.virtual(CollectionInterface.async({
        includes: FuncG([UnionG(String, Number)], Boolean)
      }));

      // NOTE: количество объектов в коллекции
      CollectionInterface.virtual(CollectionInterface.async({
        length: FuncG([], Number)
      }));

      // NOTE: нормализация данных из базы
      CollectionInterface.virtual(CollectionInterface.async({
        normalize: FuncG(AnyT, RecordInterface)
      }));

      // NOTE: сериализация рекорда для отправки в базу
      CollectionInterface.virtual(CollectionInterface.async({
        serialize: FuncG(RecordInterface, AnyT)
      }));

      CollectionInterface.initialize();

      return CollectionInterface;

    }).call(this);
  };

}).call(this);
