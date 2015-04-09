'use strict';

var isObject = angular.isObject;

angular.module('hwo.ui').service('colors', ColorsService);

function ColorsService() {
    var colors = [
        { hex: '#1A53FF', text: 'white' },
        { hex: '#531AFF', text: 'white' },
        { hex: '#C61AFF' },
        { hex: '#FF1AC6' },
        { hex: '#1AC6FF' },
        { hex: '#5781FF' },
        { hex: '#94AFFF' },
        { hex: '#FF1A53', text: 'white' },
        { hex: '#1AFFC6' },
        { hex: '#FFE494' },
        { hex: '#FFD557' },
        { hex: '#FF531A', text: 'white' },
        { hex: '#1AFF53' },
        { hex: '#53FF1A' },
        { hex: '#C6FF1A' },
        { hex: '#FFC61A' },
        { hex: '#FFFFFF' }
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