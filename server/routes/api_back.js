var TransBack = require('../models/TransBack');
//const config = require('../config');
var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    TransBack.getAllTransBack(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});
router.post('/transback_cr/', function (req, res, next) {
    if (req.body) {
        TransBack.getAllTransBackByCriteria(function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});
router.post('/', function (req, res, next) {
    TransBack.insertTransBack(req.body, function (err, resultInsert) {
        if (err) { res.json(err); } else {
            res.json(resultInsert);
        }
    });
});
router.put('/', function (req, res, next) {
    TransBack.updateTransBack(req.body, function (err, rows) {
        if (err) { res.json(err); } else { res.json(rows); }
    });
});
router.delete('/:key', function (req, res, next) {
    TransBack.deleteTransBack(req.params.key, function (err, rows) {
        if (err) { res.json(err); } else { res.json(rows); }
    });
});

module.exports = router;