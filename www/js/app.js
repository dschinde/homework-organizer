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
    
    .state('assignments', {
        url: '/assignments?classId',
        templateUrl: 'templates/assignment-list.html',
        data: {
            filter: {
                excludeCompleted: true
            }
        },
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
    
    .state('assignments.completed', {
        url: '/completed',
        views: {
            '@': {
                controller: 'AssignmentListCtrl',
                templateUrl: 'templates/assignment-list-completed.html',
            }
        },
        data: {
            filter: {
                onlyCompleted: true,
                orderByDate: 'desc'
            }
        },
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
