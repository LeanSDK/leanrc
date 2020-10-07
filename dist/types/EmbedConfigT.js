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
    var AsyncFunctionT, EmbedConfigT, EnumG, FuncG, JoiT, MaybeG, StructG, TupleG;
    ({JoiT, AsyncFunctionT, FuncG, MaybeG, StructG, TupleG, EnumG, EmbedConfigT} = Module.prototype);
    return EmbedConfigT.define(MaybeG(StructG({
      refKey: String,
      inverse: String,
      inverseType: MaybeG(String),
      attr: MaybeG(String),
      embedding: EnumG('relatedEmbed', 'relatedEmbeds', 'hasEmbed', 'hasEmbeds'),
      through: MaybeG(TupleG(String, StructG({
        by: String
      }))),
      putOnly: Boolean,
      loadOnly: Boolean,
      recordName: Function,
      collectionName: Function,
      validate: FuncG([], JoiT),
      load: AsyncFunctionT,
      put: AsyncFunctionT,
      restore: AsyncFunctionT,
      replicate: Function
    })));
  };

}).call(this);
