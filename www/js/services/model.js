'use strict';

angular.module('hwo.data')
.factory('Assignment', Assignment)
.factory('Class', Class);

function Assignment(database) {
    function Assignment(assignment) {
        this.__obj = {
            id: assignment.id,
            name: assignment.name,
            dueDateTime: new Date(assignment.dueDateTime),
            completed: !!assignment.completed,
            classId: assignment.classId
        };
    }
    
    Assignment.prototype = {
        constructor: Assignment,
        
        get id() { return this.__obj.id; },
        get name() { return this.__obj.name; },
        get dueDateTime() { return this.__obj.dueDateTime; },
        get completed() { return this.__obj.completed; },
        get classId() { return this.__obj.classId; },
        
        set name(val) {
            this.__obj.name = val;
            database.updateAssignment(this.__obj);
        },
        set dueDateTime(val) {
            this.__obj.dueDateTime = val;
            database.updateAssignment(this.__obj);
        },
        set completed(val) {
            this.__obj.completed = val;
            database.setAssignmentCompleted(this.__obj.id, val);
        },
        set classId(val) {
            this.__obj.classId = val;
            database.updateAssignment(this.__obj);
        },
        
        delete: function () {
            return database.deleteAssignment(this.__obj.id);
        }
    };
    
    Assignment.get = function (filter, order) {
        return database.getAssignments(filter, order).then(function (assignments) {
            return assignments.map(function (assignment) {
                return new Assignment(assignment);
            });
        });
    };
    
    Assignment.insert = function (assignment) {
        return database.insertAssignment(assignment);
    };
    
    return Assignment;
}

function Class(database) {
    function Class(klass) {
        this.__obj = {
            id: klass.id,
            name: klass.name,
            color: klass.color
        };
    }
    
    Class.prototype = {
        constructor: Class,
        
        get id() { return this.__obj.id; },
        get name() { return this.__obj.name; },
        get color() { return this.__obj.color; },
        
        set name(val) {
            this.__obj.name = val;
            database.updateClass(this.__obj);
        },
        set color(val) {
            this.__obj.color = val;
            database.updateClass(this.__obj);
        },
        
        delete: function () {
            return database.deleteClass(this.__obj.id);
        }
    };
    
    Class.get = function (id) {
        if (id) {
            return database.getClasses().then(function (classes) {
                var length = classes.length;
                for (var i = 0; i < length; i++) {
                    if (classes[i].id == id) {
                        return new Class(classes[i]);
                    }
                }
            });
        } else {
            return database.getClasses().then(function (classes) {
                return classes.map(function (klass) { 
                    return new Class(klass);
                });
            });
        }
    };
    
    Class.insert = function (klass) {
        return database.insertClass(klass);
    };

    return Class;
}