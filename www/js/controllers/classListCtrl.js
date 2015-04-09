'use strict';

angular.module('hwo').controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, database) {
    database.getClasses().then(function (classes) {
        $scope.classes = classes;
    }, function (e) {
        alert(e.message);
    });
}