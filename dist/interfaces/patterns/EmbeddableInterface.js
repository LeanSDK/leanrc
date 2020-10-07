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
    var DictG, EmbedConfigT, EmbedOptionsT, EmbeddableInterface, FuncG, Interface, MaybeG, PropertyDefinitionT, RecordInterface;
    ({PropertyDefinitionT, EmbedOptionsT, EmbedConfigT, FuncG, DictG, MaybeG, RecordInterface, Interface} = Module.prototype);
    return EmbeddableInterface = (function() {
      class EmbeddableInterface extends Interface {};

      EmbeddableInterface.inheritProtected();

      EmbeddableInterface.module(Module);

      EmbeddableInterface.virtual(EmbeddableInterface.static({
        relatedEmbed: FuncG([PropertyDefinitionT, EmbedOptionsT])
      }));

      EmbeddableInterface.virtual(EmbeddableInterface.static({
        relatedEmbeds: FuncG([PropertyDefinitionT, EmbedOptionsT])
      }));

      EmbeddableInterface.virtual(EmbeddableInterface.static({
        hasEmbed: FuncG([PropertyDefinitionT, EmbedOptionsT])
      }));

      EmbeddableInterface.virtual(EmbeddableInterface.static({
        hasEmbeds: FuncG([PropertyDefinitionT, EmbedOptionsT])
      }));

      EmbeddableInterface.virtual(EmbeddableInterface.static({
        embeddings: DictG(String, EmbedConfigT)
      }));

      EmbeddableInterface.virtual(EmbeddableInterface.static({
        makeSnapshotWithEmbeds: FuncG(RecordInterface, MaybeG(Object))
      }));

      EmbeddableInterface.initialize();

      return EmbeddableInterface;

    }).call(this);
  };

}).call(this);
