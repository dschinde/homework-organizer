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
            console.log('completed', this.id, this.name);
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
        },
        
        edit: function () {
            var assignment = this;
            
            return {
                editing: true,
                name: assignment.name,
                dueDateTime: assignment.dueDateTime,
                completed: assignment.completed,
                classId: assignment.classId,
                save: function () {
                    assignment.__obj.name = this.name;
                    assignment.__obj.dueDateTime = this.dueDateTime;
                    assignment.__obj.completed = this.completed;
                    assignment.__obj.classId = this.classId;
                    return database.updateAssignment(assignment.__obj);
                }
            };
        }
    };
    
    Assignment.any = function () {
        return database.getAssignments({ limit: 1 }).then(function (assignments) {
            return assignments.length !== 0;
        });
    };
    
    Assignment.get = function (filter) {
        return database.getAssignments(filter).then(function (assignments) {
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
        
        hasAssignments: function () {
            return database.classHasAssignments(this.__obj);
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
                
                changed = false;
                
                map = classes.reduce(function (prev, klass) {
                    prev[klass.id] = klass;
                    return prev;
                }, {});
            }).then(get);
        } else {
            return get();
        }
        
        
        
        function get() {
            if (id) {
                return $q.when(map[id]);
            } else {
                return promise;
            }
        }
    };
    
    Class.insert = function (klass) {
        return Class.get().then(function (classes) {
            klass.idx = classes.length;
            return database.insertClass(klass).then(setChanged);
        });
    };
    
    function update(klass) {
        return database.updateClass(klass).then(setChanged);
    }
    
    function setChanged() { changed = true; }

    return Class;
}