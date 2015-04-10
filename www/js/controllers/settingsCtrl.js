'use strict';

angular.module('hwo')
.controller('SettingsCtrl', SettingsCtrl)
.config(function (settingsProvider) {
    // Add settings here:
    // settingsProvider.define(...);
    
    settingsProvider.define('allowPushNotifications');
});

function SettingsCtrl($scope, $ionicHistory, database, settings) {
	$scope.back = function () {
        $ionicHistory.goBack();
    }
    
    database.getClasses().then(function (classes) {
        $scope.classes = classes;
    });
    
    settings.populateScope($scope);
}