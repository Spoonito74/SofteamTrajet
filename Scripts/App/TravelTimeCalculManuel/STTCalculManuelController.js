
STTApp.controller("STTCalculManuelController", function ($scope, $location, $filter, STTGlobalContextFactory, STTServerService) {
    $scope.data = STTGlobalContextFactory.get();
    $scope.date = $scope.data.date;

    $scope.DrivingTime = '';
    $scope.TransportTime = '';

    $scope.employeeNameSearch = '';
    $scope.clientNameSearch = '';

    STTGlobalContextFactory.setcurrentScreen("Calcul Individuel");

    $scope.SetDate = function () {
        STTGlobalContextFactory.setDate($scope.date);
        $scope.data = STTGlobalContextFactory.get();
    }

    $scope.Process = function () {
        $scope.TransportTime = '';
        $scope.DrivingTime == '';
        $scope.data = STTGlobalContextFactory.get();
        //console.log('Process start');
        STTServerService.GetDrivingTime(STTGlobalContextFactory.getEmployee(), STTGlobalContextFactory.getClient()).then(function (result) {
            console.log(result);
            $scope.DrivingTime = result.data.rows[0].elements[0].duration.value;
            //console.log('DrivingTime:' + $scope.DrivingTime);
            var geolocDepart = '';
            STTServerService.GetGeolocalization(STTGlobalContextFactory.getEmployee()).then(function (result) {

                geolocDepart = String(result.data.results[0].geometry.location.lng) + ';' + String(result.data.results[0].geometry.location.lat);
                var geolocArrivee = '';
                STTServerService.GetGeolocalization(STTGlobalContextFactory.getClient()).then(function (result) {
                    geolocArrivee = String(result.data.results[0].geometry.location.lng) + ';' + String(result.data.results[0].geometry.location.lat);
                    STTServerService.GetNavitia(geolocDepart, geolocArrivee, $filter('date')(new Date($scope.data.date), "yyyyMMdd") + 'T0800').then(function (result) {
                        $scope.TransportTime = result.data.journeys[0].duration;
                        //console.log('TransportTime:' + $scope.TransportTime);
                        $scope.$digest();
                    });
                });
            });
        });
    }
});