require(["dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/aspect",
         "ecm/model/Desktop",
         "ecm/model/admin/PluginConfig"
         ], 
function(declare, lang, aspect, Desktop, PluginConfig ) {

	var writeCss = function(css) {
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');

		style.type = 'text/css';
		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
	};

	aspect.after(Desktop, "onLogin", lang.hitch(this, function(response) {
		var pluginConfig = PluginConfig.createPluginConfig("CSSTweaker");
		pluginConfig.getPluginConfig( function() {
			var css = pluginConfig.getConfiguration();
			if (css) {
				writeCss(css);
			}
		});
	}), true);

	
});
