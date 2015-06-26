require("angular");

var app = angular.module("job-recovery", []);

var max = 0;
var min = 0;

jobsDataWA.forEach(function(bracket) {
  var width = bracket.total / 100;
  if (width < min) { min = width }
  if (width > max) { max = width }
});

min *= -1;
var totalWidth = max + min;

var parseData = function(data) {
  data.forEach(function(bracket) {
    var width = bracket.total / 100;
    if (width < 0) { 
      bracket.firstWidth = (min + width) / min * 100;
      bracket.secondWidth = (width * -1) / min * 100;
      bracket.secondWidth = bracket.secondWidth < 1 ? 1 : bracket.secondWidth;
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
};

parseData(jobsDataWA);
parseData(jobsDataKC);
parseData(jobsDataNKC);

app.controller("JobsController", ["$scope", function($scope) {
  $scope.brackets = jobsDataKC;
  $scope.selected = 'kc';
  $scope.currentShown = 0;
  $scope.switchView = function(view) {
    if (view == 'wa') { $scope.brackets = jobsDataWA }
    if (view == 'kc') { $scope.brackets = jobsDataKC }
    if (view == 'nkc') { $scope.brackets = jobsDataNKC }
    $scope.selected = view;
  };
  $scope.showInfo = function(bracket) {
    if ($scope.currentShown == bracket) {
      $scope.currentShown = null;
    } else {
      $scope.currentShown = bracket;
    }
  };
}]);

