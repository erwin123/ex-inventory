var asset = require('../models/AssetNotebook');

var express = require('express');
var router = express.Router();
const async = require('async');
const pug = require('pug');

router.get('/', function (req, res, next) {
    asset.getAllAssetNotebook(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/asset_cr/', function (req, res, next) {
    if (req.body) {
        asset.getAllAssetNotebookByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/', function (req, res, next) {
    asset.insertAssetNotebook(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/', function (req, res, next) {
    asset.updateAssetNotebook(req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/:key', function (req, res, next) {
    asset.deleteAssetNotebook(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});



//-----report---------
router.get('/historyasset/:key', function (req, res, next) {
    asset.historyAsset(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});
router.get('/historyout/:key', function (req, res, next) {
    asset.historyOut(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});
router.get('/printqr/:key', function (req, res, next) {
    asset.getAllAssetNotebook(function (err, rows) {
        if (err) { res.json(err); }
        else {
            let params = req.params.key;
            let toPrint = [];
            async.eachSeries(params.split('|'), (item, callback) => {
                toPrint.push({ItemNo: rows.find(f => f.Id == item).ItemNo});
                callback();
            }, (err) => {
                res.render('index', { toPrint });
            });
        }
    });

});

router.get('/printqrbycode/:key', function (req, res, next) {
    asset.getAllAssetNotebook(function (err, rows) {
        if (err) { res.json(err); }
        else {
            let params = req.params.key;
            let toPrint = [];
            async.eachSeries(params.split('|'), (item, callback) => {
                toPrint.push(item);
                callback();
            }, (err) => {
                res.render('index', { toPrint });
            });
        }
    });

});

module.exports = router;