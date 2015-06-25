require("angular");
var app = angular.module("home-values", []);

app.controller("HomeController", ["$scope", function($scope) {
  var all = homeData;

  $scope.search = debounce(function() {
    var value = $scope.searchText;

    if (!value) {
      $scope.found = [];
    } else {
      value = value.toLowerCase();
      var filtered = all.filter(function(item) {
        return item.city.toLowerCase().indexOf(value) == 0;
      });
      $scope.found = filtered;
    }
    $scope.$apply();
  });

  $scope.found = [];
}]);

var debounce = function(f, interval) {
  var timeout = null;
  return function() {
    if (timeout) return;
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    timeout = setTimeout(function() {
      f.apply(null, args);
      timeout = null;
    }, interval || 400);
  };
};
