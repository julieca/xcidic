'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var self = this;
/**
 * Create an article
 */
exports.create = function (req, res) {
  var medicalRecordsObj = {
    problem : req.body.problem,
    medication : req.body.medication
  }
  var patientObj = {
    user : req.body.patient,
    medicalRecords : [ medicalRecordsObj]};
  var obj = {
    doctor : req.user,
    patient : [patientObj]
  };
  


  Article.find(
    {doctor:req.user._id},
    'patient.user'
  ).exec(function (err, result) {
    if (err) {
      return next(err);
    } 
    if (result.length>0){
        var test = 0;
        for (var i=0; i< result[0].patient.length; i++){
            if (result[0].patient[i].user == req.body.patient._id){
              test = 1;
              break;
            }
        }

        if (test==1){
            Article.update(     
              { doctor:req.user._id, 
                patient : {$elemMatch : {"user" : req.body.patient._id}}},        
              { $push : {"patient.$.medicalRecords" : medicalRecordsObj}}).exec();
        }else{
          Article.update(     
              { doctor:req.user._id},        
              { $push : {patient : patientObj}}).exec();
        }
        res.json(obj);
    }else{
      var article = new Article(obj);
      article.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(article);
        }
      });
    }
  });
  
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  //var article = req.article ? req.article.toJSON() : {};
  var article = req.article ? req.article : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = !!(req.user && article.user && article.user._id.toString() === req.user._id.toString());

  res.json(article);


};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {

  Article.find({doctor :req.user._id}).sort('-created').populate("patient.user").exec(function (err, articles) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }
  
  Article.find({
    doctor : req.user._id,
    patient : {$elemMatch : {"user" :id}}
  }).sort({created : -1}).select({ 
    "patient.$.medicalRecords" : 1, _id :0 
  }).populate("patient.user")
  .exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};


exports.getPatient = function (req, res) {
  User.find({
    roles : { $in : ['user'] }
  }).sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

exports.listByUser = function (req, res) {
  Article.find({"patient.user" :req.user._id})
    .sort('-created')
    .select({ "patient.$" : 1, _id :0, doctor:1 })
    .populate("doctor").exec(function (err, articles) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

exports.medicalByID = function (req, res, next, id) {
  console.log(req.user);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }
  Article.aggregate(
    {'$unwind': '$patient'},
    {'$unwind': '$patient.medicalRecords'},
    {'$match' : {'patient.medicalRecords._id': new mongoose.Types.ObjectId(id)}},  
    {'$project' : { 'patient.medicalRecords': 1, "_id":0 }}
  ).exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    //res.json(article);
    req.article = article;
    next();
  });
};