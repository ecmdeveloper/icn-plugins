require(["dojo/_base/declare",
 		 "dojo/_base/json",
         "dojo/_base/lang",
         "dojo/aspect",
         "ecm/model/Desktop",
         "ecm/model/admin/PluginConfig",
         "ecm/Messages"], 
function(declare, json, lang, aspect, Desktop, PluginConfig, Message) {
	
//	Message.add_document_entry_template_label = "Hallo, Plugin:";
	
	aspect.after(Desktop, "onLogin", lang.hitch(this, function(response){
		var pluginConfig = PluginConfig.createPluginConfig("LabelManager");
		pluginConfig.getPluginConfig( function() {
			var c = pluginConfig.getConfiguration();
			var config = c && json.fromJson(c) || [];
			
			config.forEach( function(item) {
				Message[item.id] = item.value;
				console.log("Label Manager Config=", item);
			} );
		});
	}), true);

});
