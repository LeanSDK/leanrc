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
  var Declare, LeanRC, Pipes, RC, joi, moment, statuses;

  RC = require('@leansdk/rc');

  joi = require('joi');

  statuses = require('statuses');

  moment = require('moment');

  ({Declare} = RC.prototype);

  LeanRC = (function() {
    class LeanRC extends RC {};

    LeanRC.inheritProtected();

    LeanRC.root(__dirname);

    LeanRC.util({joi});

    LeanRC.util({statuses});

    LeanRC.util({moment});

    LeanRC.const({
      HANDLER_RESULT: 'HANDLER_RESULT' //Symbol 'HANDLER_RESULT'
    });

    LeanRC.const({
      RECORD_CHANGED: 'RECORD_CHANGED' //Symbol 'RECORD_CHANGED'
    });

    LeanRC.const({
      CONFIGURATION: 'ConfigurationProxy'
    });

    LeanRC.const({
      STARTUP: 'STARTUP' //Symbol 'startup' # для сигнала
    });

    LeanRC.const({
      MIGRATE: 'MIGRATE' //Symbol 'migrate' # для сигнала
    });

    LeanRC.const({
      ROLLBACK: 'ROLLBACK' //Symbol 'rollback' # для сигнала
    });

    LeanRC.const({
      STOPPED_MIGRATE: 'STOPPED_MIGRATE' //Symbol 'stopped_migrate' # для сигнала
    });

    LeanRC.const({
      STOPPED_ROLLBACK: 'STOPPED_ROLLBACK' //Symbol 'stopped_rollback' # для сигнала
    });

    LeanRC.const({
      LIGHTWEIGHT: Symbol('LIGHTWEIGHT') // для создания инстанса приложения без свича (для создания изолированной области выполнения)
    });

    LeanRC.const({
      MIGRATIONS: 'MigrationsCollection'
    });

    LeanRC.const({
      SESSIONS: 'SessionsCollection'
    });

    LeanRC.const({
      USERS: 'UsersCollection'
    });

    LeanRC.const({
      SPACES: 'SpacesCollection'
    });

    LeanRC.const({
      ROLES: 'RolesCollection'
    });

    LeanRC.const({
      UPLOADS: 'UploadsCollection'
    });

    LeanRC.const({
      RESQUE: 'ResqueProxy'
    });

    LeanRC.const({
      START_RESQUE: 'START_RESQUE' //Symbol 'start_resque'
    });

    LeanRC.const({
      DELAYED_JOBS_QUEUE: 'delayed_jobs'
    });

    LeanRC.const({
      DELAYED_JOBS_SCRIPT: 'DelayedJobScript'
    });

    LeanRC.const({
      DEFAULT_QUEUE: 'default'
    });

    LeanRC.const({
      JOB_RESULT: 'JOB_RESULT' //Symbol 'JOB_RESULT'
    });

    LeanRC.const({
      SHELL: 'SHELL' //Symbol 'ShellApplication'
    });

    LeanRC.const({
      APPLICATION_MEDIATOR: 'ApplicationMediator'
    });

    LeanRC.const({
      APPLICATION_ROUTER: 'ApplicationRouter'
    });

    LeanRC.const({
      APPLICATION_RENDERER: 'ApplicationRenderer'
    });

    LeanRC.const({
      APPLICATION_SWITCH: 'ApplicationSwitch'
    });

    LeanRC.const({
      APPLICATION_GATEWAY: 'ApplicationGateway'
    });

    LeanRC.const({
      RESQUE_EXECUTOR: 'ResqueExecutor'
    });

    LeanRC.const({
      LOG_MSG: 'LOG_MSG' //Symbol 'logMessage'
    });

    LeanRC.const({
      PRODUCTION: 'production'
    });

    LeanRC.const({
      DEVELOPMENT: 'development'
    });

    LeanRC.defineType(Declare('PropertyDefinitionT'));

    LeanRC.defineType(Declare('RelationOptionsT'));

    LeanRC.defineType(Declare('RelationConfigT'));

    LeanRC.defineType(Declare('RelationInverseT'));

    LeanRC.defineType(Declare('EmbedOptionsT'));

    LeanRC.defineType(Declare('EmbedConfigT'));

    LeanRC.defineType(Declare('AttributeOptionsT'));

    LeanRC.defineType(Declare('AttributeConfigT'));

    LeanRC.defineType(Declare('ComputedOptionsT'));

    LeanRC.defineType(Declare('ComputedConfigT'));

    LeanRC.defineType(Declare('MakeSignatureInterface'));

    LeanRC.defineType(Declare('ApplicationInterface'));

    LeanRC.defineType(Declare('CollectionInterface'));

    LeanRC.defineType(Declare('CommandInterface'));

    LeanRC.defineType(Declare('ConfigurationInterface'));

    LeanRC.defineType(Declare('ContextInterface'));

    LeanRC.defineType(Declare('CookiesInterface'));

    LeanRC.defineType(Declare('CursorInterface'));

    LeanRC.defineType(Declare('QueueInterface'));

    LeanRC.defineType(Declare('EndpointInterface'));

    LeanRC.defineType(Declare('FacadeInterface'));

    LeanRC.defineType(Declare('GatewayInterface'));

    LeanRC.defineType(Declare('MediatorInterface'));

    LeanRC.defineType(Declare('MigrationInterface'));

    LeanRC.defineType(Declare('NotificationInterface'));

    LeanRC.defineType(Declare('NotifierInterface'));

    LeanRC.defineType(Declare('ObserverInterface'));

    LeanRC.defineType(Declare('ObjectizerInterface'));

    LeanRC.defineType(Declare('ProxyInterface'));

    LeanRC.defineType(Declare('QueryInterface'));

    LeanRC.defineType(Declare('RecordInterface'));

    LeanRC.defineType(Declare('RendererInterface'));

    LeanRC.defineType(Declare('RequestInterface'));

    LeanRC.defineType(Declare('ResourceInterface'));

    LeanRC.defineType(Declare('ResponseInterface'));

    LeanRC.defineType(Declare('ResqueInterface'));

    LeanRC.defineType(Declare('RouterInterface'));

    LeanRC.defineType(Declare('ScriptInterface'));

    LeanRC.defineType(Declare('SerializerInterface'));

    LeanRC.defineType(Declare('SwitchInterface'));

    LeanRC.defineType(Declare('TransformInterface'));

    LeanRC.defineType(Declare('CrudableInterface'));

    LeanRC.defineType(Declare('IterableInterface'));

    LeanRC.defineType(Declare('QueryableCollectionInterface'));

    LeanRC.defineType(Declare('RelatableInterface'));

    LeanRC.defineType(Declare('DelayableInterface'));

    LeanRC.defineType(Declare('EmbeddableInterface'));

    LeanRC.defineType(Declare('ControllerInterface'));

    LeanRC.defineType(Declare('ModelInterface'));

    LeanRC.defineType(Declare('ViewInterface'));

    require('./types/JoiT')(LeanRC);

    require('./types/MomentT')(LeanRC);

    require('./types/PropertyDefinitionT')(LeanRC);

    require('./types/RelationOptionsT')(LeanRC);

    require('./types/RelationConfigT')(LeanRC);

    require('./types/RelationInverseT')(LeanRC);

    require('./types/EmbedOptionsT')(LeanRC);

    require('./types/EmbedConfigT')(LeanRC);

    require('./interfaces/patterns/NotifierInterface')(LeanRC);

    require('./interfaces/patterns/TransformInterface')(LeanRC);

    require('./interfaces/patterns/MakeSignatureInterface')(LeanRC);

    require('./types/AttributeOptionsT')(LeanRC);

    require('./types/AttributeConfigT')(LeanRC);

    require('./types/ComputedOptionsT')(LeanRC);

    require('./types/ComputedConfigT')(LeanRC);

    require('./interfaces/patterns/ApplicationInterface')(LeanRC);

    require('./interfaces/patterns/CommandInterface')(LeanRC);

    require('./interfaces/patterns/ContextInterface')(LeanRC);

    require('./interfaces/patterns/CookiesInterface')(LeanRC);

    require('./interfaces/patterns/CursorInterface')(LeanRC);

    require('./interfaces/patterns/QueueInterface')(LeanRC);

    require('./interfaces/patterns/EndpointInterface')(LeanRC);

    require('./interfaces/patterns/FacadeInterface')(LeanRC);

    require('./interfaces/patterns/MediatorInterface')(LeanRC);

    require('./interfaces/patterns/NotificationInterface')(LeanRC);

    require('./interfaces/patterns/ObserverInterface')(LeanRC);

    require('./interfaces/patterns/ObjectizerInterface')(LeanRC);

    require('./interfaces/patterns/ProxyInterface')(LeanRC);

    require('./interfaces/patterns/CollectionInterface')(LeanRC);

    require('./interfaces/patterns/ConfigurationInterface')(LeanRC);

    require('./interfaces/patterns/GatewayInterface')(LeanRC);

    require('./interfaces/patterns/QueryInterface')(LeanRC);

    require('./interfaces/patterns/RecordInterface')(LeanRC);

    require('./interfaces/patterns/MigrationInterface')(LeanRC);

    require('./interfaces/patterns/RendererInterface')(LeanRC);

    require('./interfaces/patterns/RequestInterface')(LeanRC);

    require('./interfaces/patterns/ResourceInterface')(LeanRC);

    require('./interfaces/patterns/ResponseInterface')(LeanRC);

    require('./interfaces/patterns/ResqueInterface')(LeanRC);

    require('./interfaces/patterns/RouterInterface')(LeanRC);

    require('./interfaces/patterns/ScriptInterface')(LeanRC);

    require('./interfaces/patterns/SerializerInterface')(LeanRC);

    require('./interfaces/patterns/SwitchInterface')(LeanRC);

    require('./interfaces/patterns/CrudableInterface')(LeanRC);

    require('./interfaces/patterns/IterableInterface')(LeanRC);

    require('./interfaces/patterns/QueryableCollectionInterface')(LeanRC);

    require('./interfaces/patterns/RelatableInterface')(LeanRC);

    require('./interfaces/patterns/DelayableInterface')(LeanRC);

    require('./interfaces/patterns/EmbeddableInterface')(LeanRC);

    require('./interfaces/core/ControllerInterface')(LeanRC);

    require('./interfaces/core/ModelInterface')(LeanRC);

    require('./interfaces/core/ViewInterface')(LeanRC);

    require('./utils/jwt')(LeanRC);

    require('./utils/crypto')(LeanRC);

    require('./mixins/ConfigurableMixin')(LeanRC);

    require('./mixins/RelationsMixin')(LeanRC);

    require('./mixins/DelayableMixin')(LeanRC);

    require('./mixins/MakeSignatureMixin')(LeanRC);

    require('./patterns/iterator/Cursor')(LeanRC);

    require('./patterns/data_mapper/Transform')(LeanRC);

    require('./patterns/data_mapper/StringTransform')(LeanRC);

    require('./patterns/data_mapper/NumberTransform')(LeanRC);

    require('./patterns/data_mapper/DateTransform')(LeanRC);

    require('./patterns/data_mapper/BooleanTransform')(LeanRC);

    require('./patterns/data_mapper/ObjectTransform')(LeanRC);

    require('./patterns/data_mapper/ArrayTransform')(LeanRC);

    require('./patterns/data_mapper/ComplexObjectTransform')(LeanRC);

    require('./patterns/data_mapper/ComplexArrayTransform')(LeanRC);

    require('./patterns/data_mapper/Serializer')(LeanRC);

    require('./patterns/data_mapper/Objectizer')(LeanRC);

    require('./patterns/data_mapper/Record')(LeanRC);

    require('./patterns/data_mapper/Queue')(LeanRC);

    require('./patterns/query_object/Query')(LeanRC);

    require('./patterns/observer/Notification')(LeanRC);

    require('./patterns/observer/Notifier')(LeanRC);

    require('./patterns/observer/Observer')(LeanRC);

    require('./patterns/gateway/Endpoint')(LeanRC);

    require('./patterns/proxy/Proxy')(LeanRC);

    require('./patterns/proxy/Collection')(LeanRC);

    require('./patterns/proxy/Configuration')(LeanRC);

    require('./patterns/proxy/Gateway')(LeanRC);

    require('./patterns/proxy/Renderer')(LeanRC);

    require('./patterns/proxy/Router')(LeanRC);

    require('./patterns/proxy/Resque')(LeanRC);

    require('./mixins/NamespacedGatewayMixin')(LeanRC);

    require('./mixins/ModelingGatewayMixin')(LeanRC);

    require('./mixins/CrudEndpointMixin')(LeanRC);

    require('./mixins/HttpCollectionMixin')(LeanRC);

    require('./mixins/HttpSerializerMixin')(LeanRC);

    require('./mixins/MemoryCollectionMixin')(LeanRC);

    require('./mixins/GenerateAutoincrementIdMixin')(LeanRC);

    require('./mixins/GenerateUuidIdMixin')(LeanRC);

    require('./mixins/MemoryResqueMixin')(LeanRC);

    require('./mixins/MemoryConfigurationMixin')(LeanRC);

    require('./mixins/IterableMixin')(LeanRC);

    require('./mixins/QueryableCollectionMixin')(LeanRC);

    require('./mixins/ThinHttpCollectionMixin')(LeanRC);

    require('./mixins/SchemaModuleMixin')(LeanRC);

    require('./mixins/CrudRendererMixin')(LeanRC); // needs test

    require('./mixins/TemplatableModuleMixin')(LeanRC); // needs test

    require('./mixins/NamespaceModuleMixin')(LeanRC); // needs test

    require('./mixins/EmbeddableRecordMixin')(LeanRC); // needs test

    require('./patterns/gateway/CreateEndpoint')(LeanRC);

    require('./patterns/gateway/DetailEndpoint')(LeanRC);

    require('./patterns/gateway/ListEndpoint')(LeanRC);

    require('./patterns/gateway/UpdateEndpoint')(LeanRC);

    require('./patterns/gateway/DeleteEndpoint')(LeanRC);

    require('./patterns/gateway/DestroyEndpoint')(LeanRC);

    require('./patterns/gateway/CountEndpoint')(LeanRC);

    require('./patterns/gateway/LengthEndpoint')(LeanRC);

    require('./patterns/gateway/BulkDeleteEndpoint')(LeanRC);

    require('./patterns/gateway/BulkDestroyEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingCreateEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingDetailEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingListEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingUpdateEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingDeleteEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingDestroyEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingBulkDeleteEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingBulkDestroyEndpoint')(LeanRC);

    require('./patterns/gateway/ModelingQueryEndpoint')(LeanRC);

    require('./patterns/switch/Request')(LeanRC);

    require('./patterns/switch/Response')(LeanRC);

    require('./patterns/switch/Cookies')(LeanRC);

    require('./patterns/switch/Context')(LeanRC);

    require('./patterns/mediator/Mediator')(LeanRC);

    require('./patterns/mediator/Switch')(LeanRC);

    require('./patterns/command/SimpleCommand')(LeanRC);

    require('./patterns/command/MacroCommand')(LeanRC);

    require('./patterns/command/Resource')(LeanRC);

    require('./patterns/command/MigrateCommand')(LeanRC);

    require('./patterns/command/RollbackCommand')(LeanRC);

    require('./patterns/command/Script')(LeanRC);

    require('./patterns/command/DelayedJobScript')(LeanRC);

    require('./mixins/ApplicationMediatorMixin')(LeanRC); // needs test

    require('./mixins/MemoryExecutorMixin')(LeanRC);

    require('./mixins/BodyParseMixin')(LeanRC);

    require('./mixins/CheckSessionsMixin')(LeanRC);

    require('./mixins/QueryableResourceMixin')(LeanRC); // needs test

    require('./mixins/GlobalingResourceMixin')(LeanRC); // needs test

    require('./mixins/GuestingResourceMixin')(LeanRC); // needs test

    require('./mixins/SharingResourceMixin')(LeanRC); // needs test

    require('./mixins/AdminingResourceMixin')(LeanRC); // needs test

    require('./mixins/PersoningResourceMixin')(LeanRC); // needs test

    require('./mixins/ModelingResourceMixin')(LeanRC); // needs test

    require('./mixins/EditableResourceMixin')(LeanRC); // needs test

    require('./mixins/BulkMethodsRendererMixin')(LeanRC); // needs test

    require('./mixins/BulkMethodsResourceMixin')(LeanRC); // needs test

    require('./mixins/BulkMethodsCollectionMixin')(LeanRC); // needs test

    require('./mixins/CountMethodsRendererMixin')(LeanRC); // needs test

    require('./mixins/CountMethodsResourceMixin')(LeanRC); // needs test

    require('./patterns/migration/Migration')(LeanRC);

    require('./mixins/MemoryMigrationMixin')(LeanRC);

    require('./patterns/facade/Facade')(LeanRC);

    require('./core/View')(LeanRC);

    require('./core/Model')(LeanRC);

    require('./core/Controller')(LeanRC);

    return LeanRC;

  }).call(this);

  LeanRC.initialize();

  Pipes = (function() {
    class Pipes extends LeanRC {};

    Pipes.inheritProtected();

    Pipes.root(__dirname);

    Pipes.defineType(Declare('PipeAwareInterface'));

    Pipes.defineType(Declare('PipeFittingInterface'));

    Pipes.defineType(Declare('PipeMessageInterface'));

    require('./interfaces/patterns/PipeAwareInterface')(Pipes);

    require('./interfaces/patterns/PipeFittingInterface')(Pipes);

    require('./interfaces/patterns/PipeMessageInterface')(Pipes);

    require('./patterns/pipes/Pipe')(Pipes);

    require('./patterns/pipes/PipeMessage')(Pipes);

    require('./patterns/pipes/PipeListener')(Pipes);

    require('./patterns/pipes/FilterControlMessage')(Pipes);

    require('./patterns/pipes/Filter')(Pipes);

    require('./patterns/pipes/Junction')(Pipes);

    require('./patterns/pipes/JunctionMediator')(Pipes);

    require('./patterns/pipes/PipeAwareModule')(Pipes);

    require('./patterns/pipes/LineControlMessage')(Pipes);

    require('./patterns/pipes/Line')(Pipes);

    require('./patterns/pipes/TeeMerge')(Pipes);

    require('./patterns/pipes/TeeSplit')(Pipes);

    return Pipes;

  }).call(this);

  Pipes.initialize();

  LeanRC.const({
    Pipes: Pipes.freeze()
  });

  require('./patterns/facade/Application')(LeanRC);

  require('./patterns/command/LogMessageCommand')(LeanRC);

  require('./patterns/data_mapper/LogMessage')(LeanRC);

  require('./patterns/data_mapper/LogFilterMessage')(LeanRC);

  require('./mixins/LoggingJunctionMixin')(LeanRC);

  module.exports = LeanRC.freeze();

}).call(this);
