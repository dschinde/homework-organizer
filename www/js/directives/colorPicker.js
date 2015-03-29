'use strict';

var module = angular.module('hwo');
module.directive('hwoColorPicker', ColorPickerDirective);

function ColorPickerDirective(colors) {
    return {
        templateUrl: 'templates/color-picker.html',
        require: 'ngModel',
        scope: {},
        link: function (scope, element, attrs, ngModel) {
            var iterator = colors.getIterator();
            
            ngModel.$render = render;
            scope.color = iterator.current();
            scope.next = next;
            scope.previous = previous;
            
            setColor();
            
            function render() {
                scope.color = ngModel.$viewValue;
            }
            
            function next() {
                scope.color = iterator.next();
                scope.$evalAsync(setColor);
            }
            
            function previous() {
                scope.color = iterator.previous();
                scope.$evalAsync(setColor);
            }
            
            function setColor() {
                ngModel.$setViewValue(scope.color);
            }
        }
    };
}