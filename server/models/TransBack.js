var db = require('../connection/dbconnection');
db.connect(db.trx, (done) => { });


exports.getAllTransBack = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('SELECT Id ,OutNo ,OutBackNo ,AssetNo ,Kelengkapan ,Notes ,BackDate ,PIC ,Receiver FROM TransBack', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}
exports.getAllTransBackByCriteria = function (TransBack, done) {
    var wh = db.whereCriteriaGenerator(TransBack);
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('SELECT Id ,OutNo ,OutBackNo ,AssetNo ,Kelengkapan ,Notes ,BackDate ,PIC ,Receiver FROM TransBack' + wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}
exports.insertTransBack = function (TransBack, done) {
    var values = [TransBack.OutNo, TransBack.AssetNo, TransBack.Kelengkapan, TransBack.Notes,
        TransBack.BackDate, TransBack.Receiver, TransBack.PIC];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('CALL sp_Back(?,?,?,?,?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}
exports.updateTransBack = function (TransBack, done) {
    var values = [TransBack.OutNo, TransBack.AssetNo, TransBack.Kelengkapan, TransBack.Notes, TransBack.BackDate, TransBack.PIC, TransBack.Receiver, TransBack.OutBackNo];
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('UPDATE TransBack SET OutNo=?,AssetNo=?,Kelengkapan=?,Notes=?,BackDate=?,PIC=?,Receiver=? WHERE OutBackNo = ?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}
exports.deleteTransBack = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) { console.log(err); return done('Database problem') }
        connection.query('DELETE FROM TransBack WHERE OutBackNo=? ', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}