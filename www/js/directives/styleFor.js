'use strict';

angular.module('hwo.ui').directive('hwoStyleFor', StyleForDirective);

function StyleForDirective(colors, Assignment, Class) {
    var isDefined = angular.isDefined;

    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.$watch($attrs.hwoStyleFor, setStyle);
            
            function setStyle(value) {
                if (isDefined(value)) {
                    if (isDefined(value.classId)) {
                        Class.get(value.classId).then(function (klass) {
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