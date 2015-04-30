'use strict';

angular.module('hwo').controller('EditClassCtrl', EditClassCtrl);

function EditClassCtrl($scope, $ionicHistory, klass) {
    $scope.klass = klass;

    $scope.submit = function () {
        klass.save();
        $ionicHistory.goBack();
    };
    
    $scope.cancel = function () {
        $ionicHistory.goBack();
    };
}