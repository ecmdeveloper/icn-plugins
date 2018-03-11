define([
		"dojo/_base/declare",
		"dojo/_base/lang",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dijit/form/Textarea",
		"ecm/widget/admin/PluginConfigurationPane",
		"dojo/text!./templates/ConfigurationPane.html",
		 "./cm/lib/codemirror", 
		 "./cm/mode/css/css",
		 "./cm/addon/display/autorefresh"
	],
	function(declare, lang, _TemplatedMixin, _WidgetsInTemplateMixin, Textarea, PluginConfigurationPane, template, CodeMirror, css, autoRefresh) {

		return declare("csstweaker.ConfigurationPane", [ PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: template,
		widgetsInTemplate: true,
	
		postCreate: function() {
			this.editor = CodeMirror.fromTextArea(this.cssEditor, {
				value: "/* Insert CSS code here */",
				mode: "css",
				autoRefresh: true
			});
		},
		
		load: function(callback) {
			
			if (this.configurationString) {
				this.editor.setValue(this.configurationString);
			}
			
			this.editor.on("change", lang.hitch(this, this.onTextChange ) );
			
			if ( callback) {
				callback();
			}
		},
		
		onTextChange: function() {
			this.configurationString = this.editor.getValue();
			this.onSaveNeeded(true);
		},
		
		validate: function() {
			return true;
		}
	});
});
