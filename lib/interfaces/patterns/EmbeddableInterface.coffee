# This file is part of LeanRC.
#
# LeanRC is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# LeanRC is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with LeanRC.  If not, see <https://www.gnu.org/licenses/>.

module.exports = (Module)->
  {
    PropertyDefinitionT, EmbedOptionsT, EmbedConfigT
    FuncG, DictG, MaybeG
    RecordInterface
    Interface
  } = Module::

  class EmbeddableInterface extends Interface
    @inheritProtected()
    @module Module

    @virtual @static relatedEmbed: FuncG([PropertyDefinitionT, EmbedOptionsT])

    @virtual @static relatedEmbeds: FuncG([PropertyDefinitionT, EmbedOptionsT])

    @virtual @static hasEmbed: FuncG([PropertyDefinitionT, EmbedOptionsT])

    @virtual @static hasEmbeds: FuncG([PropertyDefinitionT, EmbedOptionsT])

    @virtual @static embeddings: DictG(String, EmbedConfigT)

    @virtual @static makeSnapshotWithEmbeds: FuncG(RecordInterface, MaybeG Object)


    @initialize()
