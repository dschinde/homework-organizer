'use strict';

var module = angular.module('hwo');
module.controller('InsertClassCtrl', InsertClassCtrl);

function InsertClassCtrl($scope, $ionicHistory, database) {
    $scope.submit = function () {
        database.insertClass($scope.klass);
        $ionicHistory.goBack();
    }
    
    $scope.cancel = function () {
        $ionicHistory.goBack();
    }
}