'use strict';

angular.module('hwo.ui')
.directive('hwoColorPicker', ColorPickerDirective)
.directive('hwoColor', ColorDirective);

function ColorPickerDirective(colors) {
    var ngElement = angular.element;
    
    var length = colors.length,
        values = colors.values(),
        groups = [];
    
    for (var i = 0; i < length; i += 4) {
        var arr = values.slice(i, i + 4);
        groups.push(arr);
    }

    return {
        templateUrl: 'templates/color-picker.html',
        require: 'ngModel',
        scope: {},
        controller: function ($scope) {
            var children = {},
                count = 0,
                ngModel;
            
            $scope.groups = groups;
            this.register = register;
            
            function getElement(color) {
                return children[color];
            }
            
            function register(color, element) {
                children[color] = element;
                
                if (++count === colors.length) {
                    ngModel = $scope.ngModel;
                    ngModel.$render = render;
                    render();
                }
            }
            
            function render() {
                var active = children[ngModel.$modelValue];
                $scope.activate(active);
            }
        },
        link: function link($scope, $element, $attrs, ngModel) {
            var selected;
                
            $scope.ngModel = ngModel;
            $scope.activate = activate;
            $scope.select = select;
            
            function activate(element) {
                if (selected) selected.removeClass('active');
                element.addClass('active');
                selected = element;
            }
            
            function select($event, color) {
                activate(ngElement($event.target));
                ngModel.$setViewValue(color.key);
            }
        },
    };
}

function ColorDirective() {
    return {
        require: '^^hwoColorPicker',
        scope: {
            color: '=hwoColor'
        },
        link: function link($scope, $element, $attrs, colorPicker) {
            colorPicker.register($scope.color, $element);
        },
    };
}