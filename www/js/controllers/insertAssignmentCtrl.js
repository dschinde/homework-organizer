'use strict';

var module = angular.module('hwo');
module.controller('InsertAssignmentCtrl', InsertAssignmentCtrl);

function InsertAssignmentCtrl($scope, $ionicHistory, database, klass) {
    // klass is resolved in the state config for assignmentList
    $scope.assignment = {};
    
    if (klass !== null) {
        $scope.assignment.classId = klass.id;
    }
    
    database.getClasses().then(function (classes) {
        $scope.classes = classes;
    });
    
    $scope.submit = function (assignment) {
        database.insertAssignment(assignment).then(function () {
            $ionicHistory.goBack();
        }, function (e) {
            alert(e.message);
        });
    };
    
    $scope.cancel = function () {
        $ionicHistory.goBack();
    };
}