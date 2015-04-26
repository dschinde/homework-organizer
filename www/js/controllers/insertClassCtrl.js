'use strict';

angular.module('hwo').controller('InsertClassCtrl', InsertClassCtrl);

function InsertClassCtrl($scope, $ionicHistory, Class) {
    $scope.submit = function (klass) {
        Class.insert(klass).then(function () {
            $ionicHistory.goBack();
        }, function (e) {
            alert("you need to insert class name");
        });
    };
    
    $scope.cancel = function () {
        $ionicHistory.goBack();
    };
}

function ValidateClassName(Class, ProposedClassName) {
    // TODO: Check the database if there is already a klass under this name
    if (Class.)
}