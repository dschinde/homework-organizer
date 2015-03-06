var isDefined = angular.isDefined;

angular.module('hwo', [
    'ionic',
    'hwo.data',
    'hwo.templates' // Generated during build
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
    
    .state('assignmentList', {
        url: '/assignmentList?classId&className',
        templateUrl: 'templates/assignment-list.html',
        resolve: {
            klass: function ($stateParams) {
                if (!isDefined($stateParams.classId)) {
                    return null;
                }
                
                return { id: $stateParams.classId, name: $stateParams.className };
            }
        },
        controller: 'AssignmentListCtrl',
        cache: false
    })
    .state('insertAssignment', {
        url: '/insertAssignment?classId&className',
        templateUrl: 'templates/insert-assignment.html',
        resolve: {
            klass: function ($stateParams) {
                if (!isDefined($stateParams.classId)) {
                    return null;
                }
                
                return { id: $stateParams.classId, name: $stateParams.className };
            }
        },
        controller: 'InsertAssignmentCtrl'
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
