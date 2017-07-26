'use strict';
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');
module.exports = function(app) {
  app.route('/api/medical').all(articlesPolicy.isAllowed)
    .get(articles.read);
  app.route('/api/medical/:medicalId').all(articlesPolicy.isAllowed)
    .get(articles.read);
	app.param('medicalId', articles.medicalByID);
};
