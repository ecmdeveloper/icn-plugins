define([
		"dojo/_base/declare",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dijit/form/Textarea",
		"ecm/widget/admin/PluginConfigurationPane",
		"dojo/text!./templates/ConfigurationPane.html"
	],
	function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, Textarea, PluginConfigurationPane, template) {

		return declare("csstweaker.ConfigurationPane", [ PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: template,
		widgetsInTemplate: true,
	
		load: function(callback) {
			
			if (this.configurationString) {
				this.cssEditor.set("value", this.configurationString );
			}
			
			if ( callback) {
				callback();
			}
		},
		
		onTextChange: function() {
			this.configurationString = this.cssEditor.get("value");
			this.onSaveNeeded(true);
		},
		
		validate: function() {
			return true;
		}
	});
});
