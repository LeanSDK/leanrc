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
    AnyT, PointerT
    FuncG, MaybeG
    PipeMessageInterface
    CoreObject
  } = Module::

  class PipeMessage extends CoreObject
    @inheritProtected()
    @implements PipeMessageInterface
    @module Module

    @public @static PRIORITY_HIGH: Number,
      default: 1
    @public @static PRIORITY_MED: Number,
      default: 5
    @public @static PRIORITY_LOW: Number,
      default: 10

    @public @static BASE: String,
      default: 'namespaces/pipes/messages/'
    @public @static NORMAL: String,
      get: -> "#{@BASE}normal"

    ipsType = PointerT @protected type: String
    ipnPriority = PointerT @protected priority: Number
    ipoHeader = PointerT @protected header: MaybeG Object
    ipoBody = PointerT @protected body: MaybeG AnyT

    @public getType: FuncG([], String),
      default: -> @[ipsType]

    @public setType: FuncG(String),
      default: (asType)->
        @[ipsType] = asType
        return

    @public getPriority: FuncG([], Number),
      default: -> @[ipnPriority]

    @public setPriority: FuncG(Number),
      default: (anPriority)->
        @[ipnPriority] = anPriority
        return

    @public getHeader: FuncG([], MaybeG Object),
      default: -> @[ipoHeader]

    @public setHeader: FuncG(Object),
      default: (aoHeader)->
        @[ipoHeader] = aoHeader
        return

    @public getBody: FuncG([], MaybeG AnyT),
      default: -> @[ipoBody]

    @public setBody: FuncG([MaybeG AnyT]),
      default: (aoBody)->
        @[ipoBody] = aoBody
        return

    @public @static @async restoreObject: Function,
      default: ->
        throw new Error "restoreObject method not supported for #{@name}"
        yield return

    @public @static @async replicateObject: Function,
      default: ->
        throw new Error "replicateObject method not supported for #{@name}"
        yield return

    @public init: FuncG([
      String, MaybeG(Object), MaybeG(Object), MaybeG Number
    ]),
      default: (asType, aoHeader=null, aoBody=null, anPriority=5)->
        @super arguments...
        @setType asType
        @setHeader aoHeader if aoHeader?
        @setBody aoBody if aoBody?
        @setPriority anPriority
        return


    @initialize()
