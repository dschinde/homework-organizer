'use strict';

angular.module('hwo').controller('ClassListCtrl', ClassListCtrl);

function ClassListCtrl($scope, $state, $ionicPopup, $q, modifyClass, Class, Assignment) {
    loadClasses();

    var editPromise = $q.when();
    
    $scope.assignments = assignments;
    $scope.delete = deleteClass;
    $scope.move = move;
    $scope.toggleEditing = toggleEditing;
    $scope.modals = {
        edit: function(klass) {
            editPromise.then(function(){
                return modifyClass.modals.edit(klass);
            });
        },
        insert: function () {
            modifyClass.modals.insert().then(loadClasses);
        }

    };
    
    function assignments(klass) {
        $state.go('assignments', { classId: klass.id });
    }
    
    function deleteClass($event, klass) {
        editPromise = $ionicPopup.confirm({
            title: 'HWTracker',
            template: 'Are you sure you want to delete the class?'
        }).then(function(res) {
            if(res){
                var classes = $scope.classes;
                var length = classes.length;
                for (var i = klass.index + 1; i < length; i++) {
                    var other = classes[i];
                    other.index--;
                }
        
                klass.delete();
                classes.splice(klass.index, 1);
            }
            editPromise = $q.when();
            return $q.reject();
        });
    }

//    function deleteClass($event, klass) {
//        if(confirm("Are you sure you want to delete the class?")){
//            var classes = $scope.classes;
//            var length = classes.length;
//            for (var i = klass.index + 1; i < length; i++) {
//                var other = classes[i];
//                other.index--;
//            }
//            
//            klass.delete();
//            classes.splice(klass.index, 1);
//        } else {
//            $event.preventDefault();
//        }
//    }
    
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