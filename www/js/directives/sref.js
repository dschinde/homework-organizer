'use strict';

angular.module('hwo.ui.util').directive('hwoSref', SRefDirective);

function SRefDirective($state) {
    var copy = angular.copy;

    return {
        restrict: 'A',
        controller: function ($scope, $attrs) {
            var ref = parseRef($attrs.hwoSref),
                args;
            
            if (ref.args) {
                $scope.$watch(ref.args, function (val) {
                    if (val) {
                        args = copy(val);
                    }
                }, true);
                
                args = copy($scope.$eval(ref.args));
            }
            
            this.transition = function () {
                $state.go(ref.state, args);
            };
            
            function parseRef(ref) {
                var matches = ref.match(/([^(]*)(?:\(([^)]*)\))?/);
                if (matches) {
                    return { 
                        state: matches[0],
                        args: matches.length === 2 ? matches[1] : undefined
                    };
                } else {
                    throw new Error('Invalid StateRef');
                }
            }
        }
    };
}