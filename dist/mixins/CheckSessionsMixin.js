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
  /*
  example of usage

  ```coffee

  module.exports = (Module)->
    {
      Resource
      BodyParseMixin
      CheckSessionsMixin
    } = Module::

    class UsersResource extends Resource
      @inheritProtected()
      @include BodyParseMixin
      @include CheckSessionsMixin
      @module Module

      @public entityName: String,
        default: 'user'

      @initialHook 'checkSession', only: [
        'list', 'detail', 'update'
      ]
      @initialHook 'parseBody', only: ['create', 'update']
      @initialHook 'checkOwner', only: ['update']

    UsersResource.initialize()

  ```
  */
  module.exports = function(Module) {
    var Mixin, PromiseT, RecordInterface, Resource, SESSIONS, UNAUTHORIZED, USERS, co, statuses;
    ({
      SESSIONS,
      USERS,
      PromiseT,
      RecordInterface,
      Resource,
      Mixin,
      Utils: {statuses, co}
    } = Module.prototype);
    UNAUTHORIZED = statuses('unauthorized');
    return Module.defineMixin(Mixin('CheckSessionsMixin', function(BaseClass = Resource) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public({
          session: RecordInterface
        });

        _Class.public({
          currentUser: PromiseT
        }, {
          get: co.wrap(function*() {
            return (yield this.facade.retrieveProxy(USERS).find(this.session.uid));
          })
        });

        _Class.public(_Class.async({
          makeSession: Function
        }, {
          default: function*() {
            var SessionsCollection, ref, session, sessionCookie;
            SessionsCollection = this.facade.retrieveProxy(SESSIONS);
            if ((sessionCookie = this.context.cookies.get(this.configs.sessionCookie)) != null) {
              session = (yield ((yield SessionsCollection.findBy({
                "@doc.id": sessionCookie
              }))).first());
            }
            if (session != null) {
              if (session.userSpaceId == null) {
                session = (yield ((ref = typeof SessionsCollection.calcComputedsForOne === "function" ? SessionsCollection.calcComputedsForOne(session) : void 0) != null ? ref : session));
              }
            } else {
              session = (yield SessionsCollection.build({}));
            }
            this.context.session = session;
            this.session = session;
          }
        }));

        _Class.public(_Class.async({
          checkSession: Function
        }, {
          default: function*(...args) {
            yield this.makeSession();
            if (this.session.uid == null) {
              this.context.throw(UNAUTHORIZED);
              return;
            }
            // UsersCollection = @facade.retrieveProxy USERS
            // currentUser = yield UsersCollection.find @session.uid
            if (!this.session.userVerified) {
              this.context.throw(UNAUTHORIZED, 'Unverified');
              return;
            }
            // @currentUser = currentUser
            return args;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
