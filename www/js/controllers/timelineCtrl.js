'use strict';

angular.module('hwo').controller('TimelineCtrl', TimelineCtrl);

function TimelineCtrl($scope, database) {
    var filter = {
    
    };
    
    $scope.setCompleted = function (assignment) {
        database.setAssignmentCompleted(assignment.id, assignment.completed);
    };
    
    database.getAssignments(filter).then(function (assignments) {
        var firstDate = assignments[0].dueDateTime,
            lastDate = assignments[assignments.length - 1].dueDateTime,
            length = assignments.length;
        
        var weeks = createWeeks(firstDate, lastDate);
        
        for (var i = 0; i < length; i++) {
            var assignment = assignments[i];
            var day = weeks.getDay(assignment.dueDateTime);
            day.assignments.push(assignment);
        }
        
        $scope.weeks = weeks;
    });
    
    
    function getStartOfWeek(date) {
        var dayOfWeek = date.getDay();
        return new Date(
            date.getFullyYear(),
            date.getMonth(),
            date.getDate() - dayOfWeek);
    }
    
    function createWeek(startDate) {
        return {
            start: new Date(startDate.valueOf()),
            sunday: {
                date: new Date(startDate.valueOf()),
                assignments: []
            },
            monday: {
                date: new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + 1),
                assignments: []
            },
            tuesday: {
                date: new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + 2),
                assignments: []
            },
            wednesday: {
                date: new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + 3),
                assignments: []
            },
            thursday: {
                date: new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + 4),
                assignments: []
            },
            friday: {
                date: new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + 5),
                assignments: []
            },
            saturday: {
                date: new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + 6),
                assignments: []
            }
        };
    }
    
    function createWeeks(firstDate, lastDate) {
        var firstWeekStart = getStartOfWeek(firstDate),
            lastWeekStart = getStartOfWeek(lastDate),
            weeks = [];
            
        var weekStart = firstWeekStart;
        
        while (!isSameDay(weekStart, lastWeekStart)) {
            weeks.push(createWeek(weekStart));
            weekStart.setDate(weekStart.getDate() + 7);
        }
        
        weeks.getDay = function (date) {
            var first = this[0];
            
            if (first.date.valueOf() < date.valueOf()) {
                var diff = (date - first.date) / (1000 * 60 * 60 * 24);
                var index = Math.floor(diff / 7);
                
                if (index < this.length) {
                    var week = this[index];
                    
                    switch (date.getDay()) {
                        case 0: return week.sunday;
                        case 1: return week.monday;
                        case 2: return week.tuesday;
                        case 3: return week.wednesday;
                        case 4: return week.thursday;
                        case 5: return week.friday;
                        case 6: return week.saturday;
                    } // switch (date.getDay())
                } // if (index < this.length)
            } // if (first.date.valueOf() < date.valueOf())
        } // weeks.getDay
        
        return weeks;
    }
    
    function isSameDay(x, y) {
        return x.getDate() === y.getDate()
            && x.getMonth() === y.getMonth()
            && x.getFullYear() === y.getFullYear();
    }
}