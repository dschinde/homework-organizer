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
    
    $scope.editClass = function () {};
    
    $scope.deleteClass = function (klass) {
        database.deleteClass(klass.id).then(function () {
            return database.getClasses();
        }).then(function (classes) {
            $scope.classes = classes;
        });
    }
    
    database.getClasses().then(function (classes) {
        $scope.classes = classes;
    });
    
    settings.populateScope($scope);
}