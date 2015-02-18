var Database = (function (openDatabase) {
    var isReady = false;
    var dbName = 'hw-org.db';
    var db;
    
    onDeviceReady();
    //deleteDatabase();
    createDatabase();
    
    
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
     */
    function getAssignments(filter) {
        var sql = 'SELECT id, name, dueDateTime, completed, classId FROM Assignments';
        var args = [];
        
        if (filter && (filter.classId || filter.excludeCompleted || filter.before || filter.after)) {
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
            
            sql += whereSql;
        }
        
        sql += ';';
        
        return new Promise(function (resolve, reject) {
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
    }
    
    /**
     * @param {Object} assignment
     * @param {string} assignment.name
     * @param {Date} assignment.dueDateTime
     * @param {number} assignment.classId
     */
    function insertAssignment(assignment) {
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
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
    
    //document.addEventListener('deviceready' , onDeviceReady, false);
    
    function onDeviceReady() {
        //db = openDatabase({
        //    name: dbName
        //});
        
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
    
    /* Utilities */
    function rowsToArray(rows) {
        var length = rows.length;
        var arr = [];
        for (var i = 0; i < length; i++) {
            arr[i] = rows.item(i);
        }
        return arr;
    }
    
    
})(window.openDatabase);