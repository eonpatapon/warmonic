'use strict';

angular.module('warmonic.lib.xmpp.commands', [
  'warmonic.lib.logger',
  'warmonic.lib.xmpp'
])

.provider('commands', {
  provider: null,

  setProvider: function(jid) {
    this.provider = jid;
  },

  $get: ['$q', 'xmpp', 'roster', function($q, xmpp, roster) {

    var commandProvider = this.provider;
    roster.excludeJid(commandProvider);

    return {
      get provider() {
        return commandProvider;
      },

      create: function(cmd) {
        return new Strophe.Commands.RemoteCommand(xmpp._connection, this.provider, cmd);
      },

      execute: function(cmd) {
        var deferResult = $q.defer();
        cmd.execute({
          success: function(result, cmd) {
            deferResult.resolve(cmd);
          },
          error: function(error, cmd) {
            deferResult.reject(cmd);
          }
        });
        return deferResult.promise;
      },

      next: function(cmd, form) {
        var deferResult = $q.defer();
        cmd.next({
          success: function(result, cmd) {
            deferResult.resolve(cmd);
          },
          error: function(error, cmd) {
            deferResult.reject(cmd);
          },
          responseForm: form
        });
        return deferResult.promise;
      },

      complete: function(complete) {
        var deferResult = $q.defer();
        complete.complete({
          success: function(result, cmd) {
            deferResult.resolve(cmd);
          },
          error: function(error, cmd) {
            deferResult.reject(cmd);
          }
        });
        return deferResult.promise;
      },

      prev: function(cmd) {
        var deferResult = $q.defer();
        cmd.prev({
          success: function(result, cmd) {
            deferResult.resolve(cmd);
          },
          error: function(error, cmd) {
            deferResult.reject(cmd);
          }
        });
        return deferResult.promise;
      },

      cancel: function(cmd) {
        var deferResult = $q.defer();
        cmd.cancel({
          success: function(result, cmd) {
            deferResult.resolve(result);
          },
          error: function(error, cmd) {
            deferResult.reject(error);
          }
        });
        return deferResult.promise;
      },

      log: function(cmd) {
        console.log("jid : "+ cmd.jid);
        console.log("node : "+ cmd.node);
        console.log("sesionid : "+ cmd.sessionid);
        console.log("executeAction : "+ cmd.executeAction);
        console.log("status : "+ cmd.status);
        console.log("error : "+ cmd.error);
      },

      get providerOnline() {
        var provider = Strophe.getBareJidFromJid(this.provider);
        return roster.isJidOnline(provider);
      }
    };
  }]
})

.directive('masterStatus', function() {

  return {

    restrict: 'A',

    template: '<span class="btn disabled" ng-class="{\'btn-success\': isOnline(), \'btn-danger\': !isOnline()}">Master {{ isOnline() ? "online" : "offline" }}</span>',

    controller: ['$scope', 'commands', function($scope, commands) {

      $scope.isOnline = function() {
        return commands.providerOnline;
      };

    }]
  };

});
