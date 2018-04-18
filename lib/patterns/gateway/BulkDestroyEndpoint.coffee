

module.exports = (Module)->
  {
    CrudEndpointMixin
    Utils: { statuses }
  } = Module::

  UNAUTHORIZED      = statuses 'unauthorized'
  UPGRADE_REQUIRED  = statuses 'upgrade required'

  class BulkDestroyEndpoint extends Module::Endpoint
    @inheritProtected()
    # @implements Module::EndpointInterface
    @include CrudEndpointMixin
    @module Module

    @public init: Function,
      default: (args...) ->
        @super args...
        @pathParam 'v', @versionSchema
        @queryParam 'query', @querySchema, "
          The query for finding
          #{@listEntityName}.
        "
        @response null
        @error UNAUTHORIZED
        @error UPGRADE_REQUIRED
        @summary "
          Remove of filtered #{@listEntityName}
        "
        @description  "
          Remove a list of filtered
          #{@listEntityName} by using query.
        "

    @initialize()