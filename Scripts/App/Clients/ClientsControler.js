STTApp.controller("ClientsController", function ($scope, STTGlobalContextFactory, STTServerService) {
    Init();


    function Init() {
        $scope.data = {};
        STTGlobalContextFactory.setcurrentScreen("Gestions des Clients");

        $scope.GetClients = function () {
            if (STTGlobalContextFactory.getAllClients() === null) {
                //console.log('GetJsonData /Data/clients.json');
                STTServerService.GetJsonData('/Data/clients.json').then(function (result) {
                    $scope.data = result.data;
                    STTGlobalContextFactory.setAllClients($scope.data);
                });
            }
            else
                $scope.data = STTGlobalContextFactory.getAllClients();
        }

        $scope.GetClients();
    }
    $scope.Current = function () { return STTGlobalContextFactory.getClient() };

    $scope.SetContext = function (value) { STTGlobalContextFactory.setClient(value); };
    $scope.showClient = function (data) {
        var selected = {};
        if (data.ClientId >= 0) {
            selected = $filter('filter')($scope.data.Clients, { value: data.ClientId });
        }
        return 'Aucun';
    };

    $scope.addClient = function () {
        $scope.inserted = {
            id: $scope.data.Clients.length + 1,
            Name: '',
            Code: '',
            CodePostal: null,
            Ville: '',
            Rue: ''
        };
        $scope.data.Clients.push($scope.inserted);
    };

    $scope.removeClient = function (index) {
        $scope.data.Clients.splice(index, 1);
    };

    $scope.messagesave = '';

    $scope.EraseMessageSave = function () {
        $scope.messagesave = '';
    }

    $scope.SaveClients = function () {
        $scope.EraseMessageSave();
        STTGlobalContextFactory.setAllClients($scope.data);
        $scope.messagesave = String($scope.data.Clients.length) + ' clients ont été sauvés';
        //STTServerService.SaveJsonData('/Data/clients.json', $scope.data).then(function (result) {
        //    $scope.message = "TODO (Server side Development)";
        //});
    }
});