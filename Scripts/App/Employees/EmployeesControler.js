STTApp.controller("EmployeesController", function ($scope, $location, $filter, STTGlobalContextFactory, STTServerService) {
    Init();


    function Init() {
        $scope.date = STTGlobalContextFactory.getDate();
        STTGlobalContextFactory.setcurrentScreen("Gestions des employés");
        $scope.data = {};
        $scope.Clients = {};
        $scope.CalulMode = false;

        $scope.GetEmployees = function () {
            if (STTGlobalContextFactory.getAllEmployees() === null) {
                STTServerService.GetJsonData('/Data/employees.json').then(function (result) {
                    $scope.data = result.data;
                    STTGlobalContextFactory.setAllEmployees($scope.data);
                });
            }
            else
                $scope.data = STTGlobalContextFactory.getAllEmployees();
        }

        $scope.loadClients = function () {
            if (STTGlobalContextFactory.getAllClients() === null) {
                STTServerService.GetJsonData('/Data/clients.json').then(function (result) {
                    $scope.Clients = result.Clients;
                    STTGlobalContextFactory.setAllClients(result.data);
                });
            }
            else
                $scope.Clients = STTGlobalContextFactory.getAllClients().Clients;

            //return $scope.Clients;
        };

        $scope.GetEmployees();
        $scope.loadClients();
    }

    $scope.Current = function () { return STTGlobalContextFactory.getEmployee() };
    $scope.SetContext = function (value) { STTGlobalContextFactory.setEmployee(value); };

    $scope.GetClient = function (employee) {
        if (employee && $scope.Clients) {
            if (employee.ClientId && $scope.Clients.length > 0) {
                var selected = $filter('filter')($scope.Clients, { Id: employee.ClientId });
                if (selected.length > 0) {
                    return selected[0];
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };

    $scope.SetDate = function () {
        STTGlobalContextFactory.setDate($scope.date);
    }

    $scope.showClient = function (employee) {
        var client = $scope.GetClient(employee);
        if (client != null) {
            return client.Name + '-' + client.Code;
        }
        else {
            return 'Aucun';
        }
    };

    $scope.addEmployee = function () {
        $scope.inserted = {
            id: $scope.data.Employees.length + 1,
            Name: '',
            Surname: '',
            CodePostal: null,
            Ville: '',
            Rue: '',
            ClientId: -1
        };
        $scope.data.Employees.push($scope.inserted);
    };

    $scope.removeEmployee = function (index) {
        $scope.data.Employees.splice(index, 1);
    };

    $scope.messagesave = '';

    $scope.SaveEmployees = function () {
        $scope.EraseMessageSave();
        STTGlobalContextFactory.setAllEmployees($scope.data);
        $scope.messagesave = String($scope.data.Employees.length) + ' employés ont été sauvés';
        //STTServerService.SaveJsonData('/Data/employees.json',$scope.data).then(function (result) {
        //    $scope.message="TODO (Server side Development)";
        //});
    }

    $scope.EraseMessageSave = function () {
        $scope.messagesave = '';
    }

    $scope.messageCalculIntermediate = '';
    $scope.messageCalculFinal = '';
    $scope.EraseMessageCalculIntermediate = function () {
        $scope.messageCalculIntermediate = '';
    }

    $scope.EraseMessageCalculFinal = function () {
        $scope.messageCalculFinal = '';
    }

    $scope.CalculTimes = function () {
        $scope.CalulMode = true;
        var counter = 0;
        $scope.EraseMessageCalculFinal();
        $scope.EraseMessageCalculIntermediate();

        var lastClientId = -1;
        angular.forEach($scope.data.Employees, function (value) {

            if (value != null)
            {
                if (value.ClientId > 0)
                    lastClientId = value.ClientId;
                else
                    value.ClientId = lastClientId;
            }

            $scope.SetContext(value);
            STTGlobalContextFactory.setClient($scope.GetClient(value));

            STTServerService.CalculateTime();
            counter++;
            $scope.messageCalculIntermediate = "Calcul de " + String(counter) + " employés";
        });
        $scope.messageCalculFinal = 'Fin du calcul';
    };

    $scope.ResetClient = function () {
        angular.forEach($scope.data.Employees, function (value) {
            if (value != null) {
                value.ClientId = -1;
            }

            $scope.SetContext(value);
            STTGlobalContextFactory.setClient($scope.GetClient(value));
        });
        $scope.messageCalculFinal = 'Fin du ResetClient';
    };

});