'use strict';

angular.module('hwo').controller('AssignmentListCtrl', AssignmentListCtrl);

/**
 * Class for controlling assignment list
 */
function AssignmentListCtrl($scope, $state, $ionicPopup, Assignment, modifyAssignment, klass) {
    var isAllAssignmentsView = !klass,
        filter = $state.current.data.filter;
    
    if (!isAllAssignmentsView) {
        $scope.klass = klass;
        filter.classId = klass.id; 
    } else {
        $scope.klass = undefined;
        filter.classId = undefined;
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
        $ionicPopup.confirm({
            title: 'HWTracker',
            template: 'Are you sure you want to delete the assignment?'
        }).then(function(res) {
            if (res) {
                assignment.delete().then(loadAssignments);
            }
        });
    };
   
    function loadAssignments() {
        if (isAllAssignmentsView) {
            Assignment.any().then(function (res) {
                $scope.showImage = !res;
            });
        } else {
            klass.hasAssignments().then(function (res) {
                $scope.showImage = !res;
            });
        }
    
    
        Assignment.get(filter).then(function (assignments) {
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
        this.days = [ day ];
        this.contains = function (date) {
            return this.start.valueOf() <= date.valueOf()
                && date.valueOf() < this.end.valueOf();
        };
    }
    
    function Day(date) {
        this.date = date;
        this.assignments = [];
    }
    
    function isSameDay(x, y) {
        return x.getDate() === y.getDate()
            && x.getMonth() === y.getMonth()
            && x.getFullYear() === y.getFullYear();
    }
}
