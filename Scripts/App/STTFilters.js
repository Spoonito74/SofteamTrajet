STTApp.filter('secondsToDateTime', function () {
    return function (seconds) {
        var d = new Date(0, 0, 0, 0, 0, 0, 0);
        d.setSeconds(seconds);
        return d;
    };
});
STTApp.filter('filterNames', function () {
    return function (input, listItem) {
        if (listItem == undefined) { return input; }

        var searchName = listItem.toLowerCase();
        var out = [];
        if (input != undefined) {
            for (var i = 0; i < input.length; i++) {

                var name = input[i].Name != undefined ? input[i].Name.toString().toLowerCase() : '';
                //(\bre)\w+\b
                var filterCondition = ((searchName == '') || name.slice(0, searchName.length) == searchName);


                if (filterCondition) {
                    out.push(input[i]);
                }
            }
        }
        return out;
    };
});