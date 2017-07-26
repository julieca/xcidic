'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RecordSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  problem: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  medication: {
    type: String,
    default: '',
    trim: true
  }
});

var PatientSchema = new Schema({
  user : {
      type: Schema.ObjectId,
      ref: 'User'
    },
    medicalRecords : [RecordSchema]
});

var MedicalRecordsSchema = new Schema({
  doctor: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  patient: [PatientSchema]
});

mongoose.model('Article', MedicalRecordsSchema);
