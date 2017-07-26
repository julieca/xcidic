(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['articleResolve'];

  function ArticlesListController(articleResolve) {
    var vm = this;

    vm.articles = articleResolve;
  }
}());
