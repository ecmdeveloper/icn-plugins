define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",	
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/layout/ContentPane",
        "dojo/text!./templates/SecurityInfoWidget.html",
        ],

        function(declare, lang, array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, template) {

	return declare("developerPluginDojo.SecurityInfoWidget", [_WidgetBase,
	                                                          _TemplatedMixin,
	                                                          _WidgetsInTemplateMixin], {
		templateString: template,
		widgetsInTemplate: true,

		postCreate: function() {
			this.inherited(arguments);
		},

		initialize : function(item) {
			this.level.innerHTML = item.level;
			this.accessType.innerHTML = this.toTitleCase(item.accessType);
			this.granteeName.innerHTML = item.name;
			this.granteeType.innerHTML = this.toTitleCase(item.granteeType);;
			this.accessRights.innerHTML = "";
			
			item.accessRights.forEach( lang.hitch(this,function(accessRight) {
				this.accessRights.innerHTML +=  (accessRight.value? "&#9635;" : "&#9744;") + " " + accessRight.name + "<br>";
			}));
		},
		
		toTitleCase: function(str) {
			 return str.replace(/\w\S*/g, function(txt) {
				 return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			 });
		}
	});
});

