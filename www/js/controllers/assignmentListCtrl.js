'use strict';

angular.module('hwo').controller('AssignmentListCtrl', AssignmentListCtrl);

function AssignmentListCtrl($scope, Assignment, modifyAssignment, klass) {
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
        assignment.delete().then(loadAssignments);
    };
   
    function loadAssignments() {
        Assignment.get(filter).then(function (assignments) {
            $scope.dateGroups = groupByDate(assignments);
            
            
            var data = assignments.reduce(function (data, assignment) {
                if (data.first) {
                    var day = new Day(assignment.dueDateTime);
                    var week = new Week(day);
                    
                    day.assignments.push(assignment);
                    
                    data.day = day;
                    data.week = week;
                    data.weeks.push(week);
                    data.first = false;
                } else {
                    var day = data.day;
                    if (isSameDay(day.date, assignment.dueDateTime)) {
                        day.assignments.push(assignment);
                    } else {
                        var week = data.week;
                        day = new Day(assignment.dueDateTime);
                        day.assignments.push(assignment);
                        
                        data.day = day;
                        
                        if (week.contains(day.date)) {
                            week.days.push(day);
                        } else {
                            week = new Week(day);
                            data.week = week;
                            data.weeks.push(week);
                        }
                    }
                }
                
                return data;
            }, { weeks: [], first: true });
            
            $scope.weeks = data.weeks;
        }, function (e) {
            alert(e.message);
        });
    }
    
    function Week(day) {
        var date = day.date;
        this.start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        this.end = new Date(this.start.valueOf());
        this.end.setDate(this.end.getDate() + 7);
        this.days = [];
        this.contains = function (date) {
            return this.start.valueOf() <= date.valueOf()
                && this.end.valueOf() <= date.valueOf();
        };
    }
    
    function Day(date) {
        this.date = date;
        this.assignments = [];
    }
    
    function isSameDay(x, y) {
        return !!x && !!y
            && x.getDate() === y.getDate()
            && x.getMonth() === y.getMonth()
            && x.getFullYear() === y.getFullYear();
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
        
        
        
        function createGroup(assignment) {
            return {
                date: assignment.dueDateTime,
                assignments: [ assignment ]
            };
        }
    }
}
