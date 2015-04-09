'use strict';

angular.module('hwo').controller('InsertClassCtrl', InsertClassCtrl);

function InsertClassCtrl($scope, $ionicHistory, database) {
    $scope.submit = function (klass) {
        database.insertClass(klass).then(function () {
            $ionicHistory.goBack();
        }, function (e) {
            alert(e.message);
        });
    };
    
    $scope.cancel = function () {
        $ionicHistory.goBack();
    };
}