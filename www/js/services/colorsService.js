'use strict';

var module = angular.module('hwo');
module.service('colors', ColorsService);

function ColorsService() {
    var colors = [ 'red', 'green', 'blue', 'orange', 'purple', 'white' ];
    var length = colors.length;
    
    return {
        getIterator: Iterator
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
}