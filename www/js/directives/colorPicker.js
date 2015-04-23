'use strict';

angular.module('hwo.ui').directive('hwoColorPicker', ColorPickerDirective);

function ColorPickerDirective(colors) {
    var ngElement = angular.element;

    return {
        templateUrl: 'templates/color-picker.html',
        require: 'ngModel',
        scope: {},
        compile: function ($element, $attrs) {
            var length = colors.length,
                groups = [];
            
            for (var i = 0; i < length; i += 4) {
                var arr = colors.slice(i, i + 4);
                groups.push(arr);
            }
        
            return link;
            
            function link($scope, $element, $attrs, ngModel) {
                var element;
            
                $scope.groups = groups;
                $scope.select = select;
                
                function select($event, color) {
                    if (element) element.removeClass('active');
                    element = ngElement($event.target);
                    element.addClass('active');
                    
                    ngModel.$setViewValue(color.hex || color.name);
                }
            }
        },
    };
}