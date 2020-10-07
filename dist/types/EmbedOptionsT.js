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
    var EmbedOptionsT, MaybeG, StructG, TupleG;
    ({MaybeG, StructG, TupleG, EmbedOptionsT} = Module.prototype);
    return EmbedOptionsT.define(MaybeG(StructG({
      refKey: MaybeG(String),
      inverse: MaybeG(String),
      inverseType: MaybeG(String),
      attr: MaybeG(String),
      through: MaybeG(TupleG(String, StructG({
        by: String
      }))),
      putOnly: MaybeG(Boolean),
      loadOnly: MaybeG(Boolean),
      recordName: MaybeG(Function),
      collectionName: MaybeG(Function)
    })));
  };

}).call(this);
