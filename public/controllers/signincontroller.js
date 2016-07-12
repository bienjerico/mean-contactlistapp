signinapp.controller('SignInCtrl',function($scope,$http){

console.log("testing signinapp");


  $scope.clicksignin = function(){
    console.log($scope.signin);
    $http.post('/signin',$scope.signin).success(function(response){
        console.log("success");
        console.log(response);
        $scope.signin = "";
        $scope.errors = "";
        $scope.success = "Successful";

    }).error(function(response){
        // console.log("error");
        console.log(response);
        console.log(response.length);
        // $scope.errors = response;
        // Convert server side errors to AngularJS errors.
            var errors = {};
            for(var i = 0; i < response.length; i++) {
                var err = response[i];

                var param, msg;
                for(var key in err) {
                    if(key == 'param') param = err[key];
                    if(key == 'msg') msg = err[key];
                }
                errors[param] = msg;
            }
            console.log(errors);
            $scope.errors = errors;
    });
  }




});
