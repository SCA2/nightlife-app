'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  github: {
    id: String,
    displayName: String,
    username: String,
    publicRepos: Number
  },
  bars: [{type: Schema.Types.ObjectId, ref: 'Bar'}]
});

module.exports = mongoose.model('User', User);
