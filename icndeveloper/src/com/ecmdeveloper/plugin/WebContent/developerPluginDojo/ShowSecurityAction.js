define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "ecm/model/Action",
    "ecm/model/Request",
    "ecm/widget/dialog/BaseDialog",
    "developerPluginDojo/ShowSecurityDialog"
],
    function (declare, lang, Action, Request, BaseDialog, ShowSecurityDialog) {
        return declare("developerPluginDojo.ShowSecurityAction", [Action], {

            isEnabled: function () {
                return true;
            },

            isVisible: function (repository, items, repositoryTypes, teamspace) {
                this._selectedItems = items;
                return true;
            },

            performAction: function(repository, itemList, callback, teamspace, resultSet, parameterMap) {
            	
            	var onOk = function() {
            		alert("OK!");
            	};
            	
                var d = new ShowSecurityDialog({onApply: onOk, targetItem: itemList[0], parentResultSet: resultSet});
                d.show();

            }
        });
    }
);