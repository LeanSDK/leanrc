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

  // данный интерфейс нужен для объявления классов, которые должны описывать конвертацию одних структур данных в другие.
  // ключевые имена трансформов (в т.ч. базовых) будут использоваться в объявлениях атрибутов рекордов на ряду с joi дефинициями и сопутствующими параметрами.
  module.exports = function(Module) {
    var AnyT, FuncG, Interface, JoiT, MaybeG, TransformInterface;
    ({AnyT, JoiT, FuncG, MaybeG, Interface} = Module.prototype);
    return TransformInterface = (function() {
      class TransformInterface extends Interface {};

      TransformInterface.inheritProtected();

      TransformInterface.module(Module);

      TransformInterface.public(TransformInterface.static({
        schema: JoiT
      }));

      TransformInterface.virtual(TransformInterface.static(TransformInterface.async({
        normalize: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      })));

      TransformInterface.virtual(TransformInterface.static(TransformInterface.async({
        serialize: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      })));

      TransformInterface.virtual(TransformInterface.static({
        objectize: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      }));

      TransformInterface.initialize();

      return TransformInterface;

    }).call(this);
  };

}).call(this);
