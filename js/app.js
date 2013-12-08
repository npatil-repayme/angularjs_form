/**
 * AngularJS module to process a form.
 */
angular.module('myApp', ['ajoslin.promise-tracker'])
  .controller('help', function ($scope, $http, $log, promiseTracker) {
    $scope.subjectListOptions = {
      'bug': 'Report a Bug',
      'account': 'Account Problems',
      'mobile': 'Mobile',
      'user': 'Report a Malicious User',
      'video': 'Video',
      'other': 'Other'
    };

    // Form submit handler.
    $scope.submit = function(form) {
      // Trigger validation flag.
      $scope.submitted = true;

      // If form is invalid, return and let AngularJS show validation errors.
      if (form.$invalid) {
        return;
      }

      // Default values for the request.
      $scope.progress = promiseTracker('progress');
      var config = {
        params : {
          'callback' : 'JSON_CALLBACK',
          'feedbackTypeList' : 'help',
          'name' : $scope.name,
          'email' : $scope.email,
          'subjectList' : $scope.subjectList,
          'url' : $scope.url,
          'comments' : $scope.comments
        },
        tracker : 'progress'
      };

      // Perform JSONP request.
      $http.jsonp('response.json', config)
        .success(function(data, status, headers, config) {
          $scope.progress = data;
          if (data.status == 'OK') {
            $scope.name = null;
            $scope.email = null;
            $scope.subjectList = null;
            $scope.url = null;
            $scope.comments = null;
            $scope.messages = 'Your form has been sent!';
            $scope.submitted = false;
          } else {
            $scope.messages = 'Oops, we received your request, but there was an error.';
            $log.error(data);
          }
        })
        .error(function(data, status, headers, config) {
          $scope.progress = data;
          $scope.messages = 'There was a network error. Try again later.';
          $log.error(data);
        });
    }
  });
