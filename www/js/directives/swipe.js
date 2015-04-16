'use strict';

angular.module('hwo.ui.util').directive('hwoSwipe', SwipeDirective);

function SwipeDirective($ionicGesture) {
    return {
        restrict: 'E',
        require: 'hwoSref',
        template: '',
        scope: true,
        link: function (scope, element, attrs, sref) {
            var content = element.parent().find('ion-content'),
                direction = attrs.hwoDirection,
                callback = sref.transition.bind(sref);
            var event = 'swipe' + direction;
            
            var gesture = $ionicGesture.on(event, callback, element);
            
            scope.$on('$destroy', function () {
                $ionicGesture.off(gesture, event, callback);
            });
        }
    };
}