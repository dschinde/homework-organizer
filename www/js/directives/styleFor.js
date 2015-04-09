'use strict';

var module = angular.module('hwo.ui');
module.directive('hwoStyleFor', StyleForDirective);

function StyleForDirective(colors) {
    var isDefined = angular.isDefined;
    var isObject = angular.isObject;

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.hwoStyleFor, setStyle);
            
            function setStyle(value) {
                if (isDefined(value)) {
                    if (!isObject(value)) {
                        throw Error("The parameter to the hwoStyleFor directive must be an object.");
                    }
                    
                    element.css('backgroundColor', value.color);
                    element.css('color', colors.getTextColor(value.color));
                }
            }
        }
    };
}