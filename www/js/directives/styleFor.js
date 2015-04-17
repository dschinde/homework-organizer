'use strict';

angular.module('hwo.ui').directive('hwoStyleFor', StyleForDirective);

function StyleForDirective(colors) {
    var isDefined = angular.isDefined;
    var isObject = angular.isObject;

    return {
        restrict: 'A',
        require: '?ionItem',
        link: function ($scope, $element, $attrs, itemCtrl) {
            $scope.$watch($attrs.hwoStyleFor, setStyle);
            
            var styleSetter = createStyleSetter($element, itemCtrl);
            
            function setStyle(value) {
                if (isDefined(value)) {
                    if (!isObject(value)) {
                        throw Error("The parameter to the hwoStyleFor directive must be an object.");
                    }
                    
                    styleSetter({
                        'backgroundColor': value.color,
                        'color': colors.getTextColor(value.color)
                    });
                }
            }
        }
    };
    
    function createStyleSetter($element, itemCtrl) {
        if (!itemCtrl) return $element.css.bind($element);
        
        var children = $element.children(),
            content;
            
        if (children.hasClass('item-content')) {
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var child = children.eq(i);
                if (child.hasClass('item-content')) {
                    content = child;
                    break;
                }
            }
        }
        
        return function (css) {
            $element.css(css);
            if (content) content.css(css);
        };
    }
}