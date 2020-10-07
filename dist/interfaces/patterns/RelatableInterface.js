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
    var DictG, FuncG, Interface, PropertyDefinitionT, RecordInterface, RelatableInterface, RelationConfigT, RelationInverseT, RelationOptionsT, StructG, SubsetG;
    ({PropertyDefinitionT, RelationOptionsT, RelationConfigT, RelationInverseT, FuncG, StructG, SubsetG, DictG, RecordInterface, Interface} = Module.prototype);
    return RelatableInterface = (function() {
      class RelatableInterface extends Interface {};

      RelatableInterface.inheritProtected();

      RelatableInterface.module(Module);

      RelatableInterface.virtual(RelatableInterface.static({
        relatedTo: FuncG([PropertyDefinitionT, RelationOptionsT])
      }));

      RelatableInterface.virtual(RelatableInterface.static({
        belongsTo: FuncG([PropertyDefinitionT, RelationOptionsT])
      }));

      RelatableInterface.virtual(RelatableInterface.static({
        hasMany: FuncG([PropertyDefinitionT, RelationOptionsT])
      }));

      RelatableInterface.virtual(RelatableInterface.static({
        hasOne: FuncG([PropertyDefinitionT, RelationOptionsT])
      }));

      RelatableInterface.virtual(RelatableInterface.static({
        inverseFor: FuncG(String, RelationInverseT)
      }));

      RelatableInterface.virtual(RelatableInterface.static({
        relations: DictG(String, RelationConfigT)
      }));

      RelatableInterface.initialize();

      return RelatableInterface;

    }).call(this);
  };

}).call(this);
