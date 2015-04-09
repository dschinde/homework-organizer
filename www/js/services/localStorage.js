'use strict';

angular.module('hwo.data').service('localStorage', LocalStorage);

function LocalStorage() {
    var isObject = angular.isObject;
    
    return {
        get: get,
        getObject: getObject,
        remove: remove,
        set: set
    };

    /**
     * Gets the local storage value with the given key as a string
     * @param {string} key
     */
    function get(key) {
        return localStorage.getItem(key);
    }
    
    /**
     * Gets the local storage value with the given key as an object
     * @param {string} key
     */
    function getObject(key) {
        var value = localStorage.getItem(key);
        if (value === null) {
            return value;
        }
        
        var object = JSON.parse(value);
        return object;
    }
    
    /**
     * @param {string} key
     */
    function remove(key) {
        localStorage.removeItem(key);
    }
    
    /**
     * @param {string} key
     * @param {string|Object} value
     */
    function set(key, value) {
        if (isObject(value)) {
            value = JSON.stringify(value);
        }
        
        localStorage.setItem(key, value);
    }
}