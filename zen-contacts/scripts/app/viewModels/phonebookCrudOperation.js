var phonebook = {};

phonebook.CRUD = {
    read: function(options) {
        // check if the device uuid is the same as the simulator's
        // if so - use mock data
        if (navigator.contacts && navigator.contacts.find && device.uuid != 'e0908060g38bde8e6740011221af335301010333') {
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
        }
        else {
            // mock data for simulator
            options.success([
                { DisplayName: "Ferris Hamilton", PhoneNumbers: ["(05718) 7340682"], Organizations: [ "Netus Et Malesuada Limited" ] },
                { DisplayName: "Nyssa Padilla", PhoneNumbers: ["(05873) 5541218"], Organizations: [ "Eros Non Foundation" ] },
                { DisplayName: "Keaton Rogers", PhoneNumbers: ["(039) 94582937"], Organizations: [ "Arcu Eu LLC" ] },
                { DisplayName: "Hilary Fulton", PhoneNumbers: ["(039147) 186161"], Organizations: [ "Aliquet Foundation" ] },
                { DisplayName: "Lyle Bullock", PhoneNumbers: ["(038943) 047972"], Organizations: [ "Nulla Aliquet Proin Limited" ] },
                { DisplayName: "Prescott Norris", PhoneNumbers: ["(074) 16872420"], Organizations: [ "Dictum Institute" ] },
                { DisplayName: "Keefe Monroe", PhoneNumbers: ["(035919) 691892"], Organizations: [ "Eu Accumsan Sed Institute" ] },
                { DisplayName: "Francesca Odom", PhoneNumbers: ["(033037) 772308"], Organizations: [ "Vel Vulputate Associates" ] },
                { DisplayName: "Raya Lee", PhoneNumbers: ["(0174) 32845613"], Organizations: [ "Mollis Integer Tincidunt PC" ] },
                { DisplayName: "Merritt Joyce", PhoneNumbers: ["(039960) 069465"], Organizations: [ "Facilisis Magna LLP" ] },
                { DisplayName: "Candice Marsh", PhoneNumbers: ["(006) 88780519"], Organizations: [ "Malesuada Inc." ] },
                { DisplayName: "Lois Pierce", PhoneNumbers: ["(09262) 3726396"], Organizations: [ "Etiam Ligula PC" ] },
                { DisplayName: "Florence Stephens", PhoneNumbers: ["(034858) 065644"], Organizations: [ "Eros Nec PC" ] },
                { DisplayName: "Hannah Nash", PhoneNumbers: ["(0966) 87062978"], Organizations: [ "Cras Inc." ] },
                { DisplayName: "Britanni Blankenship", PhoneNumbers: ["(031597) 653901"], Organizations: [ "Nonummy Ac Feugiat LLC" ] }
            ]);
        }
    },
    create: function(options) {
        var createdContact = navigator.contacts.create(options.data.models);
        
        createdContact.save();
        
        options.success(createdContact);
    },
    update: function(options) {
        var models = options.data.models;
        
        for (var i in models) {
            var model = models[i];
            
            var itemForUpdate = phonebook.findContactsById(model.Id);
            itemForUpdate = model;
            
            itemForUpdate.save();
        }
        
        options.success(models);
    },
    destroy: function(options) {
        var models = options.data.models;
        
        for (var i in models) {
            var model = models[i];
            
            var itemForUpdate = phonebook.findContactsById(model.Id);
            
            itemForUpdate.remove(function(error) {
                options.error(error);
            });
        }
        
        options.success(models);
    }
};

phonebook.findContactsById = function (id) {
    var cfOptions = new ContactFindOptions();
    cfOptions.filter = id;
    cfOptions.multiple = false;
                    
    navigator.contacts.find(["Id"], function onSuccess(contact) {
        return contact;
    }, function onError(contactError) {
        alert('Error fetching contacts');
    }, cfOptions);
}