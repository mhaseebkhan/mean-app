'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Product Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  price: {
   type: String,
   required: true,
   trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
ProductSchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

ProductSchema.path('genre').validate(function(genre) {
  return !!genre;
}, 'Genre cannot be blank');

ProductSchema.path('price').validate(function(price) {
  return !!price;
}, 'Price cannot be blank');

/**
 * Statics
 */
ProductSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Product', ProductSchema);
