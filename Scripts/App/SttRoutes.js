
'use strict';

var STTApp = angular.module("SofteamTravelTime", ['ngRoute', 'ngResource', 'xeditable', 'chart.js'])


STTApp.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
		.when('/GestionEmployes', {
		    controller: 'EmployeesController',
		    templateUrl: 'Templates/STTGestionEmployes.html'
		})
		.when('/GestionClients', {
		    controller: 'ClientsController',
		    templateUrl: 'Templates/STTGestionClients.html'
		})
		.when('/CalculManuel', {
		    controller: 'STTCalculManuelController',
		    templateUrl: 'Templates/STTCalculManuel.html'
		})
		.when('/GraphsDriving', {
		    controller: 'GraphDrivingCtrl',
		    templateUrl: 'Templates/STTGraphs.html'
		})
		.when('/GraphsTransport', {
		    controller: 'GraphTransportCtrl',
		    templateUrl: 'Templates/STTGraphs.html'
		})
		.otherwise({
		    redirectTo: '/GestionEmployes'
		})
    //$locationProvider.html5Mode(false).hashPrefix("!");
}]);


STTApp.controller("LocationController", function ($scope, $location) {
    $scope.$location = {};
    angular.forEach("protocol host port path search hash".split(" "), function (method) {
        $scope.$location[method] = function () {
            var result = $location[method].call($location);
            return angular.isObject(result) ? angular.toJson(result) : result;
        };
    });

    $scope.ShowView = function (viewName) {
        $location.path(viewName);
    }
});

