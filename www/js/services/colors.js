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
    ];
    
    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        color.key = color.name || color.hex;
        this[color.key] = color;
    }
    
    this.getTextColor = function (value) {
        return this[value].text || 'black';
    };
    
    this.length = colors.length;
    
    this.values = function () {
        return colors;
    };
}