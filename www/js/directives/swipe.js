'use strict';

angular.module('hwo.ui.util').directive('hwoSwipe', SwipeDirective);

function SwipeDirective($ionicGesture) {
    return {
        restrict: 'E',
        require: 'hwoSref',
        template: '',
        link: function (scope, element, attrs, sref) {
            var content = element.parent().find('ion-content'),
                direction = attrs.hwoDirection;
            var event = 'swipe' + direction;
            
            $ionicGesture.on(event, function () { sref.transition(); }, element);
        }
    };
}