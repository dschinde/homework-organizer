'use strict';

var isObject = angular.isObject;

angular.module('hwo.ui').service('colors', ColorsService);

function ColorsService() {
    var colors = [
        { hex: '#F44336', text: 'white' },
        { hex: '#E91E63', text: 'white' },
        { hex: '#9C27B0', text: '#F0F0F0' },
        { hex: '#673AB7', text: '#F0F0F0' },
        { hex: '#3F51B5', text: '#F0F0F0' },
        { hex: '#2196F3', text: 'white' },
        { hex: '#03A9F4' },
        { hex: '#00BCD4' },
        { hex: '#009688', text: 'white' },
        { hex: '#4CAF50' },
        { hex: '#8BC34A' },
        { hex: '#CDDC39' },
        { hex: '#FFEB3B' },
        { hex: '#FF5722', text: 'white' },
        { hex: '#795548', text: '#F0F0F0' },
        { hex: '#607D8B' },
    ];
    
    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        color.key = color.name || color.hex;
        this[color.key] = color;
    }
    
    this.getTextColor = function (value) {
        var color = this[value];
        return color ? color.text : 'black';
    };
    
    this.length = colors.length;
    
    this.values = function () {
        return colors;
    };
}