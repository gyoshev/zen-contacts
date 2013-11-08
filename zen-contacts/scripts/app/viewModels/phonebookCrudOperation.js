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
            // simulator gets no data
            options.success([]);
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
