'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
  name: String,
  id: String,
  image: String,
  patrons: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

Bar.methods.addPatron = function(patron, cb) {
  const model = this;
  model.patrons.push(patron._id);
  model.save(function(err) {
    if(err) throw err;
    cb(model.patrons.length);
  });
}

Bar.methods.removePatron = function(patron) {
  let index = this.patrons.indexOf(patron._id);
  this.patrons.splice(index, 1);
}

Bar.methods.getPatronCount = function() {
  return this.patrons.length;
}

Bar.statics.findLocalBars = function(location, cb) {
  const yelp = require('yelp-fusion');
  const clientId = process.env.YAHOO_KEY;
  const clientSecret = process.env.YAHOO_SECRET;
  const model = this;

  const searchRequest = {
    term: 'bar',
    location: location
  };

  yelp.accessToken(clientId, clientSecret).then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    client.search(searchRequest).then(response => {
      response.jsonBody.businesses.forEach((business, index) => {
        model
          .findOneAndUpdate({'id': business.id}, {new: true})
          .exec((err, bar) => {
            if(err) { throw err; }
            bar.name = business.name;
            bar.id = business.id;
            bar.image = business.image_url;
            bar.save();
          });
        console.log(index + ': ' + bar.name);
      });
      model.count({}, (err, count) => { console.log(count) });
      cb();
    });
  }).catch(e => {
    console.log(e);
  });
}

module.exports = mongoose.model('Bar', Bar);


