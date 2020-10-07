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
    var AnyT, FuncG, ListG, LogMessage, MaybeG, PipeMessage;
    ({AnyT, FuncG, ListG, MaybeG} = Module.prototype);
    ({PipeMessage} = Module.prototype.Pipes.prototype);
    return LogMessage = (function() {
      class LogMessage extends PipeMessage {};

      LogMessage.inheritProtected();

      LogMessage.module(Module);

      LogMessage.public(LogMessage.static({
        DEBUG: Number
      }, {
        default: 5
      }));

      LogMessage.public(LogMessage.static({
        INFO: Number
      }, {
        default: 4
      }));

      LogMessage.public(LogMessage.static({
        WARN: Number
      }, {
        default: 3
      }));

      LogMessage.public(LogMessage.static({
        ERROR: Number
      }, {
        default: 2
      }));

      LogMessage.public(LogMessage.static({
        FATAL: Number
      }, {
        default: 1
      }));

      LogMessage.public(LogMessage.static({
        NONE: Number
      }, {
        default: 0
      }));

      LogMessage.public(LogMessage.static({
        CHANGE: Number
      }, {
        default: -1
      }));

      LogMessage.public(LogMessage.static({
        LEVELS: ListG(String)
      }, {
        default: ['NONE', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG']
      }));

      LogMessage.public(LogMessage.static({
        SEND_TO_LOG: String
      }, {
        get: function() {
          return PipeMessage.BASE + 'LoggerModule/sendToLog';
        }
      }));

      LogMessage.public(LogMessage.static({
        STDLOG: String
      }, {
        default: 'standardLog'
      }));

      LogMessage.public({
        logLevel: Number
      }, {
        get: function() {
          return this.getHeader().logLevel;
        },
        set: function(logLevel) {
          var header;
          header = this.getHeader();
          header.logLevel = logLevel;
          this.setHeader(header);
          return logLevel;
        }
      });

      LogMessage.public({
        sender: String
      }, {
        get: function() {
          return this.getHeader().sender;
        },
        set: function(sender) {
          var header;
          header = this.getHeader();
          header.sender = sender;
          this.setHeader(header);
          return sender;
        }
      });

      LogMessage.public({
        time: String
      }, {
        get: function() {
          return this.getHeader().time;
        },
        set: function(time) {
          var header;
          header = this.getHeader();
          header.time = time;
          this.setHeader(header);
          return time;
        }
      });

      LogMessage.public({
        message: MaybeG(AnyT)
      }, {
        get: function() {
          return this.getBody();
        }
      });

      LogMessage.public({
        init: FuncG([Number, String, AnyT])
      }, {
        default: function(logLevel, sender, message) {
          var headers, time;
          time = new Date().toISOString();
          headers = {logLevel, sender, time};
          this.super(PipeMessage.NORMAL, headers, message);
        }
      });

      LogMessage.initialize();

      return LogMessage;

    }).call(this);
  };

}).call(this);
