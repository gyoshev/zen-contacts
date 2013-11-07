var localContacts = {};
var remoteContacts = {};

var conflicts = {};

function pullAllLocalContacts(success){
    var options = new ContactFindOptions();
    options.filter="";
    options.multiple=true;
    var filter = ["displayName"];
    
    // success callback
    function onSuccess(contacts) {
        for(var i = 0; i < contacts.length; i++){
            var key = contacts[i].id.toString();
            // localContactsById[key] = contacts[i];
        }
        localContacts = contacts;
        if(success){
            success();
        }
    };

    // error callback
    function onError(contactError) {
        alert(contactError);
    };
    
    navigator.contacts.find(filter, onSuccess, onError, options);
}

function findContact(contactsList, id){
    for(var i = 0; i < contactsList.length; i++){
        var contact = contactsList[i];
        if(contact.id == id){
            return contact;
        }
    }
    
    return Null;
}

function sync(localContactsList, remoteContactsList){
    var maxList;
    if(localContactsList.length > remoteContactsList.length){
        maxList = localContactsList;
    }
    else{
        maxList = remoteContactsList;
    }
    for(var i = 0; i < localContactsList.length; i++){
        var localContact = localContactsList[i];
        var remoteContact = findContact(remoteContactsList, localContact.id);
        // if(remoteContact
    }
}

