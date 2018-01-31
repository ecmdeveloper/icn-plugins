define([
		"dojo/_base/declare",
		"dojo/store/Memory",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dijit/form/FilteringSelect",
		"dijit/form/Button",
		"dijit/form/Textarea",
		"ecm/Messages",
		"ecm/widget/admin/PluginConfigurationPane",
		"dojo/text!./templates/ConfigurationPane.html"
	],
	function(declare, Memory, on, lang, domConstruct, _TemplatedMixin, _WidgetsInTemplateMixin, FilteringSelect, Button, Textarea, Messages, PluginConfigurationPane, template) {

		return declare("labelmanager.ConfigurationPane", [ PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
				
		templateString: template,
		widgetsInTemplate: true,
		widgetIndex: 1,
		
		postCreate: function() {
		
			var data = [];
			
			for (var key in Messages) {
				data.push({
					name: key,
					id: key,
					value: Messages[key],
					orgValue: Messages[key],
					changed: false
				});
			}
			
			this.messagesStore = new Memory({data: data} );
			on(this.addButton, "click", lang.hitch(this, this.onAddMessage) );
			on(this.checkButton, "click", lang.hitch(this, this.onCheckMessages) );
			
		},
		
		onCheckMessages: function() {

			debugger;
			const queryResult = this.messagesStore.query({changed: true});
			queryResult.forEach( function(value) {
				console.log(value);
			});
		},
		
		onMessageChange: function(value) {
			
			const queryResult = this.store.query({id: value});
			if ( queryResult.length > 0 ) {
				this.text.set("value", queryResult[0].value );
			}
		},
		
		onAddMessage: function() {
			
			const selectButtonId = this.id + "_selectButton" + this.widgetIndex;
			const selectTextId = this.id + "_selectText" + this.widgetIndex;
			const deleteButtonId = this.id + "_deleteButton" + this.widgetIndex++;
			
			const row = domConstruct.toDom("<tr><td class='propertyRowLabel'><div id='" + selectButtonId
					+ "'></div></td><td class='propertyRowValue'><div id='" + selectTextId
					+ "'></div></td>" + "<td><button id='" + deleteButtonId
					+ "' type='button'/></td></tr>");
			
		    domConstruct.place(row, "messagesTable");

		    const textarea = new Textarea({
		        name: selectTextId,
		        style: "width:100%;font-family: inherit;"
		    }, selectTextId);
		    
		    textarea.startup();
		    
		    const button = new dijit.form.Button({
		        label: "Delete",
		        onClick: function(){
		        }
		    }, deleteButtonId);
		    
		    const filteringSelect = new FilteringSelect({
		        id: selectButtonId,
		        store: this.messagesStore,
		        searchAttr: "name"
		    }, selectButtonId );
		    
		    filteringSelect.startup();
			
		    const callbackContext = {
		    	store: this.messagesStore,
		    	text: textarea,
		    	id: filteringSelect,
		    	row: row,
		    	widget: this
		    };
		    
		    on(filteringSelect, "change", lang.hitch(callbackContext, this.onMessageChange) );
		    on(textarea, "change", lang.hitch(callbackContext, this.onFieldChange) );
			on(button, "click", lang.hitch(callbackContext, this.onDeleteMessage) );
		},
		
		onFieldChange: function(value) {

			const queryResult = this.store.query({id: this.id.get("value") });
			if ( queryResult.length > 0 ) {
				queryResult[0].changed = value !== queryResult[0].orgValue;
				queryResult[0].value = value;
			}
			
			const changedResult = this.store.query({changed: true});
			if (changedResult.length > 0) {
				this.widget.onSaveNeeded(true);
			}
		},
		
		onDeleteMessage: function() {

			const id = this.id.get("value");
			if ( id ) {
				const queryResult = this.store.query({id: this.id.get("value") });
				if ( queryResult.length > 0 ) {
					queryResult[0].changed = false;
					queryResult[0].value = queryResult[0].orgValue;
				}
			}
			
			const changedResult = this.store.query({changed: true});
			if (changedResult.length > 0) {
				this.widget.onSaveNeeded(true);
			}
			
			domConstruct.destroy(this.row);
			
		},
		
		load: function(callback) {
		},
		
		validate: function() {
			return true;
		}
	});
});
