

module.exports = (Module) ->
  {
    LOG_MSG

    Pipes
    LogFilterMessage
  } = Module::
  {
    JunctionMediator
    Junction
    PipeAwareModule
    TeeMerge
    Filter
    PipeListener
  } = Pipes::
  {
    STDIN
  } = PipeAwareModule
  {
    INPUT
  } = Junction
  {
    ACCEPT_INPUT_PIPE
  } = JunctionMediator
  {
    LOG_FILTER_NAME
    filterLogByLevel
  } = LogFilterMessage

  class LoggerJunctionMediator extends JunctionMediator
    @inheritProtected()
    @module Module

    @public @static NAME: String,
      default: 'LoggerJunctionMediator'

    @public listNotificationInterests: Function,
      default: (args...)->
        @super args...

    @public handleNotification: Function,
      default: (aoNotification)->
        switch aoNotification.getName()
          when ACCEPT_INPUT_PIPE
            name = aoNotification.getType()
            if name is STDIN
              pipe = aoNotification.getBody()
              tee = junction.retrievePipe STDIN
              tee.connectInput pipe
            else
              @super aoNotification
          else
            @super aoNotification

    @public handlePipeMessage: Function,
      default: (aoMessage)->
        @sendNotification LOG_MSG, aoMessage
        return

    @public onRegister: Function,
      default: ->
        teeMerge = TeeMerge.new()
        filter = Filter.new LOG_FILTER_NAME, null, filterLogByLevel
        filter.connect PipeListener.new @, @handlePipeMessage
        teeMerge.connect filter
        junction.registerPipe STDIN, INPUT, teeMerge
        return

    @public init: Function,
      default: ->
        @super LoggerJunctionMediator.NAME, Junction.new()


  LoggerJunctionMediator.initialize()