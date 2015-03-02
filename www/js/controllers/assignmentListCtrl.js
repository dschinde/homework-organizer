'use strict';

var module = angular.module('hwo');
module.controller('AssignmentListCtrl', AssignmentListCtrl);


function AssignmentListCtrl($scope, database, klass) {
    // klass is resolved in the state config for assignmentList
    
    var filter = { excludeCompleted: true };
    if (klass) {
        $scope.klass = klass;
        
        filter.classId = klass.id;
    }
    
    database.getAssignments(filter).then(function (assignments) {
        $scope.assignments = assignments;
        $scope.dateGroups = groupByDate(assignments);
    }, function (e) {
        alert(e.message);
    });
    
    
    
    
    function groupByDate(assignments) {
        if (assignments.length === 0) return [];
        
        var groups = [];
        var current = createGroup(assignments[0]);
        
        for (var i = 1; i < assignments.length; i++) {
            var assignment = assignments[i];
            if (isSameDay(current.date, assignment.dueDateTime)) {
                current.assignments.push(assignment);
            } else {
                groups.push(current);
                current = createGroup(assignment[i]);
            }
        }
        
        groups.push(current);
        
        return groups;
        
        function isSameDay(x, y) {
            return x.getDate() === y.getDate()
                && x.getMonth() === y.getMonth()
                && x.getFullYear() === y.getFullYear();
        }
        
        function createGroup(assignment) {
            var date = new Date(
                assignment.dueDateTime.getFullYear(),
                assignment.dueDateTime.getMonth(),
                assignment.dueDateTime.getDay());
            
            return {
                date: date,
                assignments: [ assignment ]
            };
        }
    }
}
