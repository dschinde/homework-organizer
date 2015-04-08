'use strict';

var module = angular.module('hwo');
module.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl($scope, $ionicHistory, localStorage) {
	$scope.back = function () {
        $ionicHistory.goBack();
    }

    /* Define properties here */
    defineProperty('allowPushNotifications');

    function defineProperty(name) {
    	Object.defineProperty($scope, name, {
    		enumerable: true,
    		configurable: true,
    		get: function () {
    			var val = localStorage.get(name);
    			return JSON.parse(val);
    		},
    		set: function (val) {
    			localStorage.set(name,val);
    		}
    	});
    }
}