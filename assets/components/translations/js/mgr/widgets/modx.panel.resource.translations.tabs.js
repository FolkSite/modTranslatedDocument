/**
 * Translations
 *
 * Copyright 2012 by Alan Pich <alan@alanpich.com>
 *
 * Translations is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * Translations is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Translations; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
**/

/**
 * Loads the Resource Translations Panel Tabs
 * 
 * @class MODx.panel.ResourceTranslationsTabs
 * @extends MODx.Panel
 * @param {Object} config
 * @xtype panel-resource-translations-tabs
 */
MODx.panel.ResourceTranslationsTabs = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'modx-panel-resource-translations-tabs'
        ,title: _('translations')
        ,header: true
		,deferredRender: false
        ,headerCfg: {
		    tag: 'div',
		    id: 'modx-resource-vtabs-header',
		    cls: 'x-tab-panel-header vertical-tabs-header  x-unselectable',        // same as the Default class
		    html: '<h4 id="modx-resource-vtabs-header-title"><strong>'+ _('translations.languages') +'</strong></h4>'
		}
        ,class_key: ''
        ,resource: ''
        ,cls: 'x-form-label-top x-tab-panel vertical-tabs-panel'
        ,autoHeight: true
        ,labelAlign: 'top'
        ,listeners: {
        		'beforetabchange': {fn: function(tabpanel,newtab,oldtab){
        		    if(oldtab==null){return;};
        			if(newtab.id == 'newTranslationTab'){
        				Ext.getCmp('modx-window-newtranslation').show();
        				return false;
        			};
        		}}
       	}

        ,items: this.getTranslationForms()
    });
    MODx.panel.ResourceTranslationsTabs.superclass.constructor.call(this,config);
    this.addEvents({ load: true });
};


Ext.extend(MODx.panel.ResourceTranslationsTabs,MODx.VerticalTabs,{
    autoload: function() {
        return false;
    }
    ,refreshTVs: function() { }
    
    // Returns Ext Tab Panels for each existing translation -------------------
    ,getTranslationForms: function(){
    	var items = Array();
    		
    	var langs = AvailableTranslations;
    	
    	if(langs.length<1){
    		items.push({
    			title: ''
    			,html: 'Click \'New Translation\' to add a language'
    		});
    	};
    	
    	for(var k=0;k<langs.length;k++){
    		lang = langs[k];
    		items.push({
					title: _('translations.language.'+lang) || "Unknown ["+lang+']'
					,lang: langs[k]
					,listeners: {
						'show': {fn: function(){
							if(MODx.config.use_editor && MODx.loadRTE){
								  MODx.loadRTE( 'content'+this.activeTab.lang );
							}
						},scope:this}
					}
					,items: [{
						xtype: 'toolbar'
						,items:[
							'<h2>'+_('translations.lang_translation',{lang:_('translations.language.'+lang)})+'</h2>'
							,'->'
							,{
								xtype:'button'
								,text: _('translations.remove_translation')
								,handler: function(){
									MODx.msg.confirm({
									   title: _('translations.remove_lang_translation',{lang:_('translations.language.'+lang)})
									   ,text: _('translations.remove_translation_msg')
									   ,url: TranslationsConnector
									   ,params: {
										  id: TranslationsJSON[lang]['id']
										  ,action: 'translation/remove'
									   }
									   ,listeners: {
											'success':{fn: function(r) {
												 document.location.href = document.location.href;
											},scope:true}
									   }
									});
								}
						}]
					},{
							xtype: 'hidden'
							,fieldLabel: ''
							,description: ''
							,name: 'TranslationID'+lang
							,id: 'modx-resource-transid-'+lang
							,allowBlank: true
							,enableKeyEvents: false
							,value: TranslationsJSON[lang]['id'] || ''
						},{
							xtype: 'textfield'
							,fieldLabel: _('resource_pagetitle')+''
							,description: '<b>[[*pagetitle]]</b><br />'+_('resource_pagetitle_help')
							,name: 'pagetitle'+lang
							,id: 'modx-resource-pagetitle-'+lang
							,maxLength: 255
							,anchor: '100%'
							,allowBlank: true
							,enableKeyEvents: true
							,value: TranslationsJSON[lang]['pagetitle'] || ''
							,listeners: {'change': {fn:triggerDirtyField,scope:this}}
						},{
							xtype: 'textfield'
							,fieldLabel: _('resource_longtitle')
							,description: '<b>[[*longtitle]]</b><br />'+_('resource_longtitle_help')
							,name: 'longtitle'+lang
							,id: 'modx-resource-longtitle'+lang
							,maxLength: 255
							,anchor: '100%'
							,value: TranslationsJSON[lang]['longtitle'] || ''
							,listeners: {'change': {fn:triggerDirtyField,scope:this}}
						},{
							xtype: 'textfield'
							,fieldLabel: _('resource_menutitle')
							,description: '<b>[[*menutitle]]</b><br />'+_('resource_menutitle_help')
							,name: 'menutitle'+lang
							,id: 'modx-resource-menutitle2'+lang
							,maxLength: 255
							,anchor: '100%'
							,value: TranslationsJSON[lang]['menutitle'] || ''
							,listeners: {'change': {fn:triggerDirtyField,scope:this}}
						},{
							xtype: 'textarea'
							,fieldLabel: _('resource_description')
							,description: '<b>[[*description]]</b><br />'+_('resource_description_help')
							,name: 'description'+lang
							,id: 'modx-resource-description'+lang
							,maxLength: 255
							,anchor: '100%'
							,value: TranslationsJSON[lang]['description'] || ''
							,listeners: {'change': {fn:triggerDirtyField,scope:this}}
						},{
							xtype: 'textarea'
							,fieldLabel: _('resource_summary')
							,description: '<b>[[*introtext]]</b><br />'+_('resource_summary_help')
							,name: 'introtext'+lang
							,id: 'modx-resource-introtext'+lang
							,grow: true
							,anchor: '100%'
							,value: TranslationsJSON[lang]['introtext'] || ''
							,listeners: {'change': {fn:triggerDirtyField,scope:this}}
						},{
							xtype: 'textarea'
							,fieldLabel: _('resource_content')
							,description: '<b>[[*content]]</b><br />'+_('resource_content_help')
							,name: 'content'+lang
							,id: 'content'+lang
							,cls: 'translationContentField'
							,anchor: '100%'
							,height: 400
							,grow: false
							,value: TranslationsJSON[lang]['content'] || ''
							,listeners: {'change': {fn:triggerDirtyField,scope:this}}
						}]
				});
    	};
    	items.push({
    				title: _('translations.new_translation')
    				,html: ''
    				,id: 'newTranslationTab'
    				,iconCls: 'newLanguage'
    			});
    	return items;
    }
});
Ext.reg('modx-panel-resource-translations-tabs',MODx.panel.ResourceTranslationsTabs);
