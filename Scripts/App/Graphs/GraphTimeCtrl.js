STTApp.controller("GraphDrivingCtrl", function ($scope, $filter, STTGlobalContextFactory) {
   

    Init();


    function Init() {
        STTGlobalContextFactory.setcurrentScreen("Répartition pour les temps de trajet en voiture");

        $scope.labels = ["5 min au plus", "5 à 15 min", "15 à 30 min", "30 à 45 min", "45 min à 1h", "1h à 1h15", " plus de 1h15"];
        $scope.Type = 'Driving';

        $scope.CountEmployeesTime = function () {
            $scope.Less5 = 0;
            $scope.From5To15 = 0;
            $scope.From15To30 = 0;
            $scope.From30To45 = 0;
            $scope.From45To60 = 0;
            $scope.From60To75 = 0;
            $scope.MoreThan75 = 0;

            if (STTGlobalContextFactory.getAllEmployees() != null) {
                angular.forEach(STTGlobalContextFactory.getAllEmployees().Employees, function (item) {
                    var min = 0;
                    if ($scope.Type == 'Driving') {
                        min = item.Temps.Driving / 60;
                    }
                    else {
                        min = item.Temps.Transport / 60;
                    }
                    if (min <= 5) {
                        $scope.Less5++;
                    }
                    else if (min <= 15) {
                        $scope.From5To15++;
                    }
                    else if (min <= 30) {
                        $scope.From15To30++;
                    }
                    else if (min <= 45) {
                        $scope.From30To45++;
                    }
                    else if (min <= 60) {
                        $scope.From45To60++;
                    }
                    else if (min <= 75) {
                        $scope.From60To75++;
                    }
                    else if (min > 75) {
                        $scope.MoreThan75++;
                    }
                });
            }
        };
        $scope.CountEmployeesTime();
        $scope.data = [$scope.Less5, $scope.From5To15, $scope.From15To30, $scope.From30To45, $scope.From45To60, $scope.From60To75, $scope.MoreThan75];

   
    }

   
});

STTApp.controller("GraphTransportCtrl", function ($scope, $filter, STTGlobalContextFactory) {


    Init();


    function Init() {
        STTGlobalContextFactory.setcurrentScreen("Répartition pour les temps de trajet en transports en commun");

        $scope.labels = ["5 min au plus", "5 à 15 min", "15 à 30 min", "30 à 45 min", "45 min à 1h", "1h à 1h15", " plus de 1h15"];
        $scope.Type = 'Transport';

        $scope.CountEmployeesTime = function () {
            $scope.Less5 = 0;
            $scope.From5To15 = 0;
            $scope.From15To30 = 0;
            $scope.From30To45 = 0;
            $scope.From45To60 = 0;
            $scope.From60To75 = 0;
            $scope.MoreThan75 = 0;

            if (STTGlobalContextFactory.getAllEmployees() != null) {
                angular.forEach(STTGlobalContextFactory.getAllEmployees().Employees, function (item) {
                    var min = 0;
                    if ($scope.Type == 'Driving') {
                        min = item.Temps.Driving / 60;
                    }
                    else {
                        min = item.Temps.Transport / 60;
                    }
                    if (min <= 5) {
                        $scope.Less5++;
                    }
                    else if (min <= 15) {
                        $scope.From5To15++;
                    }
                    else if (min <= 30) {
                        $scope.From15To30++;
                    }
                    else if (min <= 45) {
                        $scope.From30To45++;
                    }
                    else if (min <= 60) {
                        $scope.From45To60++;
                    }
                    else if (min <= 75) {
                        $scope.From60To75++;
                    }
                    else if (min > 75) {
                        $scope.MoreThan75++;
                    }
                });
            }
        };
        $scope.CountEmployeesTime();
        $scope.data = [$scope.Less5, $scope.From5To15, $scope.From15To30, $scope.From30To45, $scope.From45To60, $scope.From60To75, $scope.MoreThan75];


    }


});