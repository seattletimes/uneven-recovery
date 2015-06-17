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
    bracket.firstWidth = (min + width) / min * 100;
    bracket.secondWidth = (width * -1) / min * 100;
    bracket.thirdWidth = 0;
    bracket.fourthWidth = 100;
  }
  if (width > 0) { 
    bracket.firstWidth = 100;
    bracket.secondWidth = 0;
    bracket.thirdWidth = width / max * 100;
    bracket.fourthWidth = (max - width) / max * 100;
  }
});

app.controller("JobsController", ["$scope", function($scope) {
  $scope.brackets = jobsData;
}]);