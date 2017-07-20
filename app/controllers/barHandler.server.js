'use strict';

var User = require('../models/user');
var Bar = require('../models/bar');

function barHandler() {
  this.getBars = function (req, res) {
    Bar
      .find({})
      .exec(function (err, bars) {
        if (err) { throw err; }
        let user_id = req.user ? req.user.github.id : 'guest';
        res.render('../views/bars/index.pug', { bars: bars, user_id: user_id });
      });
  };

  this.getBar = function (req, res) {
    Bar.findById(req.params.bar_id, (err, bar) => {
      if(err) throw err;
      res.render('../views/bars/show.pug', { bar: bar });
    });
  };

  this.getPatronCount = (req, res) => {
    Bar
      .findById(req.params.bar_id, (err, bar) => {
        if(err) throw err;
        res.json(bar.getPatronCount());
      })
  };

  this.addPatron = (req, res) => {
    // if(!req.user) { res.end(); return; }
    Bar
      .findById(req.params.bar_id, (err, bar) => {
        if(err) throw err;
        bar.addPatron(req.user, patronCount => {
          res.json(patronCount);
        });
      });
  };

  this.removePatron = (req, res) => {
    if(!req.user) { res.end(); return; }
    Bar
      .findById(req.params.bar_id, (err, bar) => {
        if(err) throw err;
        bar.removePatron(req.user);
        bar.save(err => {
          if(err) throw err;
          res.json(bar.getPatronCount());
        });
      })
  };
}

module.exports = barHandler;
