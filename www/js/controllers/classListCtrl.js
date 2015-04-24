'use strict';

angular.module('hwo').controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, $state, Class, Assignment) {
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
    
    $scope.assignments = assignments;
    $scope.toggleEditing = toggleEditing;
    $scope.move = move;
    $scope.delete = deleteClass; 
    
    
    function assignments(klass) {
        $state.go('assignments', { classId: klass.id });
    }
    
    function toggleEditing() {
        $scope.editing = !$scope.editing;
    }
    
    function move(klass, fromIndex, toIndex) {
        if (fromIndex !== toIndex) {
            var classes = $scope.classes;
            
            if (fromIndex < toIndex) {
                for (var i = fromIndex + 1; i <= toIndex; i++) {
                    var other = classes[i];
                    other.index--;
                }
            } else {
                for (var i = toIndex; i < fromIndex; i++) {
                    var other = classes[i];
                    other.index++;
                }
            }
            
            klass.index = toIndex;
            classes.splice(fromIndex, 1);
            classes.splice(toIndex, 0, klass);
        }
    }
    
    function deleteClass(klass) {
        var classes = $scope.classes;
        var length = classes.length;
        for (var i = klass.index + 1; i < length; i++) {
            var other = classes[i];
            other.index--;
        }
        
        klass.delete();
        classes.splice(klass.index, 1);
    }
}