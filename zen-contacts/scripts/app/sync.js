var localContacts = new Array();
var remoteContacts = new Array();

var conflicts = {};

function pullAllLocalContacts(success){
    var options = new ContactFindOptions();
    options.filter="";
    options.multiple=true;
    var filter = ["displayName"];
    
    // success callback
    function onSuccess(contacts) {
        localContacts = contacts;
        var myContact = navigator.contacts.create({"displayName": "Conflict"});
        myContact.id = contacts[0].id;
        remoteContacts.push(myContact);
        
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
    for(var i = 0; i < localContactsList.length; i++){
        var localContact = localContactsList[i];
        var remoteContact = findContact(remoteContactsList, localContact.id);
        if(remoteContact){
            if(hasConflict(localContact, remoteContact)){
                alert("Check for conflict " + localContact.displayName + " and " + remoteContact.displayName);
                alert("hasConflict");
                conflicts.push({
                    localContact: localContact,
                    remoteContact: remoteContact                   
                });
            }
        }
        else{
            alert(remoteContacts[0].id);
        }
    }
}

function hasConflict(contact1, contact2){
    for(var propName in contact1){
        if(contact1.hasOwnProperty(propName)){
            var value1 = contact1[propName];
            var value2 = contact2[propName];
            
            if(value1 != value2){
                return true;
            }
        }
    }
    
    return false;
}

