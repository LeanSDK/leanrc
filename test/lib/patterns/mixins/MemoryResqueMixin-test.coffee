{ expect, assert } = require 'chai'
sinon = require 'sinon'
_ = require 'lodash'
RC = require '@leansdk/rc/lib'
LeanRC = require.main.require 'lib'
{ co } = RC::Utils


describe 'MemoryResqueMixin', ->
  describe '.new', ->
    it 'should create resque instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        assert.instanceOf resque, Test::Resque
        yield return
  describe '#onRegister', ->
    it 'should register resque instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        assert.deepEqual resque[Symbol.for '~jobs'], {}
        assert.deepEqual resque[Symbol.for '~queues'],
          'Test|>default': concurrency: 1, name: 'default'
        yield return
  describe '#onRemove', ->
    it 'should unregister resque instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        assert.deepEqual resque[Symbol.for '~jobs'], {}
        assert.deepEqual resque[Symbol.for '~queues'],
          'Test|>default': concurrency: 1, name: 'default'
        resque.onRemove()
        assert.deepEqual resque.tmpJobs, []
        assert.deepEqual resque[Symbol.for '~queues'], {}
        # assert.isUndefined resque[Symbol.for '~jobs']
        # assert.isUndefined resque[Symbol.for '~queues']
        yield return
  describe '#ensureQueue', ->
    it 'should create queue config', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE', 5
        queue = resque[Symbol.for '~queues']['Test|>TEST_QUEUE']
        assert.propertyVal queue, 'name', 'TEST_QUEUE'
        assert.propertyVal queue, 'concurrency', 5
        yield return
  describe '#getQueue', ->
    it 'should get queue', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE', 5
        queue = yield resque.getQueue 'TEST_QUEUE'
        assert.propertyVal queue, 'name', 'TEST_QUEUE'
        assert.propertyVal queue, 'concurrency', 5
        yield return
  describe '#removeQueue', ->
    it 'should remove queue', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE', 5
        queue = yield resque.getQueue 'TEST_QUEUE'
        assert.isDefined queue
        yield resque.removeQueue 'TEST_QUEUE'
        queue = yield resque.getQueue 'TEST_QUEUE'
        assert.isUndefined queue
        yield return
  describe '#allQueues', ->
    it 'should get all queues', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        resque.ensureQueue 'TEST_QUEUE_2', 2
        resque.ensureQueue 'TEST_QUEUE_3', 3
        resque.ensureQueue 'TEST_QUEUE_4', 4
        resque.ensureQueue 'TEST_QUEUE_5', 5
        resque.ensureQueue 'TEST_QUEUE_6', 6
        queues = yield resque.allQueues()
        assert.lengthOf queues, 7
        assert.includeDeepMembers queues, [
          name: 'default', concurrency: 1
        ,
          name: 'TEST_QUEUE_1', concurrency: 1
        ,
          name: 'TEST_QUEUE_2', concurrency: 2
        ,
          name: 'TEST_QUEUE_3', concurrency: 3
        ,
          name: 'TEST_QUEUE_4', concurrency: 4
        ,
          name: 'TEST_QUEUE_5', concurrency: 5
        ,
          name: 'TEST_QUEUE_6', concurrency: 6
        ]
        yield return
  describe '#pushJob', ->
    it 'should save new job', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        DATA = data: 'data'
        DATE = Date.now()
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT', DATA, DATE
        job = resque[Symbol.for '~jobs']['Test|>TEST_QUEUE_1'][jobId]
        assert.deepEqual job,
          queueName: 'Test|>TEST_QUEUE_1'
          data: scriptName: 'TEST_SCRIPT', data: DATA
          delayUntil: DATE
          status: 'scheduled'
          lockLifetime: 5000
          lockLimit: 2
        yield return
  describe '#getJob', ->
    it 'should get saved job', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        DATA = data: 'data'
        DATE = Date.now()
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT', DATA, DATE
        job = yield resque.getJob 'TEST_QUEUE_1', jobId
        assert.deepEqual job,
          queueName: 'Test|>TEST_QUEUE_1'
          data: scriptName: 'TEST_SCRIPT', data: DATA
          delayUntil: DATE
          status: 'scheduled'
          lockLifetime: 5000
          lockLimit: 2
        yield return
  describe '#deleteJob', ->
    it 'should remove saved job', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        DATA = data: 'data'
        DATE = Date.now()
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT', DATA, DATE
        job = yield resque.getJob 'TEST_QUEUE_1', jobId
        assert.deepEqual job,
          queueName: 'Test|>TEST_QUEUE_1'
          data: scriptName: 'TEST_SCRIPT', data: DATA
          delayUntil: DATE
          status: 'scheduled'
          lockLifetime: 5000
          lockLimit: 2
        assert.isTrue yield resque.deleteJob 'TEST_QUEUE_1', jobId
        assert.isNull yield resque.getJob 'TEST_QUEUE_1', jobId
        yield return
  describe '#allJobs', ->
    it 'should list all jobs', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        resque.ensureQueue 'TEST_QUEUE_2', 1
        DATA = data: 'data'
        DATE = Date.now()
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_2', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_2', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_2', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_2', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_2', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.deleteJob 'TEST_QUEUE_1', jobId
        jobs = yield resque.allJobs 'TEST_QUEUE_1'
        assert.lengthOf jobs, 3
        jobs = yield resque.allJobs 'TEST_QUEUE_1', 'TEST_SCRIPT_2'
        assert.lengthOf jobs, 2
        yield return
  describe '#pendingJobs', ->
    it 'should list pending jobs', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        resque.ensureQueue 'TEST_QUEUE_2', 1
        DATA = data: 'data'
        DATE = Date.now()
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_2', 'TEST_SCRIPT_1', DATA, DATE
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_2', DATA, DATE
        job = yield resque.getJob 'TEST_QUEUE_1', jobId
        job.status = 'running'
        jobs = yield resque.pendingJobs 'TEST_QUEUE_1'
        assert.lengthOf jobs, 2
        jobs = yield resque.pendingJobs 'TEST_QUEUE_1', 'TEST_SCRIPT_2'
        assert.lengthOf jobs, 1
        yield return
  describe '#progressJobs', ->
    it 'should list runnning jobs', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        resque.ensureQueue 'TEST_QUEUE_2', 1
        DATA = data: 'data'
        DATE = Date.now()
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_2', 'TEST_SCRIPT_1', DATA, DATE
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_2', DATA, DATE
        job = yield resque.getJob 'TEST_QUEUE_1', jobId
        job.status = 'running'
        jobs = yield resque.progressJobs 'TEST_QUEUE_1'
        assert.lengthOf jobs, 1
        jobs = yield resque.progressJobs 'TEST_QUEUE_1', 'TEST_SCRIPT_2'
        assert.lengthOf jobs, 0
        yield return
  describe '#completedJobs', ->
    it 'should list complete jobs', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        resque.ensureQueue 'TEST_QUEUE_2', 1
        DATA = data: 'data'
        DATE = Date.now()
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_2', 'TEST_SCRIPT_1', DATA, DATE
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_2', DATA, DATE
        job = yield resque.getJob 'TEST_QUEUE_1', jobId
        job.status = 'completed'
        jobs = yield resque.completedJobs 'TEST_QUEUE_1'
        assert.lengthOf jobs, 1
        jobs = yield resque.completedJobs 'TEST_QUEUE_1', 'TEST_SCRIPT_2'
        assert.lengthOf jobs, 0
        yield return
  describe '#failedJobs', ->
    it 'should list failed jobs', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Resque extends LeanRC::Resque
          @inheritProtected()
          @include LeanRC::MemoryResqueMixin
          @module Test
          @initialize()
        resque = Test::Resque.new 'TEST_RESQUE'
        resque.onRegister()
        resque.ensureQueue 'TEST_QUEUE_1', 1
        resque.ensureQueue 'TEST_QUEUE_2', 1
        DATA = data: 'data'
        DATE = Date.now()
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_2', 'TEST_SCRIPT_1', DATA, DATE
        jobId = yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_1', DATA, DATE
        yield resque.pushJob 'TEST_QUEUE_1', 'TEST_SCRIPT_2', DATA, DATE
        job = yield resque.getJob 'TEST_QUEUE_1', jobId
        job.status = 'failed'
        jobs = yield resque.failedJobs 'TEST_QUEUE_1'
        assert.lengthOf jobs, 1
        jobs = yield resque.failedJobs 'TEST_QUEUE_1', 'TEST_SCRIPT_2'
        assert.lengthOf jobs, 0
        yield return
