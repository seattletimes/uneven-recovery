require("angular");

var app = angular.module("job-recovery", []);

var max = 0;
var min = 0;

jobsData.forEach(function(bracket) {
  var width = bracket.total / 100;
  if (width < min) { min = width }
  if (width > max) { max = width }
});

min *= -1;
var totalWidth = max + min;

jobsData.forEach(function(bracket) {
  var width = bracket.total / 100;
  if (width < 0) { 
    bracket.firstWidth = (min + width) / totalWidth * 100;
    bracket.secondWidth = (width * -1) / totalWidth * 100;
    bracket.thirdWidth = max / totalWidth * 100;
  }
  if (width > 0) { 
    bracket.firstWidth = min / totalWidth * 100;
    bracket.secondWidth = width / totalWidth * 100;
    bracket.thirdWidth = (max - width) / totalWidth * 100;
  }
});

app.controller("JobsController", ["$scope", function($scope) {
  $scope.brackets = jobsData;
}]);