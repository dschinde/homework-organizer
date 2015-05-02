'use strict';

angular.module('hwo.ui').directive('hwoStyleFor', StyleForDirective);

function StyleForDirective(colors, Assignment, Class) {
    var isDefined = angular.isDefined,
        isNumber = angular.isNumber;

    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.$watch($attrs.hwoStyleFor, setStyle);
            
            function setStyle(value) {
                console.log('setStyle', value);
                if (isDefined(value)) {
                    if (isNumber(value)) {
                        console.log('setStyle -> calling Class.get()');
                        Class.get(value).then(function (klass) {
                            console.log('setStyle -> Class.get(' + value + ')');
                            console.log('\tclass: ', klass);
                            console.log('\tcolor: ' + klass.color);
                            setColor(klass.color);
                        });
                    } else {
                        setColor(value);
                    }
                }
            }
            
            function setColor(color) {
                $element.css({
                    'backgroundColor': color,
                    'color': colors.getTextColor(color)
                });
            }
        }
    };
}