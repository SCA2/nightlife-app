'use strict';

var path = process.cwd();
var BarHandler = require(path + '/app/controllers/barHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  var barHandler = new BarHandler();

  app.route('/')
    .get(function (req, res) {
      res.redirect('/api/bars');
    });

  app.route('/login')
    .get(function (req, res) {
      res.redirect('/auth/github');
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/api/bars');
    });

  app.route('/profile')
    .get(isLoggedIn, function (req, res) {
      res.render(path + '/app/views/users/profile.pug');
    });

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/api/bars')
    .get(barHandler.getBars);

  app.route('/api/bars/:bar_id')
    .get(barHandler.getBar);

  app.route('/api/bars/:bar_id/patrons')
    .get(barHandler.getPatronCount)
    .post(isLoggedIn, barHandler.addPatron)
    .delete(isLoggedIn, barHandler.removePatron);

  // app.route('/api/:id')
  //   .get(isLoggedIn, function (req, res) {
  //     res.json(req.user.github);
  //   });
};
