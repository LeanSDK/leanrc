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
    var AsyncFunctionT, EnumG, MaybeG, RelationConfigT, StructG, TupleG;
    ({AsyncFunctionT, MaybeG, StructG, TupleG, EnumG, RelationConfigT} = Module.prototype);
    return RelationConfigT.define(MaybeG(StructG({
      refKey: String,
      attr: MaybeG(String),
      inverse: String,
      inverseType: MaybeG(String),
      relation: EnumG('relatedTo', 'belongsTo', 'hasMany', 'hasOne'),
      recordName: Function,
      collectionName: Function,
      through: MaybeG(TupleG(String, StructG({
        by: String
      }))),
      get: AsyncFunctionT
    })));
  };

}).call(this);
