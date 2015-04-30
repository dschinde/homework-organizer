var isDefined = angular.isDefined;

angular.module('hwo.data', ['ionic']);
angular.module('hwo.ui', ['hwo.ui.util', 'hwo.data']);
angular.module('hwo.ui.util', ['ionic']);

angular.module('hwo', [
    'ionic',
    'hwo.data',
    'hwo.ui'
])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/classList');
    
    $stateProvider
    .state('classList', {
        url: '/classList',
        templateUrl: 'templates/class-list.html',
        controller: 'ClassListCtrl',
        cache: false
    })
    .state('insertClass', {
        url: '/insertClass',
        templateUrl: 'templates/insert-class.html',
        controller: 'InsertClassCtrl'
    })
    .state('editClass', {
        url: '/editClass?id',
        templateUrl: 'templates/insert-class.html',
        resolve: {
            klass: function ($stateParams, Class) {
                return Class.get($stateParams.id).then(function (klass) {
                    return klass.edit();
                });
            }
        },
        controller: 'EditClassCtrl'
    })
    
    .state('assignments', {
        url: '/assignments?classId',
        templateUrl: 'templates/assignment-list.html',
        resolve: {
            klass: function ($stateParams, Class) {
                if (!$stateParams.classId) {
                    return null;
                } else {
                    return Class.get($stateParams.classId);
                }
            }
        },
        controller: 'AssignmentListCtrl',
        cache: false
    })
    
    .state('insertAssignment', {
        url: '/insertAssignment?classId',
        templateUrl: 'templates/insert-assignment.html',
        resolve: {
            klass: function ($stateParams, Class) {
                if (!$stateParams.classId) {
                    return null;
                } else {
                    return Class.get($stateParams.classId);
                }
            }
        },
        controller: 'InsertAssignmentCtrl'
    })
    .state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl',
        cache: false
    });
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
