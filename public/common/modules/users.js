
var usersModule = angular.module('fwrk.users', []);

usersModule.service('Users', function($http) {

    return {
        all: function() {
            console.log("all");
            return $http.get('/api/users').then(function(userList) {
                return userList;
            });
        },
        add: function(newUser) {
            console.log(newUser);
            return $http({
                method: 'post',
                url: '/api/users/register',
                data: newUser
            }).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            });
        },
         login: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/login',
                data: newUser
            }).then(function(res) {
                return res.data;
            }).catch(function(err) {
                
                return err;
            });
        },
        remove: function(usr) {
            console.log(usr);
            return $http({
                method: 'post',
                url: '/api/deleteuser',
                data: usr
            }).then(function(res) {
               
                return res.data;
            }).catch(function(err) {
                
                return err;
            });

        },
        changepass: function(newUser) {
                   
                    console.log(newUser);
                return $http({
                    method: 'post',
                    url: '/api/change_passw',
                    data: newUser
                }).then(function(res) {
                   
                    return res.data;
                }).catch(function(err) {
                    
                    return err;
                });
                },
        update: function(usr) {
            console.log(usr);
            return $http({
                method: 'post',
                url: '/api/editusrID',
                data: usr
            }).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            });

        },
        sigledata: function(id) {
            console.log(id);
            return $http({
                method: 'post',
                url: '/api/adminfetchuserdata',
                data: id
            }).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            });
        },
       
     userForgot: function(forUser) {
                return $http({
                    method: 'post',
                    url: '/api/forgetpass',
                    data: forUser
                }).then(function(res) {
                    return res.data;
                }).catch(function(err) {
                    return err;
                });
                },   
                
     adminForgot: function(forUser) {
                    
                return $http({
                    method: 'post',
                    url: '/api/forgetpass',
                    data: forUser
                }).then(function(res) {
                    return res.data;
                }).catch(function(err) {
                   
                    return err;
                });
                },
                
          uploadimage: function(image) {
            
            var fd = new FormData();
            fd.append("file", image);
            console.log(fd);
            return $http({
                method: 'post',
                url: '/api/uploaduserimage',
                data: fd,
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            });
        }
              
    };
});