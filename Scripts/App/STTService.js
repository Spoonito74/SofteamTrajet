STTApp.factory("Base64", function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
    'QRSTUVWXYZabcdef' +
    'ghijklmnopqrstuv' +
    'wxyz0123456789+/' +
    '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});

STTApp.service("STTServerService", ["Base64", "STTGlobalContextFactory", "$filter", "$http", "$resource", function (Base64, STTGlobalContextFactory, $filter, $http) {
    // Add new Contact
    var self = this;

    self.GetJsonData = function (url) {
        //console.log(url);
        var defer = $.Deferred();
        $http.get(url)
             .then(function (response) {
                 defer.resolve(response);

             },
             function (error) {
                 console.error("The async call has fail");
             });
        return defer.promise();
    }

    self.SaveJsonData = function (url, dataToSave) {       
        var defer = $.Deferred();

        $http({
            method: 'POST',
            url: url,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.toJson(dataToSave),
        })
       /* $http.post(url, angular.toJson(dataToSave))*/
            .then(function (response) {
                defer.resolve(response);
            },
            function (data, status, error, config) {
                alert("Error: " + error + " Une erreur est survenue lors de la sauvegarde " + url + ".\nStatus: " + status);
            });
        return defer.promise();
    };

    self.GoogleMapDirections = function (depart, arrivee) {

        var directionsService = new google.maps.DirectionsService();

        function calcRoute() {

            var request = {
                origin: depart,
                destination: arrivee,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        }
    }

    function transformAddress(address) {
        var add = '';

        if (address) {
            if (address.Rue) {
                add = address.Rue.replace(/\s+/g, '+');
            }
            if (address.Ville) {
                add += '+' + address.Ville.replace(/\s+/g, '+');
            }
            if (address.CodePostal) {
                add += '+' + String(address.CodePostal).replace(/\s+/g, '+');
            }
        }
        return add;
    }

    self.GetDrivingTime = function (depart, arrivee) {

        var url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
        url += '?origins=' + transformAddress(depart);
        url += '&destinations=' + transformAddress(arrivee);

        //console.log('GetDrivingTime:' + url);
        //$http.jsonp(url);

        var defer = $.Deferred();

        $http.get(url).then(function (response, status, headers, config) {
            defer.resolve(response);
        },
			function (error) {
			    console.error("The async call has fail " + error + ' ==> GetDrivingTime:' + url);
			});
        return defer.promise();
    }

    self.GetGeolocalization = function (address) {

        var url = 'https://maps.googleapis.com/maps/api/geocode/json';
        url += '?address=' + transformAddress(address);

        //console.log('GetGeolocalization:' + url);
        //$http.jsonp(url);

        var defer = $.Deferred();

        $http.get(url).then(function (response, status, headers, config) {
            defer.resolve(response);
        },
			function (error) {
			    console.error('The async call has fail ' + error + ' ==> GetGeolocalization:' + url);
			});
        return defer.promise();
    }

    self.GetNavitia = function (depart, arrivee, date) {

        //http://api.navitia.io/v1/journeys?from=-122.4752;37.80826&to=-122.402770;37.794682&datetime=20140119T0800.
        var url = 'http://api.navitia.io/v1/journeys';
        url += '?from=' + depart;
        url += '&to=' + arrivee;
        url += '&datetime=' + date;

        //console.log('GetNavitia:' + url);
        // $http.jsonp(url);
        var defer = $.Deferred();

        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('a0866845-f2e8-46c6-bdd0-b3a4afa5cefe' + ':' + '');

        $http.get(url).then(function (response, status, headers, config) {
            defer.resolve(response);

        },
			function (error) {
			    console.error("The async call has fail " + error + ' ==> GetNavitia:' + url);
			});
        return defer.promise();
    }

    self.GetDrivingTimeByResource = function (depart, arrivee) {
        return $resource('http://maps.googleapis.com/maps/api/directions/json', {}, {
            query: {
                method: 'JSONP',
                params: { callback: "JSON_CALLBACK", origin: "21+Rue+Victor+Hugo+Paris", destination: "5+Square+Saint+Exupéry+92500" },
                callback: "JSON_CALLBACK"
            }
        });
    }

    self.CalculateTime = function () {

        var employee = STTGlobalContextFactory.getEmployee();
        employee.Temps = {}

        var client = STTGlobalContextFactory.getClient();

        self.GetDrivingTime(employee, client).then(function (result) {
            //console.log(result);
            if (result.data.rows.length > 0 && result.data.rows[0].elements.length >= 0) {
                employee.Temps.Driving = result.data.rows[0].elements[0].duration.value;
            }
            var geolocDepart = '';
            self.GetGeolocalization(employee).then(function (result) {
                //console.log(result);
                if (result.data.results.length > 0) {
                    geolocDepart = String(result.data.results[0].geometry.location.lng) + ';' + String(result.data.results[0].geometry.location.lat);
                    //console.log(geolocDepart);
                    var geolocArrivee = '';
                    self.GetGeolocalization(client).then(function (result) {
                        if (result.data.results.length > 0) {
                            geolocArrivee = String(result.data.results[0].geometry.location.lng) + ';' + String(result.data.results[0].geometry.location.lat);
                            self.GetNavitia(geolocDepart, geolocArrivee, $filter('date')(new Date(STTGlobalContextFactory.getDate()), "yyyyMMdd") + 'T0800').then(function (result) {
                                //console.log(result);
                                if (result.data.journeys.length > 0) {
                                    employee.Temps.Transport = result.data.journeys[0].duration;
                                }
                            });
                        }
                    });
                }
            });

        });
    }
}]);