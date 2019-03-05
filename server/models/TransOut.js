var db = require('../connection/dbconnection');
db.connect(db.trx, (done) => { });

exports.getAllTransOut = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('SELECT Id ,OutNo ,AssetNo ,Kelengkapan ,Notes ,OutDate ,Project ,PIC FROM TransOut', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}
exports.getAllTransOutByCriteria = function (TransOut, done) {
    var wh = db.whereCriteriaGenerator(TransOut);
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('SELECT Id ,OutNo ,AssetNo ,Kelengkapan ,Notes ,OutDate ,Project ,PIC FROM TransOut' + wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertTransOut = function (TransOut, done) {
    var values = [TransOut.AssetNo, TransOut.Kelengkapan, TransOut.Notes, TransOut.OutDate, TransOut.Project, TransOut.PIC];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('CALL sp_Out(?,?,?,?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}
exports.updateTransOut = function (TransOut, done) {
    var values = [TransOut.AssetNo, TransOut.Kelengkapan, TransOut.Notes, TransOut.OutDate, TransOut.Project, TransOut.PIC, TransOut.OutNo];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('UPDATE TransOut SET AssetNo=?,Kelengkapan=?,Notes=?,OutDate=?,Project=?,PIC=? WHERE OutNo = ?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}
exports.deleteTransOut = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('DELETE FROM TransOut WHERE OutNo=? ', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.insertTransOutDetail = function (TransOutDetail, done) {
    var values = [TransOutDetail.AssetNo, TransOutDetail.OutNo];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('CALL sp_OutDetail(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateAssetStatus = function (ItemNo,Status, done) {
    var values = [Status, ItemNo];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('UPDATE AssetNotebook SET Status = ? WHERE ItemNo = ?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.updateOutDetailStatus = function (OutNo,Status, done) {
    var values = [Status,OutNo];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('UPDATE TransOutDetail SET Back = ? WHERE OutNo = ?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.getSiblingDetail = function (AssetNo, done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('CALL sp_GetOut(?)', AssetNo, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}