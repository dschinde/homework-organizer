'use strict';

var module = angular.module('hwo');
module.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl($scope, $ionicHistory, localStorage) {
	/*$scope.settings = {
		set allowPushNotifications(val) { 
			localStorage.set('allowPushNotifications', val)
		},
		get allowPushNotifications() {
			return localStorage.get('allowPushNotifications')
		}
	}*/

	var isDefined = angular.isDefined;

	console.log(isDefined($scope));

	$scope.cancel = function () {
        $ionicHistory.goBack();
    }

    /* Define properties here */
    defineProperty('push');

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

	/*addProperty('allowPushNotifications');

	function addProperty(name) {
		var descriptor = {
			get: function () { 
				return localStorage.get(name);
			},
			set: function (val) {
				localStorage.set(name, val);
			}
		};

		Object.defineProperty($scope, name, descriptor);
	}*/

}