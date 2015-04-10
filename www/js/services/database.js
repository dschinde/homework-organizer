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
    
    
    return {
        createDatabase: createDatabase,
        deleteDatabase: deleteDatabase,
        
        getClasses: getClasses,
        insertClass: insertClass,
        deleteClass: deleteClass,
        updateClass: updateClass,
        
        getAssignments: getAssignments,
        insertAssignment: insertAssignment,
        deleteAssignment: deleteAssignment,
        updateAssignment: updateAssignment,
        setAssignmentCompleted: setAssignmentCompleted
    };
    
    
    /* Methods - Classes */
    
    function getClasses() {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id, name, color FROM Classes;',
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
     */
    function insertClass(klass) {
        return promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Classes(name, color) VALUES (?, ?);',
                    [ klass.name, klass.color ],
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
                tx.executeSql('UPDATE Classes SET name = ?, color = ? WHERE id = ?;',
                    [ klass.name, klass.color, klass.id ],
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
    
    /* Methods - Assignments */
    /**
     * Gets assignments based on a filter
     * @param {Object} [filter] - Determines which assignments will be returned. If no value is given, all assignments will be returned.
     * @param {number} [filter.classId] - The id of the class for which assignments should be returned. If no values is given, then the results will not be filtered by class.
     * @param {boolean} [filter.excludeCompleted=false] - Whether to exclude complete assignments
     * @param {Date} [filter.before] - Only assignments due before the given date and time will be returned.
     * @param {Date} [filter.after] - Only assignments due after the given date and time will be returned.
     * @param {Object} [order] - Determines the order of the results
     * @param {boolean} [order.orderByDate=true] - Orders the resulting assignments by due date and time.
     */
    function getAssignments(filter, order) {
        var sql = 'SELECT id, name, dueDateTime, completed, classId FROM Assignments';
        var defaults = {
            filter: {
                excludeCompleted: false
            },
            order: {
                orderByDate: true
            }
        };
        var args = [];
        
        filter = extend({}, filter, defaults.filter);
        order = extend({}, order, defaults.order);
        
        sql += buildWhereSql();
        sql += buildOrderSql();
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
                whereSql += ' completed = FALSE';
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
            
            return whereSql;
        }
    
        function buildOrderSql() {
            var orderSql = '';
            
            if (order.orderByDate) {
                orderSql += ' ORDER BY dueDateTime DESC';
            }
            
            return orderSql;
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
                    [ assignment.name, assignment.dueDateTime, assignment.classId ],
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
                    [ assignment.name, assignment.dueDateTime, !!assignment.completed, assignment.classId, assignment.id ],
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
            tx.executeSql('CREATE TABLE IF NOT EXISTS Classes(id INTEGER UNIQUE PRIMARY KEY, name TEXT, color TEXT);');
                
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