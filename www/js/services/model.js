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
            this.__class = undefined;
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

function Class($q, database) {
    var changed = true,
        map,
        promise;

    function Class(klass) {
        this.__obj = {
            id: klass.id,
            name: klass.name,
            color: klass.color,
            idx: klass.idx
        };
    }
    
    Class.prototype = {
        constructor: Class,
        
        get id() { return this.__obj.id; },
        get name() { return this.__obj.name; },
        get color() { return this.__obj.color; },
        get index() { return this.__obj.idx; },
        
        set name(val) {
            this.__obj.name = val;
            update(this.__obj);
        },
        set color(val) {
            this.__obj.color = val;
            update(this.__obj);
        },
        set index(val) {
            this.__obj.idx = val;
            update(this.__obj);
        },
        
        delete: function () {
            return database.deleteClass(this.__obj.id).then(setChanged);
        },
        
        edit: function () {
            var klass = this;
            
            return {
                editing: true,
                name: klass.name,
                color: klass.color,
                index: klass.index,
                save: function () {
                    klass.__obj.name = this.name;
                    klass.__obj.color = this.color;
                    klass.__obj.idx = this.index;
                    return update(klass.__obj);
                }
            };
        }
    };
    
    Class.get = function (id) {
        if (changed) {
            return database.getClasses().then(function (classes) {
                return classes.map(function (klass) {
                    return new Class(klass);
                });
            }).then(function (classes) {
                promise = $q.when(classes);
                
                map = classes.reduce(function (prev, klass) {
                    prev[klass.id] = klass;
                    return prev;
                }, {});
                
                changed = false;
                
                return classes;
            });
        }
        
        if (id) {
            return $q.when(map[id]);
        } else {
            return promise;
        }
    };
    
    Class.insert = function (klass) {
        return Class.get().then(function (classes) {
            klass.idx = classes.length;
            return database.insertClass(klass).then(function (klass) {
                if (promise) {
                    promise.then(function (classes) {
                        classes.push(new Class(klass));
                    });
                } else {
                    setChanged();
                }
            });
        });
    };
    
    function update(klass) {
        return database.updateClass(klass).then(setChanged);
    }
    
    function setChanged() { changed = true; }

    return Class;
}