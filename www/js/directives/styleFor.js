'use strict';

angular.module('hwo.ui').directive('hwoStyleFor', StyleForDirective);

function StyleForDirective(colors, Assignment, Class) {
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
                    if (value instanceof Assignment) {
                        Class.get(value.classId).then(function (klass) {
                            styleSetter({
                                'backgroundColor': klass.color,
                                'color': colors.getTextColor(klass.color)
                            });
                        });
                    } else {
                        styleSetter({
                            'backgroundColor': value,
                            'color': colors.getTextColor(value)
                         });
                    } 
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