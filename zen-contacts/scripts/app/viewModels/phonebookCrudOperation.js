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
            navigator.contacts.find(["displayName", "id", "addresses", "birthday", "phoneNumbers", "organizations"], function onSuccess(contacts) {
                // pass contacts from contacts array to options.success (might need cloning beforehand)
                options.success(contacts);
            }, function onError(contactError) {
                alert('Error fetching contacts');
            }, cfOptions);
        } else {
            // mock data for simulator
            options.success([
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
        }
    },
    create: function(options) {
        var contacts = navigator.contacts;
        
        if (contacts && contacts.create) {
            var createdContact = contacts.create(options.data.models);
            
            createdContact.save();
            
            options.success(createdContact);
        } else {
            options.success(options.data.models);
        }
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
