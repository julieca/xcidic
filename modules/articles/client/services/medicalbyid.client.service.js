(function () {
  'use strict';

  angular
    .module('articles.medicalServiceByID')
    .factory('medicalServiceByID', medicalServiceByID);

  medicalServiceByID.$inject = ['$resource'];

  function medicalServiceByID($resource) {
      var medicalId = $resource('/api/medical/:medicalId', {medicalId: '@medicalId'}, {
        query: {method: 'get', isArray: true, cancellable: true}
      });
      return medicalId;
    
  }
}());
