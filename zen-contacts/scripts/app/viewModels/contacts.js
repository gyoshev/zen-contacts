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
                         { DisplayName: "John Doe", CreatedAt: new Date(), ModifiedAt: new Date(), ContactId: 1, NickName: "johnd", PhoneNumbers: [ "+359 888 123456" ], Organizations: [ "Telerik" ], Name: "John Doe" }
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
        mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
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
    var saveContact = function(contact) {
        // TODO: Add validation
        contactsModel.remoteContacts.add(contact);
        // update the contacts with the new collection
        contactsModel.remoteContacts.sync();
    };
    return {
        contacts: contactsModel.contacts,
        activitySelected: contactSelected,
        saveContact: saveContact,
        logout: logout
    };
}());

app.viewModels.contacts = contactsViewModel;