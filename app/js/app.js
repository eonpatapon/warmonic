'use strict';

angular.module('warmonic', [
  'ui.router',
  'warmonic.lib.utils',
  'warmonic.lib.xmpp',
  'warmonic.lib.xmpp.roster',
  'warmonic.lib.xmpp.commands',
  'warmonic.lib.logger',
  'warmonic.provides',
  'warmonic.build',
]).

run(['$rootScope', '$state', '$stateParams', 'xmpp', function($rootScope, $state, $stateParams, xmpp) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $state.go('login')
  xmpp.attach();
}]).

config(['$stateProvider', '$httpProvider', function($stateProvider, $httpProvider) {
  $stateProvider

  .state('login', {
     url: '/login',
     templateUrl: "partials/login.html"
  })

  .state('provides', {
    url: '/provides',
    templateUrl: 'partials/provides.html'
  })

  .state('build', {
    url: '/build?provide',
    templateUrl: 'partials/build.html'
  })

}]);