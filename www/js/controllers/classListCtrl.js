'use strict';

angular.module('hwo').controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, $state, modifyClass, Class, Assignment) {
    loadClasses();
    
    $scope.assignments = assignments;
    $scope.delete = deleteClass;
    $scope.move = move;
    $scope.toggleEditing = toggleEditing;
    $scope.modals = {
        edit: modifyClass.modals.edit,
        insert: function () {
            modifyClass.modals.insert().then(loadClasses);
        }
    };
    
    function assignments(klass) {
        $state.go('assignments', { classId: klass.id });
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
    
    function toggleEditing() {
        $scope.editing = !$scope.editing;
    }
    
    function loadClasses() {
        Class.get().then(function (classes) {
        $scope.classes = classes;
        
        classes.map(function (klass) {
            return Assignment.get({
                    classId: klass.id,
                    limit: 3,
                    excludeCompleted: true
                }).then(function (assignments) {
                    klass.assignments = assignments;
                });
            });
        }, function (e) {
            alert(e.message);
        });
    }
}