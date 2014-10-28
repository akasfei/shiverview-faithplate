(function (angular) {
angular.module('shiverview')
.controller('faithplateAllCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
  $scope.get = function (path) {
    $http({
      url: '/faithplate/events',
      method: 'get'
    })
    .success(function (data) {
      $scope.events = data;
    })
    .error(function (err) {
      $rootScope.$broadcast('errorMessage', 'An error has ocurred. Please try again later.');
    });
  };
  $scope.get();
}])
.controller('faithplateDetailCtrl', ['$scope', '$http', '$rootScope', '$routeParams', 'user', function ($scope, $http, $rootScope, $routeParams, user) {
  $scope.user = user.get();
  if (typeof $scope.user.then === 'function')
    $scope.user.success(function () { $scope.user = user.get(); $scope.allowBooking = true; });
  $http({
    url: '/faithplate/events',
    method: 'get',
    params: {id: $routeParams.id}
  })
  .success(function (data) {
    if (data && data.length < 1)
      $scope.event = {title: 'Event not found'};
    else
      $scope.event = data[0];
  })
  .error(function (err) {
    $rootScope.$broadcast('errorMessage', 'An error has ocurred. Please try again later.');
  });
}])
.controller('faithplateMECtrl', ['$scope', '$http', '$rootScope', '$location', '$upload', 'user', function ($scope, $http, $rootScope, $location, $upload, user) {
  $scope.user = user.get();
  if (typeof $scope.user === 'undefined')
    $location.path('/users/signin');
  else if (typeof $scope.user.then === 'function')
    $scope.user.success(function () { $scope.user = user.get(); $scope.get(); }).error(function () { $location.path('/users/signin'); });
  $scope.payload = {};
  $scope.get = function (path) {
    $http({
      url: '/faithplate/events',
      method: 'get',
      params: {c: $scope.user.name}
    })
    .success(function (data) {
      $scope.events = data;
    })
    .error(function (err) {
      $rootScope.$broadcast('errorMessage', 'An error has ocurred. Please try again later.');
    });
  };
  $scope.submit = function (e) {
    if (e) e.preventDefault();
    var method = 'put';
    if ($scope.update === true)
      method = 'post';
    $http({
      url: '/faithplate/events',
      method: method,
      data: $scope.payload
    })
    .success(function () {
      $scope.showEditor = false;
      $rootScope.$broadcast('successMessage', 'Your changes have been saved.');
      $scope.get();
    })
    .error(function (err, status) {
      $rootScope.$broadcast('errorMessage', 'An error has ocurred. Please try again later.');
    });
  };
  $scope.create = function () {
    $scope.update = false;
    $scope.showEditor = true;
    $scope.payload = {};
  };
  $scope.edit = function (index) {
    if (typeof $scope.events === 'undefined') return;
    $scope.update = true;
    $scope.payload._id = $scope.events[index]._id;
    $scope.payload.title = $scope.events[index].title;
    $scope.payload.desc = $scope.events[index].desc;
    $scope.showEditor = true;
  };
  $scope.delete = function (index) {
    if (typeof $scope.events === 'undefined') return;
    $http({
      url: '/faithplate/events',
      method: 'delete',
      params: {_id: $scope.events[index]._id}
    })
    .success(function () {
      $scope.events.splice(index, 1);
      $rootScope.$broadcast('successMessage', 'The event has been removed.');
    })
    .error(function () {
      $rootScope.$broadcast('errorMessage', 'An error has ocurred. Please try again later.');
    });
  };
  $scope.cancel = function () {
    $scope.showEditor = false;
    $scope.imageUploaded = false;
  };
  $scope.removeImage = function () {
    delete $scope.payload.coverimg;
    $scope.imageUploaded = false;
  }
  $scope.upload = function ($files) {
    $scope.progress = 0;
    $rootScope.$broadcast('setProgress', 0);
    $upload.upload({
      url: '/users/usercontent/faithplate/img',
      file: $files[0]
    })
    .progress(function (e) {
      $rootScope.$broadcast('setProgress', parseInt(100.0 * e.loaded / e.total));
    })
    .success(function (data) {
      $rootScope.$broadcast('setProgress', 100);
      if (data.path) {
        $scope.imageUploaded = true;
        $scope.payload.coverimg = data.path;
      }
    });
  };
  $scope.openFileSelect = function () {
    var input = document.getElementById('file-input');
    var event = new MouseEvent('click', {'view': window, 'bubbles': true, 'calcelable': true});
    input.dispatchEvent(event);
  };
}]);
})(window.angular);
