
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {
  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {latitude: req.results.lat, longitude: req.results.lng
    };
  }

  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } 
    else {
      console.log("CREATED LISTING");
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
/* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res,next) {
  var updated_listing = req.listing;
  
  updated_listing.name = req.body.name;
  updated_listing.code = req.body.code;
  if(req.results) {
    updated_listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }
    /* Replace the article's properties with the new properties found in req.body */
  /* save the coordinates (located in req.results if there is an address property) */
  /* Save the article */
  Listing.findOneAndUpdate({_id: req.params.listingId}, updated_listing ).exec(function(err,listing){
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } 
    else {
      res.json(updated_listing);
    }

  });

};

/* Delete a listing */
exports.delete = function(req, res,next) {
  var listing = req.listing;

  Listing.remove({code: listing.code},function(err){
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } 
    else {
      console.log('Deletion Complete');
      res.json(listing);
    }
  });
  

  /* Remove the article */
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /* Your code here */
  Listing.find().sort('code').exec(function(err,listings){
    if(err) {
      
      res.status(400).send(err);
    } 
    else {
      res.json(listings);
    }  })
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(404).send(err);
    }
     else {
      req.listing = listing;
      next();
    }
  });
};