'use strict';

var isObject = angular.isObject;

angular.module('hwo.ui').service('colors', ColorsService);

/**
 * Provides the colors and text colors for classes
 */
function ColorsService() {
    var colors = [
        { hex: '#F44336', text: '#FFFFFF' },
        { hex: '#E91E63', text: '#FFFFFF' },
        { hex: '#9C27B0', text: '#FFFFFF' },
        { hex: '#673AB7', text: '#FFFFFF' },
        { hex: '#3F51B5', text: '#FFFFFF' },
        { hex: '#2196F3', text: '#FFFFFF' },
        { hex: '#03A9F4' },
        { hex: '#00BCD4' },
        { hex: '#009688', text: '#FFFFFF' },
        { hex: '#4CAF50' },
        { hex: '#8BC34A' },
        { hex: '#CDDC39' },
        { hex: '#FFEB3B' },
        { hex: '#FF5722', text: '#FFFFFF' },
        { hex: '#795548', text: '#FFFFFF' },
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