'use strict';

var isObject = angular.isObject;

var module = angular.module('hwo.ui');
module.service('colors', ColorsService);

function ColorsService() {
    var colors = [
        { name: 'red', text: 'white' },
        { name: 'green' },
        { name: 'blue', text: 'white' },
        { name: 'orange' },
        { name: 'purple', text: 'white' },
        { name: 'white' }
    ];
    
    var length = colors.length;
    
    return {
        getIterator: Iterator,
        getTextColor: getTextColor
    };
    
    function Iterator() {
        var index = 0;
        
        return {
            next: next,
            previous: previous,
            current: current
        };
        
        function next() {
            index++;
            if (index === length) {
                index = 0;
            }
            return current();
        }
        
        function previous() {
            index--;
            if (index === -1) {
                index = length - 1;
            }
            return current();
        }
        
        function current() {
            return colors[index];
        }
    }

    function getTextColor(value) {
        for (var i = 0; i < length; i++) {
            var color = colors[i];
            if ((color.name === value) || (color.hex && (color.hex === value))) {
                return color.text || 'black';
            }
        }
        
        return 'black';
    }
}