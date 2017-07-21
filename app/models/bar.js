'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
  name: String,
  id: String,
  image: String,
  patrons: [Schema.Types.ObjectId]
});

Bar.methods.togglePatron = function(patron, cb) {
  if(this.patrons.indexOf(patron._id) == -1) {
    this.addPatron(patron, cb);
  } else {
    this.removePatron(patron, cb);
  }
}

Bar.methods.addPatron = function(patron, cb) {
  const model = this;
  model.patrons.addToSet(patron._id);
  model.save(function(err) {
    if(err) throw err;
    cb(model.patrons.length);
  });
}

Bar.methods.removePatron = function(patron, cb) {
  const model = this;
  model.patrons.pull({ _id: patron._id});
  model.save(function(err) {
    if(err) throw err;
    cb(model.patrons.length);
  });
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


