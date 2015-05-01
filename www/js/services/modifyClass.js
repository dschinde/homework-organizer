'use strict';

angular.module('hwo').service('modifyClass', ModifyClass);

function ModifyClass($rootScope, $ionicModal, Class) {
    var $scope = $rootScope.$new(),
        templateUrl = 'templates/insert-class.html',
        animation = 'slide-in-up';
        
    $scope.close = function () {
        if ($scope.modal) {
            $scope.modal.remove();
            $scope.modal = null;
            $scope.klass = undefined;
        }
    };
    
    $scope.isEditing = function () {
        return $scope.klass && $scope.klass.editing;
    };
    
    $scope.submit = function (klass) {
        var promise = $scope.isEditing() ? klass.save() : Class.insert(klass);
        
        promise.then(function () {
            $scope.close();
        }, function (e) {
            alert(e.message);
        });
    };
    
    this.modals = {
        edit: function (klass) {
            open(klass);
        },
        insert: function () {
            open();
        }
    };
    
    function open(klass) {
        $ionicModal.fromTemplateUrl(templateUrl, { 
            scope: $scope,
            animation: animation,
            backdropClickToClose: false
        }).then(function (modal) {
            if (klass) $scope.klass = klass.edit();
            $scope.modal = modal;
            
            modal.show();
        });
    }
}