define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/store/Memory",
    "dijit/tree/ObjectStoreModel", 
    "dijit/Tree",	
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",	
	"ecm/widget/dialog/BaseDialog",
	"ecm/LoggerMixin",
	"ecm/Messages",
	"ecm/model/Desktop",
    "ecm/model/Request",
    "developerPluginDojo/SecurityInfoWidget",
	"dojo/text!./templates/ShowSecurityDialog.html",
    "dojo/on"
], function(declare, lang, connect, array, domConstruct, domClass, Memory, ObjectStoreModel, Tree, ContentPane, BorderContainer, BaseDialog, LoggerMixin, Messages, Desktop, Request, SecurityInfoWidget, template, on) {

	return declare("developerPluginDojo.ShowSecurityDialog", [BaseDialog], {

		contentString: template,
		widgetsInTemplate: true,

		postCreate: function() {
			this.inherited(arguments);
			this.setTitle("Security Information");
			this.setIntroText("You can view the security of this item. Select an access right on the left to see more details.");
			this.setMaximized(true);
			this.setSizeToViewportRatio(false);
			this.setResizable(true);
            this.applyValues();
		},

		/**
		 * Cleans up the widget.
		 */
		destroy: function() {
			this.securityInfo.destroy();
			this.inherited(arguments);
		},
        
		showTree: function(data) {

			var myStore = new dojo.store.Memory({
				data: data,
				getChildren: function(object){
					return this.query({parent: object.id});
				}
			});

			// Create the model
			var myModel = new dijit.tree.ObjectStoreModel({
				store: myStore,
				query: {id: 'world'}
			});

			var contentTree = new dijit.Tree({
				model: myModel,
				showRoot: false,
				autoExpand: false,
				getIconClass: function(/*dojo.store.Item*/ item, /*Boolean*/ opened) {
					if ( item.type === "permission") {
						return "group";
					} else if (item.type === "property") {
						return "tag_blue";
					} else if ( item.type === "customobject") {
						return "package";
					} else if ( item.type === "folder") {
						return "folder";
					} else if ( item.type === "document") {
						return "page_white_text";
					}
					else return "zondag";
				},
				onClick: lang.hitch(this, function(item, node, event){
					if ( item.type === "permission") {
						this.showPermissions(item);
					}
				})
			});          

			contentTree.placeAt(this.treeContainer);
			contentTree.startup();
			
//			var nodes = contentTree.getNodesByItem("world_object_b2867ca0");
//
//			if(!nodes[0].isExpanded){
//				contentTree._expandNode(nodes[0]);
//			}
		},
	
		applyValues: function() {

			var classInfo = this.targetItem.attributes.ClassDescription.split(",");
			var requestParams = {
					classId: classInfo[2],
					repositoryId: Desktop.getDefaultRepository().id,
					objectId: this.targetItem.attributes.Id
			};
			
			Request.invokePluginService("DeveloperPlugin", "ShowSecurityService", {
                requestParams : requestParams,
                requestCompleteCallback : lang.hitch(this, function(response) {
                	console.log(response);
                	this.showTree(response);
                })
            });	
        },
		
		showPermissions: function (item) {
			this.securityInfo.initialize(item);
		}
	});
});
