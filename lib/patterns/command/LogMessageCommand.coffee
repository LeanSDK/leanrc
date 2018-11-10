

module.exports = (Module) ->
  {
    NilT
    FuncG
    NotificationInterface
    SimpleCommand
    Application
  } = Module::
  {
    LOGGER_PROXY
  } = Application::

  class LogMessageCommand extends SimpleCommand
    @inheritProtected()
    @module Module

    @public execute: FuncG(NotificationInterface, NilT),
      default: (aoNotification)->
        proxy = @facade.retrieveProxy LOGGER_PROXY
        proxy.addLogEntry aoNotification.getBody()
        return


    @initialize()
