(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['articleResolve'];

  function ArticlesAdminListController(articles) {
    var vm = this;

    vm.articles = articles;
    console.log(articles);
  }
}());
