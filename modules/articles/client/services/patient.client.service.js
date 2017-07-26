(function () {
  'use strict';

  angular
    .module('articles.patientservice')
    .factory('PatientService', PatientService);

  PatientService.$inject = ['$resource'];

  function PatientService($resource) {
    var Patient = $resource('/api/patient/:id', {id: '@id'}, {
      query: {method: 'get', isArray: true, cancellable: true}
    });
    return Patient;
  }
}());
