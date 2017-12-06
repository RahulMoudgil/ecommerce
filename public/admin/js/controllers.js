/**
 * NavCtrl
 * @param {type} param1
 * @param {type} param2
 */
adminApp.controller('NavCtrl', function($scope, $state) {
    $scope.active = $state;
    $scope.isActive = function(viewLocation) {
        var active = (viewLocation === $state.current.name);
        return active;
    };
})
/*
* Dashboard controller
*/
adminApp.controller('dashboardCtrl', function($scope,Users,$stateParams) { console.log("here");
    //$scope.profileUser = function() {
        console.log("here");
        $scope.params = {};
        $scope.params.path = $stateParams.paraml;
        console.log($scope.params);
        //return false;
        Users.adminsigledata($scope.params).then(function(res) {
            if (res == null) {
                window.location.href = '/404';
            } else {
                console.log(res);
               //return false;
               $scope.user = res;
//                $scope.user.full_name = res.full_name;
//                $scope.user.email = res.email;
//                $scope.user.username = res.username;
//                $scope.user.gender = res.gender;
//                $scope.user.location = res.location;
               
            }
            console.log($scope.user);
        });
    //}
});

/**
 * AllUsersCtrl
 */
adminApp.controller('AllUsersCtrl', function($scope, userList,Users,$location) {
    console.log("userlist");
    console.log(userList);
    $scope.users = userList.data;
    $scope.activePost = false;
    $scope.setActive = function(user) {
        
        $scope.activeUser = user;        
    }
    
    $scope.deleteUser = function(id) {
        console.log("here i am");
//        $scope.data={};
//         $scope.data.id=id;
//        Users.remove($scope.data).then(function(res) {
//            if (res) {
//                $scope.del=res.message
//              
//                window.location.reload();
//            } else {
//                $scope.update = "error";
//            }
//        });
    }
});

/*
* Add user
*/
adminApp.controller('addUserCtrl',function($scope,Users){
    
     google.maps.event.addDomListener(window, 'load', init());
    function init() {
        var input = document.getElementById('locationTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            fillInAddress(autocomplete);
        });

    }

    function fillInAddress(autocomplete) {

        var place = autocomplete.getPlace();
        $rootScope.selected = place.formatted_address;

    }
    $scope.fileNameChanged = function(input) {
          $scope.loading = true;
      console.log(input.files[0]);
        Users.uploadimage(input.files[0]).then(function(res) {
//            console.log(res[0].location);
            $scope.loading = false;
            if(res){  
                //console.log(res);
             $scope.user.image = res[0].location;
             
            }
          
        });
    }
    $scope.user = {};

    $scope.addUser = function(){
        $scope.newUser = {};
        $scope.newUser.email = this.user.email;
        $scope.newUser.password = this.user.password;
        $scope.newUser.confirm_password = this.user.confirm_password;
        $scope.newUser.full_name = this.user.full_name;
        $scope.newUser.username = this.user.username;
       $scope.newUser.gender = this.user.gender;
        console.log($scope.newUser);
        Users.add($scope.newUser).then(function(res) {
            console.log(res);
            $scope.message=res.message;
//            window.location.href="/admin/dashboard#/userList"
        });
        this.user = {};
        
    };
});
/**
 * EditUsersCtrl
 */
adminApp.controller('editUserCtrl', function($scope, Users, $stateParams,$rootScope ) {
      google.maps.event.addDomListener(window, 'load', init());
    function init() {
        var input = document.getElementById('locationTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            fillInAddress(autocomplete);
        });

    }

    function fillInAddress(autocomplete) {

        var place = autocomplete.getPlace();
        $rootScope.selected = place.formatted_address;

    }
    $scope.user = {};
    $scope.params = {};
    $scope.params.path = $stateParams.paraml;
    Users.sigledata($scope.params).then(function(res) {
        if (res == null) {
            window.location.href = '/404';
        } else {
            //console.log(res);
            //return false;
            $scope.user.full_name = res.data.full_name;
            $scope.user.email = res.data.email;
            $scope.user.username = res.data.username;
             $scope.user.gender = res.data.gender;
 
              $scope.user.location =  res.data.location;   
  
             if(res.data.image){
              $scope.user.image = res.data.image;   
             }
            $scope.user.id = res.data._id;
        }
        console.log($scope.user);
    });
    
    $scope.fileNameChanged = function(input) {
          $scope.loading = true;
      console.log(input.files[0]);
        Users.uploadimage(input.files[0]).then(function(res) {
//            console.log(res[0].location);
            $scope.loading = false;
            if(res){  
                //console.log(res);
             $scope.user.image = res[0].location;
             
            }
          
        });
    }
    
    $scope.editUser = function() {

        $scope.newPost = {};
        $scope.newPost.full_name = this.user.full_name;
        $scope.newPost.email = this.user.email;
        $scope.newPost.username = this.user.username;
        $scope.newPost.id = this.user.id ;
        $scope.newPost.gender = this.user.gender;
        $scope.newPost.location = $rootScope.selected;
        $scope.newPost.image = this.user.image;
        console.log($scope.newPost)
        Users.update($scope.newPost).then(function(res) {
            if (res) {
                $scope.update = res.message;
            } else {
                $scope.update = "error";
            }
        });
    };
});

adminApp.controller('forgotpasswordCtrl', function($scope,Users,$location,$rootScope) {
     $scope.forgotpass = function() {
        if (Object.keys(this.user).length == 0) {
            $scope.message = "Please enter your email!";
            return false;
        }
        Users.adminForgot(this.user).then(function(res) {
            if (res) {
                $scope.message = res.message;
                 console.log(res);
            } else {
                $scope.message = res.message;
                console.log(res);
            }
        });
    }
    
    $scope.resetpass = function(user) {
        if (!user) {
            $scope.message = "Please enter password && confirm password";
            return false;
        }else if(!user.password){
             $scope.message = "Please enter password!";
            return false;
        }else if(!user.confirmpassword){
             $scope.message = "Please enter confirm password!";
            return false;
        }
        else if(user.password!=user.confirmpassword) {
            $scope.message = "The password and confirm password are not same";
             return false;
        }
        user.salt=$rootScope.salt;
        console.log("harman");
        console.log(user);
        
        Users.changepass(user).then(function(res) {
            
            if (res) {
                $rootScope.message = res.message;
            } else {
                $rootScope.errormsg = res.message;
            }
        });
    };
});