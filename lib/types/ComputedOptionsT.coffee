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
    AnyT, JoiT
    FuncG, MaybeG, InterfaceG, SubsetG
    TransformInterface
    ComputedOptionsT
  } = Module::

  ComputedOptionsT.define InterfaceG {
    transform: MaybeG FuncG [], SubsetG TransformInterface
    validate: MaybeG FuncG [], JoiT
    get: Function
  }
