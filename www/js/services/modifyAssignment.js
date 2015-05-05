'use strict';

angular.module('hwo').service('modifyAssignment', ModifyAssignment);

function ModifyAssignment($q, $rootScope, $ionicModal, Assignment, Class) {
    var $scope = $rootScope.$new(),
        templateUrl = 'templates/insert-assignment.html',
        animation = 'slide-in-up';
        
    
    
    $scope.isEditing = function () {
        return $scope.assignment && $scope.assignment.editing;
    };
    
    $scope.submit = function (assignment) {
        var promise = $scope.isEditing() ? assignment.save() : Assignment.insert(assignment);
        
        promise.then(function () {
            $scope.close();
        }, function (e) {
            alert(e.message);
        });
    };
    
    this.modals = {
        edit: function (assignment) {
            return open(null, assignment);
        },
        insert: function (klass) {
            return open(klass);
        }
    };
    
    function open(klass, assignment) {
        return $q(function (resolve, reject) {
            return $ionicModal.fromTemplateUrl(templateUrl, { 
                scope: $scope,
                animation: animation,
                backdropClickToClose: false
            }).then(function (modal) {
                if (assignment) {
                    $scope.assignment = assignment.edit();
                } else {
                    $scope.assignment = {};
                    if (klass) $scope.assignment.classId = klass.id;
                }
                
                Class.get().then(function (classes) {
                    $scope.classes = classes;
                });
                
                $scope.modal = modal;
                $scope.klass = klass;
                
                $scope.close = function () {
                    $scope.modal.remove();
                    $scope.modal = null;
                    $scope.klass = undefined;
                    $scope.classes = undefined;
                    $scope.assignment = undefined;
                    resolve();
                };
                
                modal.show();
            });
        });
        
    }
}