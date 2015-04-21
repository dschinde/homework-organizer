'use strict';

angular.module('hwo').controller('InsertAssignmentCtrl', InsertAssignmentCtrl);

function InsertAssignmentCtrl($scope, $ionicHistory, Assignment, Class, klass) {
    // klass is resolved in the state config for assignmentList
    $scope.assignment = {};
    
    if (klass !== null) {
        $scope.assignment.classId = klass.id;
    }
    
    Class.get().then(function (classes) {
        $scope.classes = classes;
    });
    
    $scope.submit = function (assignment) {
        Assignment.insert(assignment).then(function () {
            $ionicHistory.goBack();
        }, function (e) {
            alert(e.message);
        });
    };
    
    $scope.cancel = function () {
        $ionicHistory.goBack();
    };
}