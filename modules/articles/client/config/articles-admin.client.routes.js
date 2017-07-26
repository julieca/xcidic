(function () {
  'use strict';

  angular
    .module('articles.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('admin.articles.list', {
        url: '',
        templateUrl: '/modules/articles/client/views/admin/list-articles.client.view.html',
        controller: 'ArticlesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve : {
          articleResolve : getAllArticles
        }
      })
      .state('admin.articles.create', {
        url: '/create',
        templateUrl: '/modules/articles/client/views/admin/form-article.client.view.html',
        controller: 'ArticlesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          articleResolve: newArticle,
          patientResolve : getPatient
        }
      })
      .state('admin.articles.edit', {
        url: '/medical/edit/:medicalId',
        templateUrl: '/modules/articles/client/views/admin/form-article.client.view.html',
        controller: 'ArticlesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          articleResolve: getMedicalbyID,
          patientResolve : getPatient
        }
      }).state('admin.articles.view', {
        url: '/:articleId',
        templateUrl: '/modules/articles/client/views/admin/view-article.client.view.html',
        controller: 'ArticlesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          articleResolve: getArticle
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    /*
    return ArticlesService.get({
      articleId: $stateParams.articleId
    }).$promise;
    */
    return ArticlesService.query({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }

  getPatient.$inject = ['PatientService'];
  function getPatient(PatientService){
    return PatientService.query();
  }

  getAllArticles.$inject = ['ArticlesService'];
  function getAllArticles(ArticlesService){
    return ArticlesService.query();
  }

  getMedicalbyID.$inject = ['medicalServiceByID', "$stateParams"];
  function getMedicalbyID(medicalServiceByID, $stateParams){ 
    console.log($stateParams.medicalId);
    var a= medicalServiceByID.query({
      medicalId: $stateParams.medicalId
    }).$promise;
    console.log(a);
    return a;
  }
}());

