var contactsModel = (function () {
    var contactModel = {
        id: 'contactId',
        fields: {
            displayName: {
                field: 'displayName',
                defaultValue: ''
            },
            CreatedBy: {
                field: 'CreatedBy',
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
            contactId: {
                fields: 'contactId',
                defaultValue: ''
            },
            nickName: {
                field: 'nickName',
                defaultValue: ''
            },
            phoneNumbers: {
                field: 'phoneNumbers',
                defaultValue: []
            },
            organizations: {
                field: 'organizations',
                defaultValue: []
            },
            name: {
                field: 'name',
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
    var elContactsDataSource = new kendo.data.DataSource({
        type: 'everlive',
        schema: {
            model: contactModel
        },
        transport: {
            // required by Everlive
            typeName: 'Contact'
        }
    });
    
    // Datasource that syncs with phone
    var contactsDataSource = new kendo.data.DataSource({
        transport: {
            read: phonebook.CRUD.read
             // TODO: implement create / update / delete operations for this datasource
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
        sort: { field: 'displayName', dir: 'asc' },
        filter: [{ field: 'displayName', operator: 'neq', value: '' }]
    });
    
    return {
        contacts: contactsDataSource,
        serverContacts: elContactsDataSource
    };
}());

// contacts view model
var contactsViewModel = (function () {
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
    
    var phoneContacts = contactsModel.contacts;
    
    var sync = function() {
        var serverContacts = contactsModel.serverContacts;
        
        // TODO: show "sync in progress" message during the fetch
        serverContacts.fetch(function() {
            var serverData = this.data();
            var phoneData = phoneContacts.data();
            
            if (!serverData.length) {
                // server records are empty
                this.data(phoneData.toJSON());
                this.sync();
            } else if (!phoneData.length) {
                // server has contacts, but phone contacts are empty
                phoneContacts.data(serverData.toJSON());
                phoneContacts.sync();
            } else {
                // both server and phone have entries, proceed to merge
                alert("on phone: " + phoneData.length + "; on server: " + serverData.length);
                
                // TODO: implement merge
            }
        });
    };
    
    var contactSelected = function (e) {
        mobileApp.navigate('views/contactDetailsView.html?uid=' + e.data.uid);
    };
    
    // cleans all contacts from the phone datasource
    var purge = function() {
        phoneContacts.data([]);
        phoneContacts.sync();
    };
    
    return {
        contacts: phoneContacts,
        contactSelected: contactSelected,
        sync: sync,
        purge: purge,
        logout: logout
    };
}());

app.viewModels.contacts = contactsViewModel;
