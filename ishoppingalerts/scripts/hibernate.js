var JSSessionFactory = (function() {

	var DB_SHORTNAME     = 'imedalertdb';
	var DB_VERSION         = '1.0';
	var DB_DISPLAYNAME     = 'iMedAlert Database';
	var DB_MAXSIZE         = 4194304; // in bytes

	var _sessionInstance;

    function checkdb(shortName, version, displayName, maxSize) {
        try {
            if (!window.openDatabase) {
                alert('Local database not supported.');
            } else {
                _sessionInstance.sysdb = window.openDatabase(DB_SHORTNAME, DB_VERSION, DB_DISPLAYNAME, DB_MAXSIZE);
            }
        } catch(e) {
            if (e==2) {
                alert('Invalid database version.');
            } else {
                alert('Unknown error '+e+'.');
            }
        }
    }

    function checktable(rec) {
    	if (!rec || !rec.getSqlCreate) return;
    	var sqlCreate = rec.getSqlCreate();
		_sessionInstance.sysdb.transaction(
			function(transaction) {
				transaction.executeSql(sqlCreate, [], nullDataHandler, errorHandler);
			}
		);

    }

    function nullDataHandler(transaction, results) {
    	results.rows;
    }

    function errorHandler(transaction, error) {
    	alert('Error: ' + error.message + ' (code: '+error.code+').');
    }

    function init() {
        return {
            sysdb: null,
            merge: function(obj, table, mapping) {
            	this.save(obj, table, mapping);
            },
            save: function(obj, table, mapping) {
                if (!_sessionInstance.sysdb) checkdb();
                checktable(obj);
                var tmpStmnData = genSqlIns(obj, table, mapping);
                _sessionInstance.sysdb.transaction(
                	function (transaction) {
                		transaction.executeSql(
                			tmpStmnData.stmn, tmpStmnData.data, nullDataHandler, nullDataHandler
                		);
                	}
                );
                var tmpStmnData2 = genSqlUpd(obj, table, mapping);
                _sessionInstance.sysdb.transaction(
                	function (transaction) {
                		transaction.executeSql(
                			tmpStmnData2.stmn, tmpStmnData2.data, nullDataHandler, errorHandler
                		);
                	}
                );
            },
            add: function(obj, table, mapping) {
	                    if (!_sessionInstance.sysdb) checkdb();
	                    checktable(obj);
	                    var tmpStmnData = genSqlIns(obj, table, mapping);
	                    _sessionInstance.sysdb.transaction(
	                    	function (transaction) {
	                    		transaction.executeSql(
	                    			tmpStmnData.stmn, tmpStmnData.data, nullDataHandler, errorHandler
	                    		);
	                    	}
	                    );
            },
            edit: function(obj, table, mapping, keyvals) {
			    if (!_sessionInstance.sysdb) checkdb();
			    checktable(obj);
			    var tmpStmnData = genSqlUpd(obj, table, mapping, keyvals);
			    _sessionInstance.sysdb.transaction(
				function (transaction) {
					transaction.executeSql(
						tmpStmnData.stmn, tmpStmnData.data, nullDataHandler, errorHandler
					);
				}
			    );
            },
            remove: function(obj, table, mapping) {
                if (!_sessionInstance.sysdb) checkdb();
                checktable(obj);
                var tmpStmnData = genSqlDel(obj, table, mapping);
                _sessionInstance.sysdb.transaction(
                	function (transaction) {
                		transaction.executeSql(
                			tmpStmnData.stmn, tmpStmnData.data, nullDataHandler, errorHandler
                		);
                	}
                );
            },
            load: function(obj, table, mapping, fDataHandler) {
				if (!_sessionInstance.sysdb) checkdb();
				checktable(obj);
				var tmpStmnData = genSqlLoad(obj, table, mapping);
				//alert(tmpStmnData.stmn);
				//alert(tmpStmnData.data);
				_sessionInstance.sysdb.transaction(
					function (transaction) {
						transaction.executeSql(
							tmpStmnData.stmn,
							tmpStmnData.data,
							function(transaction, results) {
								if (!results || !results.rows || results.rows.length==0) {
									if (fDataHandler) fDataHandler(null);
								}
								var row = results.rows.item(0);
								for (prp in obj) {
									if (typeof obj[prp] !== 'function') {
										if (mapping && mapping[prp]) {
											if (row[mapping[prp]])
												obj[prp] = row[mapping[prp]];
										} else {
											if (row[prp])
												obj[prp] = row[prp];
										}
									}
								}
								if (fDataHandler) fDataHandler(obj);
							},
							errorHandler
						);
					}
				);
            },
            find: function(obj, table, mapping, where, fDataHandler) {
            	if (!_sessionInstance.sysdb) checkdb();
            	checktable(obj);
            	var tmpStmnData = genSqlFind(obj, table, mapping, where);
            	_sessionInstance.sysdb.transaction(
            		function (transaction) {
            			transaction.executeSql(
            				tmpStmnData.stmn,
            				tmpStmnData.data,
            				function (transaction, results) {
            				    var retrs = new Array();
            					if (!results || !results.rows || results.rows.length==0) {
            					    if (fDataHandler) fDataHandler(retrs);
            					}
								for (var i=0; i<results.rows.length; i++) {
									var row = results.rows.item(i);
									var newObject = jQuery.extend(true, {}, obj);
									for (prp in obj) {
										if (typeof obj[prp] !== 'function') {
											if (mapping && mapping[prp]) {
												if (row[mapping[prp]])
													newObject[prp] = row[mapping[prp]];
											} else {
												if (row[prp] || row[prp]==0)
													newObject[prp] = row[prp];
											}
										}
									}
									retrs.push(newObject);
								}
								if (fDataHandler) fDataHandler(retrs);
            				},
            				errorHandler
            			);
            		}
            	);
            },
            drop: function(obj, table) {
            	if (!_sessionInstance.sysdb) checkdb();
            	checktable(obj);
            	_sessionInstance.sysdb.transaction(function(transaction){
            		transaction.executeSql("drop table "+table+";", new Array(), nullDataHandler, nullDataHandler);
            	});
            }
        };
    }

    function genSqlIns(obj, table, mapping) {
        var buf = 'insert into '+table+'(';
        var buffld = ' values (';
        var arr = new Array();
        for (var prp in obj) {
            if (typeof obj[prp] !== 'function') {
                if (mapping && mapping[prp])
                	buf += mapping[prp] + ',';
                else
                	buf += prp + ',';
                buffld += '?,';
                arr.push(obj[prp]);
            }
        }
        buf = buf.substring(0, buf.length-1);
        buffld = buffld.substring(0, buffld.length-1);
        return {stmn: buf+')' + buffld +')', data:arr};
    }

    function genSqlUpd(obj, table, mapping, keyvals) {
        var buf = 'update '+table+' set ';
        var arr = new Array();
        for (var prp in obj) {
            if (typeof obj[prp] !== 'function') {
                if (mapping && mapping[prp])
                    buf += mapping[prp] + '=?,';
                else
                    buf += prp + '=?,';
                arr.push(obj[prp]);
            }
        }
        buf = buf.substring(0, buf.length-1);
        var awhere = genSqlWhere(obj, table, mapping, keyvals);
        return {stmn: buf+awhere.stmn, data: arr.concat(awhere.data)};
    }

	function genSqlDel(obj, table, mapping) {
		var buf = 'delete from '+table + ' ';
		var awhere = genSqlWhere(obj, table, mapping);
		return {stmn: buf+awhere.stmn, data: awhere.data};
    }

    function genSqlLoad(obj, table, mapping) {
        var buf = 'select * from '+table + ' ';
        var awhere = genSqlWhere(obj, table, mapping);
        return {stmn: buf+awhere.stmn, data: awhere.data};
    }

    function genSqlFind(obj, table, mapping, where) {
    	var buf = 'select * from ' + table + ' ';
    	if (where && typeof where !== 'function')
    		buf += where;
    	if (obj.getKeyFields && typeof obj.getKeyFields === 'function')
    		buf += ' order by ' + toCsvList(obj.getKeyFields());
    	return {stmn: buf, data: []};
    }

	function genSqlWhere(obj, table, mapping, keyvals) {
		if (!obj) return {stmn: '', data: []};
		var buf = ' WHERE ';
		var arr = new Array();
		var arkeyfld = obj.getKeyFields();
		if (arkeyfld.length==0) return {stmn: '', data: []};
		for (var i=0; i<arkeyfld.length; i++) {
			var prp = arkeyfld[i];
			if (mapping && mapping[prp])
				buf += ' ' + mapping[prp] + '=? AND ';
			else
				buf += ' ' + prp + '=? AND ';
			arr.push(obj[prp]);
		}
		buf = buf.substring(0, buf.length-4);
		return {stmn: buf, data: (keyvals && keyvals.length>0 ? keyvals : arr)};
	}

	function toCsvList(ar) {
		var buf = '';
		if (!ar)
			return buf;
		for (var i=0; i<ar.length-1; i++) {
			buf += (ar[i] + ',');
		}
		buf += ar[ar.length-1];
		return buf;
	}

    return {
        getSession: function() {
            if (!_sessionInstance) {
                _sessionInstance = init();
            }
            return _sessionInstance;
        }
    }
})();


function med(medname, dosage, unit, frequency, refill, remaining, starting, alarm, alarm_level) {
    this.medname = medname;
    this.dosage = dosage;
    this.unit = unit;
    this.frequency = frequency;
    this.refill = refill;
    this.remaining = remaining;
    this.starting = starting;
    this.alarm = alarm;
    this.alarm_level = alarm_level;

    this.toString = function() {
        var buf = "";
        for (var prp in this) {
        if (typeof this[prp] !== 'function')
        buf += prp + "=" + this[prp] + ";"
        }
        return buf;
    }

    this.getSqlCreate = function() {
        return "CREATE TABLE IF NOT EXISTS medicine (medname TEXT NOT NULL PRIMARY KEY, "+
            "dosage FLOAT NOT NULL DEFAULT 1, unit TEXT, frequency TEXT, refill FLOAT NOT NULL DEFAULT 100, "+
            "remaining FLOAT, starting TEXT NOT NULL, alarm TEXT, alarm_level FLOAT)";
    }

	this.getKeyFields = function() {
		return ['medname'];
	}

    return this;
}