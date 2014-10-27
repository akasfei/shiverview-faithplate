(function (angular) {
angular.module('shiverview')
.controller('boilerplateHomeCtrl', ['$scope', function ($scope) {
  $scope.stuff = 'Hello Boilerplate';
  $scope.date = new Date();
}])
.controller('boilerplateFooCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.http = function (path) {
    $http({
      url: '/boilerplate/' + path,
      method: 'get'
    })
    .success(function (data) {
      if (path === 'get') {
        $scope.list = data;
      } else if (path === 'add' || path === 'drop') {
        $scope.http('get');
      }
    })
  };
  $scope.http('get');
}])
.controller('boilerplateBarCtrl', ['$scope', function ($scope) {
  $scope.stuff = 'Hello User.';
}]);
})(window.angular);
