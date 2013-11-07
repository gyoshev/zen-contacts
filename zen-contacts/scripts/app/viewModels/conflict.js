app.viewModels.conflict = (function() {
    var mergeAction = {
        LOCAL: 0,
        SERVER: 1,
        BOTH: 2
    };

    var conflictViewModel = function(local, remote) {
        var that = this,
        remoteContact = remote,
        localContact = local;
    
        that.mergeAction = null,
        that.result = null;
    
        that.setMergeAction = function(e) {
            var data = e.button.data();
            that.mergeAction = data.type;
        
            if (that.mergeAction === mergeAction.LOCAL) {
                that.result = localContact;
            }
            else if (that.mergeAction === mergeAction.LOCAL) {
                that.result = remoteContact;
            }
            else {
                that.result = [localContact, remoteContact];            
            }
        };
    };
        
    return {
        conflict: new conflictViewModel(),
        mergeAction: mergeAction
   };
})();