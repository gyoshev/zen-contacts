
var applicationSettings = {
    emptyGuid: '00000000-0000-0000-0000-000000000000',
    apiKey: '2Mlqvek2P0CHdsEE',
    scheme: 'http'
};

// initialize Everlive SDK
var el = new Everlive({
    apiKey: applicationSettings.apiKey,
    scheme: applicationSettings.scheme
});

var facebook = new IdentityProvider({
    name: "Facebook",
    loginMethodName: "loginWithFacebook",
    endpoint: "https://www.facebook.com/dialog/oauth",
    response_type:"token",
    client_id: "622842524411586",
    redirect_uri:"https://www.facebook.com/connect/login_success.html",
    access_type:"online",
    scope:"email",
    display: "touch"
});

var AppHelper = {
    resolveProfilePictureUrl: function (id) {
        if (id && id !== applicationSettings.emptyGuid) {
            return el.Files.getDownloadUrl(id);
        }
        else {
            return 'styles/images/avatar.png';
        }
    },
    resolvePictureUrl: function (id) {
        if (id && id !== applicationSettings.emptyGuid) {
            return el.Files.getDownloadUrl(id);
        }
        else {
            return '';
        }
    },
    formatDate: function (dateString) {
        var date = new Date(dateString);
        var year = date.getFullYear().toString();
        var month = date.getMonth().toString();
        var day = date.getDate().toString();
        return day + '.' + month + '.' + year;
    },
    logout: function () {
        return el.Users.logout();
    }
};

var mobileApp = new kendo.mobile.Application(document.body, { transition: 'slide', statusBarStyle: "black", layout: 'mobile-tabstrip', skin: 'flat' });

var usersModel = (function () {
    var currentUser = kendo.observable({ data: null });
    var usersData;
    var loadUsers = function () {
        return el.Users.currentUser()
        .then(function (data) {
            var currentUserData = data.result;
            currentUserData.PictureUrl = AppHelper.resolveProfilePictureUrl(currentUserData.Picture);
            currentUser.set('data', currentUserData);
            return el.Users.get();
        })
        .then(function (data) {
            usersData = new kendo.data.ObservableArray(data.result);
        })
        .then(null,
              function (err) {
                  showError(err.message);
              }
        );
    };
    return {
        load: loadUsers,
        users: function () {
            return usersData;
        },
        currentUser: currentUser
    };
}());

// login view model
var loginViewModel = (function () {
    var login = function () {
        var username = $('#loginUsername').val();
        var password = $('#loginPassword').val();

        el.Users.login(username, password)
        .then(function () {
            return usersModel.load();
        })
        .then(function () {
            mobileApp.navigate('views/contactsView.html');
        })
        .then(null,
              function (err) {
                  showError(err.message);
              }
        );
    };
    var loginWithFacebook = function() {
        mobileApp.showLoading();
        facebook.getAccessToken(function(token) {
            el.Users.loginWithFacebook(token)
            .then(function () {
                return usersModel.load();
            })
            .then(function () {
                mobileApp.hideLoading();
                mobileApp.navigate('views/contactsView.html');
            })
            .then(null, function (err) {
                mobileApp.hideLoading();
                if (err.code = 214) {
                    showError("The specified identity provider is not enabled in the backend portal.");
                }
                else {
                    showError(err.message);
                }
            });
        })
    } 
    return {
        login: login,
        loginWithFacebook: loginWithFacebook
    };
}());

app.viewModels.login = loginViewModel;

// signup view model
var singupViewModel = (function () {
    var dataSource;
    var signup = function () {
        dataSource.Gender = parseInt(dataSource.Gender);
        var birthDate = new Date(dataSource.BirthDate);
        if (birthDate.toJSON() === null)
            birthDate = new Date();
        dataSource.BirthDate = birthDate;
        Everlive.$.Users.register(
            dataSource.Username,
            dataSource.Password,
            dataSource)
        .then(function () {
            showAlert("Registration successful");
            mobileApp.navigate('#welcome');
        },
              function (err) {
                  showError(err.message);
              }
        );
    };
    var show = function () {
        dataSource = kendo.observable({
            Username: '',
            Password: '',
            DisplayName: '',
            Email: '',
            Gender: '1',
            About: '',
            Friends: [],
            BirthDate: new Date()
        });
        kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
    };
    return {
        show: show,
        signup: signup
    };
}());

app.viewModels.signup = singupViewModel;