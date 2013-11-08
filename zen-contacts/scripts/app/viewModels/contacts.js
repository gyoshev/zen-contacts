var contactsModel = (function () {
    var contactModel = {
        id: 'Id',
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
            read: phonebook.CRUD.read,
            update: phonebook.CRUD.update,
            create: phonebook.CRUD.create,
            destroy: phonebook.CRUD.destroy
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
    
    var contactSelected = function (e) {
        mobileApp.navigate('views/contactDetailsView.html?uid=' + e.data.uid);
    };
    
    // cleans all contacts from the phone datasource
    var purge = function() {
        phoneContacts.data([]);
        phoneContacts.sync();
    };
    
    var populate = function() {
        phoneContacts.data([
            { displayName: "Ferris Hamilton", phoneNumbers: ["(05718) 7340682"], organizations: [ "Netus Et Malesuada Limited" ] },
            { displayName: "Nyssa Padilla", phoneNumbers: ["(05873) 5541218"], organizations: [ "Eros Non Foundation" ] },
            { displayName: "Keaton Rogers", phoneNumbers: ["(039) 94582937"], organizations: [ "Arcu Eu LLC" ] },
            { displayName: "Hilary Fulton", phoneNumbers: ["(039147) 186161"], organizations: [ "Aliquet Foundation" ] },
            { displayName: "Lyle Bullock", phoneNumbers: ["(038943) 047972"], organizations: [ "Nulla Aliquet Proin Limited" ] },
            { displayName: "Prescott Norris", phoneNumbers: ["(074) 16872420"], organizations: [ "Dictum Institute" ] },
            { displayName: "Keefe Monroe", phoneNumbers: ["(035919) 691892"], organizations: [ "Eu Accumsan Sed Institute" ] },
            { displayName: "Francesca Odom", phoneNumbers: ["(033037) 772308"], organizations: [ "Vel Vulputate Associates" ] },
            { displayName: "Raya Lee", phoneNumbers: ["(0174) 32845613"], organizations: [ "Mollis Integer Tincidunt PC" ] },
            { displayName: "Merritt Joyce", phoneNumbers: ["(039960) 069465"], organizations: [ "Facilisis Magna LLP" ] },
            { displayName: "Candice Marsh", phoneNumbers: ["(006) 88780519"], organizations: [ "Malesuada Inc." ] },
            { displayName: "Lois Pierce", phoneNumbers: ["(09262) 3726396"], organizations: [ "Etiam Ligula PC" ] },
            { displayName: "Florence Stephens", phoneNumbers: ["(034858) 065644"], organizations: [ "Eros Nec PC" ] },
            { displayName: "Hannah Nash", phoneNumbers: ["(0966) 87062978"], organizations: [ "Cras Inc." ] },
            { displayName: "Britanni Blankenship", phoneNumbers: ["(031597) 653901"], organizations: [ "Nonummy Ac Feugiat LLC" ] }
        ]);
        
        phoneContacts.sync();
    };
    
    // forces all records from source to go to destination
    var force = function(source, destination, callback) {
        destination.fetch(function() {
            while (this.data().length) {
                this.remove(this.at(0));
            }
            
            this.data(source.data().toJSON());
            
            this.sync();

            callback();
        });
    };
    
    var forceUpload = function() {
        var button = this;
        
        force(phoneContacts, contactsModel.serverContacts, function() {
            closeModal.call(button);
        });
    };
    
    var forceDownload = function() {
        var button = this;
        
        force(contactsModel.serverContacts, phoneContacts, function() {
            closeModal.call(button);
        });
    };
    
    var closeModal = function() {
        $(this.element).closest("[data-role='modalview']").kendoMobileModalView("close");
    };
    
    return {
        contacts: phoneContacts,
        contactSelected: contactSelected,
        forceDownload: forceDownload,
        forceUpload: forceUpload,
        closeModal: closeModal,
        purge: purge,
        populate: populate,
        logout: logout
    };
}());

app.viewModels.contacts = contactsViewModel;
