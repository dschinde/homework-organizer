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
        //{ hex: '#FFFFFF' }
    ];
    
    colors.getTextColor = function (value) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            var color = this[i];
            if ((color.name === value) || (color.hex && (color.hex === value))) {
                return color.text || 'black';
            }
        }
        
        return 'black';
    }
    
    return colors;
}