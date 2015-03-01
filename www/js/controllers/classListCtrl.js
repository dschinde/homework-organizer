'use strict';

var module = angular.module('hwo');
module.controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, database) {
    $scope.data = {};
    database.getClasses().then(function (classes) {
        $scope.data.classes = classes;
    });
}