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
    
    /*// Datasource that syncs with everlive
    var ELcontactsDataSource = new kendo.data.DataSource({
        type: 'everlive',
        schema: {
            model: contactModel
        },
        transport: {
            // required by Everlive
            typeName: 'Contacts'
        }
    });*/
    
    // Datasource that syncs with phone
    var contactsDataSource = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                if (navigator.contacts.find) {
                    // find all contacts
                    var cfOptions = new ContactFindOptions();
                    cfOptions.filter = "";
                    cfOptions.multiple = true;
                    
                    navigator.contacts.find(["displayName"], function onSuccess(contacts) {
                        // pass contacts from contacts array to options.success (might need cloning beforehand)
                        options.success(contacts);
                    }, function onError(contactError) {
                        alert('Error fetching contacts');
                    }, cfOptions);
                } else {
                    // mock data for simulator
                    options.success([
                        { displayName: "Ferris Hamilton", PhoneNumbers: ["(05718) 7340682"], Organizations: [ "Netus Et Malesuada Limited" ] },
                        { displayName: "Nyssa Padilla", PhoneNumbers: ["(05873) 5541218"], Organizations: [ "Eros Non Foundation" ] },
                        { displayName: "Keaton Rogers", PhoneNumbers: ["(039) 94582937"], Organizations: [ "Arcu Eu LLC" ] },
                        { displayName: "Hilary Fulton", PhoneNumbers: ["(039147) 186161"], Organizations: [ "Aliquet Foundation" ] },
                        { displayName: "Lyle Bullock", PhoneNumbers: ["(038943) 047972"], Organizations: [ "Nulla Aliquet Proin Limited" ] },
                        { displayName: "Prescott Norris", PhoneNumbers: ["(074) 16872420"], Organizations: [ "Dictum Institute" ] },
                        { displayName: "Keefe Monroe", PhoneNumbers: ["(035919) 691892"], Organizations: [ "Eu Accumsan Sed Institute" ] },
                        { displayName: "Francesca Odom", PhoneNumbers: ["(033037) 772308"], Organizations: [ "Vel Vulputate Associates" ] },
                        { displayName: "Raya Lee", PhoneNumbers: ["(0174) 32845613"], Organizations: [ "Mollis Integer Tincidunt PC" ] },
                        { displayName: "Merritt Joyce", PhoneNumbers: ["(039960) 069465"], Organizations: [ "Facilisis Magna LLP" ] },
                        { displayName: "Candice Marsh", PhoneNumbers: ["(006) 88780519"], Organizations: [ "Malesuada Inc." ] },
                        { displayName: "Lois Pierce", PhoneNumbers: ["(09262) 3726396"], Organizations: [ "Etiam Ligula PC" ] },
                        { displayName: "Florence Stephens", PhoneNumbers: ["(034858) 065644"], Organizations: [ "Eros Nec PC" ] },
                        { displayName: "Hannah Nash", PhoneNumbers: ["(0966) 87062978"], Organizations: [ "Cras Inc." ] },
                        { displayName: "Britanni Blankenship", PhoneNumbers: ["(031597) 653901"], Organizations: [ "Nonummy Ac Feugiat LLC" ] }
                    ]);
                }
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
        sort: { field: 'displayName', dir: 'asc' },
        filter: { field: 'displayName', operator: 'neq', value: '' }
    });
    
    return {
        contacts: contactsDataSource
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
    return {
        contacts: contactsModel.contacts,
        logout: logout
    };
}());

app.viewModels.contacts = contactsViewModel;