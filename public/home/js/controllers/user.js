/**
 * post controller
 * @param {type} param1
 * @param {type} param2
 */
app.controller('UserCtrl', function($scope, Users) {


    $scope.registerUser = function() {
        $scope.user = {};
        $scope.user.name = this.user.name;
        $scope.user.email = this.user.email;
        $scope.user.password = this.user.password;
        $scope.user.phone = this.user.phone;
        $scope.user.role = 'user';
        //console.log($scope.user);
        Users.add($scope.user).then(function(res) {
            if (res) {
                console.log(res);
                $scope.message=res.message;
//                window.location = '/login';
            }else{
                $scope.message=res.message;
            }

        });
    };
    $scope.loginUser = function() {
        $scope.userlogin = {};
        $scope.userlogin.email = this.user.email;
        $scope.userlogin.password = this.user.password;
        console.log($scope.userlogin);
        Users.login($scope.userlogin).then(function(res) {
            if (res.user != "Unauthorized") {
                console.log(res);
            } else {
                //window.location = '/login';
                $scope.errormsg = 'Invalid crediential';
            }

        });
    };

});
      
    