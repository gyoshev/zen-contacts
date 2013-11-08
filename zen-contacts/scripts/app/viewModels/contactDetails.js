(function() {
    var contactDetailsViewModel = (function(){   
        
        var show = function(e) {
            var contactUid = e.view.params.uid;
            var contact = contactsModel.contacts.getByUid(contactUid);
            kendo.bind(e.view.element, contact, kendo.mobile.ui);
        }
        
        var saveContact = function(contact) {
            // TODO: Add validation
            contactsModel.remoteContacts.add(contact);
            // update the contacts with the new collection
            contactsModel.remoteContacts.sync();
        };
        
        return {
            show: show,
            save: saveContact
        }
    }());
    
    app.viewModels.contactDetails = contactDetailsViewModel;
})();