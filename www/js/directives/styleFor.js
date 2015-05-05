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
                if (isDefined(value)) {
                    if (isNumber(value)) {
                        Class.get(value).then(function (klass) {
                            setColor(klass.color);
                        });
                    } else {
                        setColor(value);
                    }
                }
            }
            
            function setColor(color) {
                var textColor = colors.getTextColor(color);
                if (textColor === '#FFFFFF') {
                    $element.addClass('light-text');
                }
            
                $element.css({
                    'backgroundColor': color,
                    'color': textColor
                });
            }
        }
    };
}