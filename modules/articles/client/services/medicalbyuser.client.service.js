(function () {
  'use strict';

  angular
    .module('articles.medicalServiceByUser')
    .factory('MedicalServiceByUser', MedicalServiceByUser);

  MedicalServiceByUser.$inject = ['$resource'];

  function MedicalServiceByUser($resource) {
    var medicalbyuser = $resource('/api/medicalbyuser/:id', {id: '@id'}, {
        query: {method: 'get', isArray: true, cancellable: true}
      });
      return medicalbyuser;
    
  }
}());
