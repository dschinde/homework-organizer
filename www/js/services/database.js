'use strict';

angular.module('hwo.data')
.service('database', Database)
.factory('DBConnection', DBConnection);

function DBConnection($q, $window, $ionicPlatform) {
    function Connection(options) {
        var name = options.name,
            version = options.version,
            displayName = options.displayName,
            size = options.size;
            
        var db;
        
        var ready = $ionicPlatform.ready(function () {
            if ($window.sqlitePlugin) {
                db = $window.sqlitePlugin.openDatabase(options);
            } else {
                db = $window.openDatabase(name, version, displayName, size);
            }
        });
        
        this.transaction = transaction;
        
        function transaction(fn) {
            db.transaction(fn);
        }
    }
    
    return Connection;
}

function Database($q, $ionicPlatform, DBConnection) {
    var dbName = 'hwo.db';
    var db;
    
    var extend = angular.extend;
    var isObject = angular.isObject;
    var isDefined = angular.isDefined;
    
    var ready = $ionicPlatform.ready(function () {
        db = new DBConnection({
            name: dbName,
            version: '1.0',
            displayName: 'Homework Organizer Database',
            size: 1024 * 1024
        });
    }).then(function () {
        createDatabase();
    }, function (e) {
        alert(e.message);
    });
    
    
    this.createDatabase = createDatabase;
    this.deleteDatabase = deleteDatabase;
    
    this.getClasses = getClasses;
    this.insertClass = insertClass;
    this.deleteClass = deleteClass;
    this.updateClass = updateClass;
    this.classHasAssignments = classHasAssignments;
    
    this.getAssignments = getAssignments;
    this.insertAssignment = insertAssignment;
    this.deleteAssignment = deleteAssignment;
    this.updateAssignment = updateAssignment;
    this.setAssignmentCompleted = setAssignmentCompleted;
    
    
    /* Methods - Classes */
    
    function getClasses() {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id, name, color, idx FROM Classes ORDER BY idx ASC;',
                    [],
                    function (tx, res) {
                        var arr = rowsToArray(res.rows);
                        resolve(arr);
                    }, 
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /**
     * @param {Object} klass
     * @param {string} klass.name
     * @param {string} klass.color
     * @param {number} klass.idx
     */
    function insertClass(klass) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Classes(name, color, idx) VALUES (?, ?, ?);',
                    [ klass.name, klass.color, klass.idx ],
                    function (tx, res) {
                        klass.id = JSON.parse(res.insertId);
                        resolve(klass);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /**
     * @param {number} id
     */
    function deleteClass(id) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM Classes WHERE id = ?;',
                    [ id ],
                    function (tx, res) {
                        tx.executeSql('DELETE FROM Assignments WHERE classId = ?;',
                            [ id ],
                            function (tx, res) {
                              resolve(res);  
                            },
                            function (tx, e) {
                                reject(e);
                            }
                        );
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /**
     * @param {Object} klass
     * @param {number} klass.id
     * @param {string} klass.name
     */
    function updateClass(klass) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE Classes SET name = ?, color = ?, idx = ? WHERE id = ?;',
                    [ klass.name, klass.color, klass.idx, klass.id ],
                    function (tx, res) {
                        resolve(res);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    function classHasAssignments(klass) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id FROM Assignments WHERE classId = ? LIMIT 1;',
                    [ klass.id ],
                    function (tx, res) {
                        resolve(res.rows.length !== 0);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /* Methods - Assignments */
    /**
     * Gets assignments based on a filter
     * @param {Object} [filter] - Determines which assignments will be returned. If no value is given, all assignments will be returned.
     * @param {number} [filter.classId] - The id of the class for which assignments should be returned. If no values is given, then the results will not be filtered by class.
     * @param {boolean} [filter.excludeCompleted=false] - Whether to exclude complete assignments
     * @param {Date} [filter.before] - Only assignments due before the given date and time will be returned.
     * @param {Date} [filter.after] - Only assignments due after the given date and time will be returned.
     * @param {number} [filter.limit] - Only returns up to the given number of assignments
     * @param {string} [filter.orderByDate='asc'] - Can be either 'asc' or 'desc'. If 'asc', orders the assignments by date in ascending order; if 'desc' orders them by date in descending order.
     * @param {boolean} [filter.onlyCompleted] - Only returns completed assignments
     */
    function getAssignments(filter) {
        var sql = 'SELECT id, name, dueDateTime, completed, classId FROM Assignments';
        var defaults = {
            filter: {
                excludeCompleted: false,
                onlyCompleted: false,
                orderByDate: 'asc'
            }
        };
        var args = [];
        
        filter = extend({}, defaults.filter, filter);
        
        sql += buildWhereSql();
        sql += ';';
        
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql(sql, args,
                    function (tx, res) {
                        var arr = [];
                        var rows = res.rows;
                        var length = rows.length;
                        
                        for (var i = 0; i < length; i++) {
                            var assignment = rows.item(i);
                            arr.push({
                                id: assignment.id,
                                name: assignment.name,
                                dueDateTime: new Date(assignment.dueDateTime),
                                completed: !!assignment.completed,
                                classId: assignment.classId
                            });
                        }
                        
                        resolve(arr);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
        
        function buildWhereSql() {
            var whereSql = '';
            
            if (filter.classId) {
                whereSql += ' WHERE classId = ?';
                args.push(filter.classId);
            }
            
            if (filter.excludeCompleted) {
                whereSql += whereSql.length === 0 ? ' WHERE' : ' AND';
                whereSql += ' completed = 0';
            }
            
            if (filter.onlyCompleted) {
                whereSql += whereSql.length === 0 ? ' WHERE' : ' AND';
                whereSql += ' completed = 1';
            }
            
            if (filter.before) {
                whereSql += whereSql.length === 0 ? ' WHERE' : ' AND';
                whereSql += ' dueDateTime < ?';
                args.push(filter.before.valueOf());
            }
            
            if (filter.after) {
                whereSql += whereSql.length === 0 ? ' WHERE' : ' AND';
                whereSql += ' ? < dueDateTime';
                args.push(filter.after.valueOf());
            }
            
            if (filter.orderByDate === 'asc') {
                whereSql += ' ORDER BY dueDateTime ASC';
            } else if (filter.orderByDate === 'desc') {
                whereSql += ' ORDER BY dueDateTime DESC';
            }
            
            if (filter.limit) {
                whereSql += ' LIMIT ?';
                args.push(filter.limit);
            }
            
            return whereSql;
        }
    }
    
    /**
     * @param {Object} assignment
     * @param {string} assignment.name
     * @param {Date} assignment.dueDateTime
     * @param {number} assignment.classId
     */
    function insertAssignment(assignment) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Assignments(name, dueDateTime, completed, classId) VALUES (?, ?, 0, ?);',
                    [ assignment.name, assignment.dueDateTime.valueOf(), assignment.classId ],
                    function (tx, res) {
                        resolve(res);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /**
     * @param {number} id
     */
    function deleteAssignment(id) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM Assignments WHERE id = ?;',
                    [ id ],
                    function (tx, res) {
                        resolve(res);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /**
     * @param {Object} assignment
     * @param {number} assignment.id
     * @param {string} assignment.name
     * @param {Date} assignment.dueDateTime
     * @param {number} assignment.classId
     * @param {boolean} assignment.completed
     */
    function updateAssignment(assignment) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE Assignments SET name=?, dueDateTime=?, completed=?, classId=? WHERE id = ?;',
                    [ assignment.name, assignment.dueDateTime.valueOf(), assignment.completed ? 1 : 0, assignment.classId, assignment.id ],
                    function (tx, res) {
                        resolve(res);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /**
     * Sets whether the assignment with the given id is completed
     * @param {number} id
     * @param {boolean} completed - whether the assignment is completed
     */
    function setAssignmentCompleted(id, completed) {
        // An integer is needed in the database
        completed = completed ? 1 : 0;
        
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE Assignments SET completed=? WHERE id = ?;',
                    [ completed, id ],
                    function (tx, res) {
                        resolve(res);
                    },
                    function (tx, e) {
                        reject(e);
                    }
                );
            });
        });
    }
    
    /* Setup */
    
    function createDatabase() {
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Classes(id INTEGER UNIQUE PRIMARY KEY, name TEXT, color TEXT, idx INTEGER);');
                
            tx.executeSql('CREATE TABLE IF NOT EXISTS Assignments(id INTEGER UNIQUE PRIMARY KEY, name TEXT, dueDateTime DATE, completed BOOLEAN, classId INTEGER REFERENCES Classes);');
            
            tx.executeSql('CREATE INDEX IF NOT EXISTS assignmentsIndex ON Assignments(classId);');
        });
    }
    
    function deleteDatabase() {
        db.transaction(function (tx) {
            tx.executeSql('DROP INDEX IF EXISTS assignmentsIndex;');
            tx.executeSql('DROP TABLE IF EXISTS Assignments;');
            tx.executeSql('DROP TABLE IF EXISTS Classes;');
        });
    }
    
    function promise(fn) {
        return ready.then(function () {
            return $q(fn);
        });
    }
}

/* Utilities */
function rowsToArray(rows) {
    var length = rows.length;
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr[i] = rows.item(i);
    }
    return arr;
}