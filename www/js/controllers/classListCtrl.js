'use strict';

var module = angular.module('hwo');
module.controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, database, colors) {
    $scope.textColor = function (color) {
        return colors.getTextColor(color);
    };
    
    database.getClasses().then(function (classes) {
        $scope.classes = classes;
    }, function (e) {
        alert(e.message);
    });
}