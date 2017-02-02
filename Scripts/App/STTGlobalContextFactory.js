STTApp.factory('STTGlobalContextFactory', function () {
    var service = {};
    var context = { date: new Date(), Employee: {}, Client: {}, AllEmployees: null, AllClients: null, currentScreen: '' };

    service.get = function () {
        return context;
    }

    service.set = function (data) {
        context = data;
        //console.log(data);
    }
    service.getCurrentScreen = function () {
        return context.currentScreen;
    }
    service.setcurrentScreen = function (value) {
        context.currentScreen = value;
        //console.log(value);
    }

    service.getDate = function () {
        return context.date;
    }
    service.setDate = function (value) {
        context.date = value;
        //console.log(value);
    }

    service.getEmployee = function () {
        return context.Employee;
    }
    service.setEmployee = function (value) {
        context.Employee = value;
        //console.log(value);
    }

    service.getClient = function () {
        return context.Client;
    }
    service.setClient = function (value) {
        context.Client = value;
        //console.log(value);
    }

    service.getAllClients = function () {
        return context.AllClients;
    }
    service.setAllClients = function (value) {
        context.AllClients = value;
        //console.log(value);
    }
    service.getAllEmployees = function () {
        return context.AllEmployees;
    }
    service.setAllEmployees = function (value) {
        context.AllEmployees = value;
        //console.log(value);
    }
    return service;
});

STTApp.controller("MainController", function ($scope, STTGlobalContextFactory) {
    $scope.data = STTGlobalContextFactory.get();

});