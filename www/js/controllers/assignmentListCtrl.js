'use strict';

angular.module('hwo').controller('AssignmentListCtrl', AssignmentListCtrl);

function AssignmentListCtrl($scope, $state, $ionicPopup, Assignment, modifyAssignment, klass) {
    // klass is resolved in the state config for assignmentList
    
    var isAllAssignmentsView = !klass,
        filter = { };
    
    
    if (!isAllAssignmentsView) {
        $scope.klass = klass;
        filter.classId = klass.id;
    }
    
    loadAssignments();
    
    $scope.modals = {
        edit: function (assignment) {
            if (isAllAssignmentsView) {
                modifyAssignment.modals.edit(assignment);
            } else {
                modifyAssignment.modals.edit(assignment).then(loadAssignments);
            }
        },
        insert: function () {
            modifyAssignment.modals.insert(klass).then(loadAssignments);
        }
    };
    
    $scope.delete = function (assignment) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'HWTracker',
            template: 'Are you sure you want to delete the assignment?'
        });
        confirmPopup.then(function(res) {
            if(res){
                assignment.delete().then(loadAssignments);
            }
        });
    };
   
    function loadAssignments() {
        Assignment.get(filter).then(function (assignments) {
            $scope.dateGroups = groupByDate(assignments);
        }, function (e) {
            alert(e.message);
        });
    }
    
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
                current = createGroup(assignments[i]);
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
            return {
                date: assignment.dueDateTime,
                assignments: [ assignment ]
            };
        }
    }
}
