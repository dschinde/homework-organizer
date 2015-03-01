'use strict';

var module = angular.module('hwo.data', [ 'ionic' ]);
module.constant('openDatabase', window.openDatabase);
module.service('database', Database);

function Database($q, $ionicPlatform, openDatabase) {
    var isReady = false;
    var dbName = 'hw-org.db';
    var db;
    
    var extend = angular.extend;
    var isObject = angular.isObject;
    var isDefined = angular.isDefined;
    
    $ionicPlatform.ready(onDeviceReady)
        .then(function () {
            isReady = true;
            createDatabase();
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
        return $q(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id, name FROM Classes;',
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
        return $q(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Classes(name) VALUES (?);',
                    [ klass.name ],
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
        return $q(function (resolve, reject) {
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
     * @param {number} klass.ids
     * @param {string} klass.name
     */
    function updateClass(klass) {
        return $q(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE Classes SET name = ? WHERE id = ?;',
                    [ klass.name, klass.id ],
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
        
        return $q(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql(sql, args,
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
        return $q(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Assignments(name, dueDateTime, completed, classId) VALUES (?, ?, FALSE, ?);',
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
        return $q(function (resolve, reject) {
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
     * @param {string} assignment.name
     * @param {Date} assignment.dueDateTime
     * @param {number} assignment.classId
     * @param {boolean} assignment.completed
     */
    function updateAssignment(assignment) {
        return $q(function (resolve, reject) {
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
        return $q(function (resolve, reject) {
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
    
    function onDeviceReady() {
        db = openDatabase(dbName, '1.0', 'Homework Organizer Database', 1024 * 1024);
        
        isReady = true;
    }
    
    function createDatabase() {
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Classes(id INTEGER UNIQUE PRIMARY KEY, name TEXT);');
                
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