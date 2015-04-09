'use strict';

angular.module('hwo.data').provider('settings', SettingsProvier);

function SettingsProvier() {
    var settings = [];
    
    return {
        define: define,
        $get: Settings
    };
    
    function define(key) {
        settings.push(key);
    }
    
    function Settings(localStorage) {
        var self = {};
        
        var length = settings.length;
        for (var i = 0; i < length; i++) {
            var name = settings[i];
            
            Object.defineProperty(self, name, {
                enumerable: true,
                configurable: true,
                get: function () {
                    var val = localStorage.get(name);
                    return JSON.parse(val);
                },
            });
        }
        
        self.populateScope = function ($scope) {
            for (var i = 0; i < length; i++) {
                var name = settings[i];
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
        };
        
        return self;
    }
}