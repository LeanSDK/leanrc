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

  // интерфейс к миксину, который должен отвечать за сериализацию отдельной записи при сохранении ее через collection прокси в некоторое хранилище. т.е. за сериализацию отдельных атрибутов и их десериализацию при получении из хранилища.

  // для автоматизации и чтобы предотвратить дублирование в таких классах должны определяться общие механизмы, а для отдельных типов данных будет отдельный класс transform
  module.exports = function(Module) {
    var AnyT, CollectionInterface, FuncG, Interface, MaybeG, RecordInterface, SerializerInterface, SubsetG;
    ({AnyT, FuncG, SubsetG, MaybeG, CollectionInterface, RecordInterface, Interface} = Module.prototype);
    return SerializerInterface = (function() {
      class SerializerInterface extends Interface {};

      SerializerInterface.inheritProtected();

      SerializerInterface.module(Module);

      SerializerInterface.virtual({
        collection: CollectionInterface
      });

      SerializerInterface.virtual(SerializerInterface.async({
        normalize: FuncG([SubsetG(RecordInterface), MaybeG(AnyT)], RecordInterface)
      }));

      SerializerInterface.virtual(SerializerInterface.async({
        serialize: FuncG([MaybeG(RecordInterface), MaybeG(Object)], MaybeG(AnyT))
      }));

      SerializerInterface.initialize();

      return SerializerInterface;

    }).call(this);
  };

}).call(this);
