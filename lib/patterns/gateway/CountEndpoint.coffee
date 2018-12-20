

module.exports = (Module)->
  {
    FuncG, InterfaceG
    GatewayInterface
    CrudEndpointMixin
    Endpoint
    Utils: { statuses, joi }
  } = Module::

  UNAUTHORIZED      = statuses 'unauthorized'
  UPGRADE_REQUIRED  = statuses 'upgrade required'

  class CountEndpoint extends Endpoint
    @inheritProtected()
    @include CrudEndpointMixin
    @module Module

    @public init: FuncG(InterfaceG(gateway: GatewayInterface)),
      default: (args...) ->
        @super args...
        @pathParam 'v', @versionSchema
        @queryParam 'query', @querySchema, "
          The query for counting
          #{@listEntityName}.
        "
        @response joi.number(), "
          The count of #{@listEntityName}.
        "
        @error UNAUTHORIZED
        @error UPGRADE_REQUIRED
        @summary "
          Count of filtered #{@listEntityName}
        "
        @description  "
          Retrieves a count of filtered
          #{@listEntityName} by using query.
        "
        return


    @initialize()
