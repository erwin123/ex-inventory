var TransOut = require('../models/TransOut');
//const config = require('../config');
var express = require('express');
var router = express.Router();
var async = require('async');

router.get('/', function (req, res, next) {
    TransOut.getAllTransOut(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});
router.post('/transout_cr/', function (req, res, next) {
    if (req.body) {
        TransOut.getAllTransOutByCriteria(function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});
router.post('/updatestatus/', function (req, res, next) {
    if (req.body) {
        TransOut.updateAssetStatus(req.body.AssetNo, 0, function (errStatus, resultStatus) {
            if (errStatus) { res.json(errStatus); }
            else { res.json(resultStatus); }
        })
    }
});
router.post('/updatedetailstatus/', function (req, res, next) {
    if (req.body) {
        TransOut.updateOutDetailStatus(req.body.OutNo, 1, function (errStatus, resultStatus) {
            if (errStatus) { res.json(errStatus); }
            else { res.json(resultStatus); }
        })
    }
});
router.post('/', function (req, res, next) {
    TransOut.insertTransOut(req.body, function (err, resultInsert) {
        if (err) { res.json(err); } else {
            let out = req.body;
            async.eachSeries(out.Detail, (item, callback) => {
                item.OutNo = resultInsert[0].OutNo;
                TransOut.insertTransOutDetail(item, function (errDetail, resultDetail) {
                    if (errDetail) { callback(errDetail); res.json(errDetail); }
                    else {
                        TransOut.updateAssetStatus(item.AssetNo, 2, function (errStatus, resultStatus) {
                            if (errDetail) { callback(errStatus); res.json(errStatus); }
                            else {
                                callback();
                            }
                        })
                    }
                });
            }, (err) => {
                res.json(resultInsert);
            });
        }
    });
});
router.put('/', function (req, res, next) {
    TransOut.updateTransOut(req.body, function (err, rows) {
        if (err) { res.json(err); } else { res.json(rows); }
    });
});
router.delete('/:key', function (req, res, next) {
    TransOut.deleteTransOut(req.params.key, function (err, rows) {
        if (err) { res.json(err); } else { res.json(rows); }
    });
});

router.get('/sibling/:key', function (req, res, next) {
    TransOut.getSiblingDetail(req.params.key,function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});
module.exports = router;