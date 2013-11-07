var contactsModel = (function () {
    var contactModel = {
        id: 'Id',
        fields: {
            DisplayName: {
                field: 'DisplayName',
                defaultValue: ''
            },
            CreatedAt: {
                field: 'CreatedAt',
                defaultValue: new Date()
            },
            ModifiedAt: {
                field: 'ModifiedAt',
                defaultValue: new Date()
            },
            ContactId: {
                fields: 'ContactId',
                defaultValue: ''
            },
            NickName: {
                field: 'NickName',
                defaultValue: ''
            },
            PhoneNumbers: {
                field: 'PhoneNumbers',
                defaultValue: []
            },
            Organizations: {
                field: 'Organizations',
                defaultValue: []
            },
            Name: {
                field: 'Name',
                defaultValue: ''
            }
        },
        CreatedAtFormatted: function () {
            return AppHelper.formatDate(this.get('CreatedAt'));
        },
        PictureUrl: function () {
            return AppHelper.resolvePictureUrl(this.get('Picture'));
        },
        User: function () {
            var userId = this.get('UserId');
            var user = $.grep(usersModel.users(), function (e) {
                return e.Id === userId;
            })[0];
            return user ? {
                DisplayName: user.DisplayName,
                PictureUrl: AppHelper.resolveProfilePictureUrl(user.Picture)
            } : {
                DisplayName: 'Anonymous',
                PictureUrl: AppHelper.resolveProfilePictureUrl()
            };
        }
    };
    
    // Datasource that syncs with everlive
    var ELcontactsDataSource = new kendo.data.DataSource({
        type: 'everlive',
        schema: {
            model: contactModel
        },
        transport: {
            // required by Everlive
            typeName: 'Contact'
        },
        sort: { field: 'DisplayName', dir: 'desc' }
    });
    
    // Datasource that syncs with phone
    var contactsDataSource = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                /*// find all contacts
                var options = new ContactFindOptions();
                options.filter = "";
                options.multiple = true;
                
                navigator.contacts.find(["displayName"], function onSuccess(contacts) {
                    // pass contacts from contacts array to options.success (might need cloning beforehand)*/
                    options.success([
                         { DisplayName: "John Doe", CreatedAt: new Date(), ModifiedAt: new Date(), ContactId: 1, NickName: "johnd", PhoneNumbers: [ "+359 888 123456" ], Organizations: [ "Telerik" ], Name: "John Doe" },
                         { DisplayName: "Jane Doe", CreatedAt: new Date(), ModifiedAt: new Date(), ContactId: 2, NickName: "janed", PhoneNumbers: [ "+359 888 123456" ], Organizations: [ "Telerik" ], Name: "Jane Doe" },
                         { DisplayName: "Ivan Ivanov", CreatedAt: new Date(), ModifiedAt: new Date(), ContactId: 3, NickName: "iviv", PhoneNumbers: [ "+359 888 123456" ], Organizations: [ "Iv Inc" ], Name: "Ivan Ivanov" },
                         { DisplayName: "Sting", CreatedAt: new Date(), ModifiedAt: new Date(), ContactId: 4, NickName: "sti", PhoneNumbers: [ "+359 888 123456" ], Organizations: [ "Pop star inc" ], Name: "Stingy" },
                         { DisplayName: "Madonna", CreatedAt: new Date(), ModifiedAt: new Date(), ContactId: 5, NickName: "mad", PhoneNumbers: [ "+359 888 123456" ], Organizations: [ "Queen of pop inc" ], Name: "Madonja" },
                
                    ]);
                /*}, function onError(contactError) {
                    alert('onError!');
                }, options);*/
            }
        },
        schema: {
            model: contactModel
        },
        change: function (e) {
            if (e.items && e.items.length > 0) {
                $('#no-contacts-span').hide();
            } else {
                $('#no-contacts-span').show();
            }
        },
        sort: { field: 'DisplayName', dir: 'desc' }
    });
    
    return {
        contacts: contactsDataSource,
        remoteContacts: ELcontactsDataSource
    };
}());

// contacts view model
var contactsViewModel = (function () {
    var contactSelected = function (e) {
        // TODO: use this when we allow contact editing on the phone
        mobileApp.navigate('views/contactDetailsView.html?uid=' + e.data.uid);
    };
    var navigateHome = function () {
        mobileApp.navigate('#welcome');
    };
    var logout = function () {
        AppHelper.logout()
        .then(navigateHome, function (err) {
            showError(err.message);
            navigateHome();
        });
    };
    return {
        contacts: contactsModel.contacts,
        contactSelected: contactSelected,
        logout: logout
    };
}());

app.viewModels.contacts = contactsViewModel;