'use strict';

angular.module('hwo').controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, Class, Assignment) {
    var filter = {};

    Class.get().then(function (classes) {
        $scope.classes = classes;
        
        classes.map(function (klass) {
            return Assignment.get({
                classId: klass.id,
                limit: 3
            }).then(function (assignments) {
                klass.assignments = assignments;
            });
        });
    }, function (e) {
        alert(e.message);
    });
}