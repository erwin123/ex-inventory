var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllAssetNotebook = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('SELECT Id ,ItemNo ,ItemNoSystem ,Brand ,Type ,Processor ,DivisionDedicate ,RAM ,HDD ,VGA ,Notes ,Name ,DATE_ADD(BoughtDate, INTERVAL 1 DAY) BoughtDate,MotherBoard ,MonitorNo ,Status FROM AssetNotebook', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}
exports.getAllAssetNotebookByCriteria = function (AssetNotebook, done) {
    var wh = db.whereCriteriaGenerator(AssetNotebook);
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('SELECT Id ,ItemNo ,ItemNoSystem ,Brand ,Type ,Processor ,DivisionDedicate ,RAM ,HDD ,VGA ,Notes ,Name ,DATE_ADD(BoughtDate, INTERVAL 1 DAY) BoughtDate ,MotherBoard ,MonitorNo ,Status FROM AssetNotebook' + wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}
exports.insertAssetNotebook = function (AssetNotebook, done) {
    var values = [AssetNotebook.ItemNo, AssetNotebook.Brand, AssetNotebook.Type, AssetNotebook.Processor,
        AssetNotebook.DivisionDedicate, AssetNotebook.RAM, AssetNotebook.HDD, AssetNotebook.VGA, AssetNotebook.Notes,
        AssetNotebook.Name, AssetNotebook.BoughtDate, AssetNotebook.MotherBoard, AssetNotebook.MonitorNo, AssetNotebook.Status];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('CALL sp_AssetNotebook(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}
exports.updateAssetNotebook = function ( AssetNotebook, done) {
    var values = [AssetNotebook.Brand, AssetNotebook.Type, AssetNotebook.Processor, AssetNotebook.DivisionDedicate,
        AssetNotebook.RAM, AssetNotebook.HDD, AssetNotebook.VGA, AssetNotebook.Notes, AssetNotebook.Name, AssetNotebook.BoughtDate,
        AssetNotebook.MotherBoard, AssetNotebook.MonitorNo, AssetNotebook.Status, AssetNotebook.ItemNo];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('UPDATE AssetNotebook SET Brand=?,Type=?,Processor=?,DivisionDedicate=?,RAM=?,HDD=?,VGA=?,Notes=?,Name=?,BoughtDate=?,MotherBoard=?,MonitorNo=?,Status=? WHERE ItemNo = ?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}
exports.deleteAssetNotebook = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('DELETE FROM AssetNotebook WHERE ItemNo=? ', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}


//-----report------
exports.historyAsset = function (assetNo, done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('CALL sp_GetAssetHistory(?)', assetNo, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.historyOut = function (outNo, done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('select a.*, b.OutDetailNo, b.AssetNo AssetNoDetail from TransOut a inner join TransOutDetail b on a.OutNo = b.OutNo where a.OutNo = ?', outNo, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)//kalau bukan SP by defualt langsung Row, jadi tidak pakai result[0] seperti exec sp
        })
    })
}
