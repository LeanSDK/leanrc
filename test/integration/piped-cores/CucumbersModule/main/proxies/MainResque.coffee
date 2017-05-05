# создаем его в Core для того чтобы можно было ставить задачи на обработку


module.exports = (Module)->
  {
    Resque
    MemoryResqueMixin
  } = Module::

  class MainResque extends Resque
    @inheritProtected()
    @module Module

    @include MemoryResqueMixin


  MainResque.initialize()
