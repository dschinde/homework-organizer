'use strict';

var module = angular.module('hwo');
module.controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, database) {{};
    database.getClasses().then(function (classes) {
        $scope.classes = classes;
    }, function (e) {
        alert(e.message);
    });
}