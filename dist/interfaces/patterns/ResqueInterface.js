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
  module.exports = function(Module) {
    var AnyT, FuncG, ListG, MaybeG, ProxyInterface, QueueInterface, ResqueInterface, StructG, UnionG;
    ({AnyT, FuncG, ListG, StructG, MaybeG, UnionG, QueueInterface, ProxyInterface} = Module.prototype);
    return ResqueInterface = (function() {
      class ResqueInterface extends ProxyInterface {};

      ResqueInterface.inheritProtected();

      ResqueInterface.module(Module);

      ResqueInterface.virtual({
        tmpJobs: ListG(StructG({
          queueName: String,
          scriptName: String,
          data: AnyT,
          delay: MaybeG(Number),
          id: String
        }))
      });

      ResqueInterface.virtual({
        fullQueueName: FuncG(String, String)
      });

      ResqueInterface.virtual(ResqueInterface.async({
        create: FuncG([String, MaybeG(Number)], QueueInterface)
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        all: FuncG([], ListG(QueueInterface))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        get: FuncG(String, MaybeG(QueueInterface))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        remove: FuncG(String)
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        update: FuncG([String, Number], QueueInterface)
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        delay: FuncG([String, String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        getDelayed: FuncG([], ListG(StructG({
          queueName: String,
          scriptName: String,
          data: AnyT,
          delay: MaybeG(Number),
          id: String
        })))
      }));

      //=============== Must be realized in mixin =========
      ResqueInterface.virtual(ResqueInterface.async({
        ensureQueue: FuncG([String, MaybeG(Number)], StructG({
          name: String,
          concurrency: Number
        }))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        getQueue: FuncG(String, MaybeG(StructG({
          name: String,
          concurrency: Number
        })))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        removeQueue: FuncG(String)
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        allQueues: FuncG([], ListG(StructG({
          name: String,
          concurrency: Number
        })))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        pushJob: FuncG([String, String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        getJob: FuncG([String, UnionG(String, Number)], MaybeG(Object))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        deleteJob: FuncG([String, UnionG(String, Number)], Boolean)
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        abortJob: FuncG([String, UnionG(String, Number)])
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        allJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        pendingJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        progressJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        completedJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }));

      ResqueInterface.virtual(ResqueInterface.async({
        failedJobs: FuncG([String, MaybeG(String)], ListG(Object))
      }));

      ResqueInterface.initialize();

      return ResqueInterface;

    }).call(this);
  };

}).call(this);
