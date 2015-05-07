'use strict';

angular.module('hwo').service('modifyClass', ModifyClass);

/**
 * Creates modal views for creating or editing classes
 */
function ModifyClass($q, $rootScope, $ionicModal, Class) {
    var $scope = $rootScope.$new(),
        templateUrl = 'templates/insert-class.html',
        animation = 'slide-in-up';
    
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
            return open(klass);
        },
        insert: function () {
            return open();
        }
    };
    
    function open(klass) {
        return $q(function (resolve, reject) {
            return $ionicModal.fromTemplateUrl(templateUrl, { 
                scope: $scope,
                animation: animation,
                backdropClickToClose: false
            }).then(function (modal) {
                if (klass) $scope.klass = klass.edit();
                $scope.modal = modal;
                
                $scope.close = function () {
                    $scope.modal.remove();
                    $scope.modal = null;
                    $scope.klass = undefined;
                    resolve();
                };
                
                modal.show();
            });
        });
    }
}