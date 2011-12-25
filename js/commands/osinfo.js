"use strict";
/**
 * @class elFinder command "osinfo". 
 * Display dialog with file properties.
 *
 **/
elFinder.prototype.commands.osinfo = function() {
	var m   = 'msg',
		fm  = this.fm,
		msg = {
			calc     : fm.i18n('calc'),
			size     : fm.i18n('size'),
			unknown  : fm.i18n('unknown'),
			path     : fm.i18n('path'),
			aliasfor : fm.i18n('aliasfor'),
			modify   : fm.i18n('modify'),
			perms    : fm.i18n('perms'),
			locked   : fm.i18n('locked'),
			dim      : fm.i18n('dim'),
			kind     : fm.i18n('kind'),
			files    : fm.i18n('files'),
			folders  : fm.i18n('folders'),
			items    : fm.i18n('items'),
			yes      : fm.i18n('yes'),
			no       : fm.i18n('no'),
			link     : fm.i18n('link')
		};
		
	this.tpl = {
		main       : '<div class="ui-helper-clearfix elfinder-info-title"><span class="elfinder-cwd-icon {class} ui-corner-all"/>{title}</div><table class="elfinder-info-tb">{content}</table>',
		itemTitle  : '<strong>{name}</strong><span class="elfinder-info-kind">{kind}</span>',
		groupTitle : '<strong>{items}: {num}</strong>',
		row        : '<tr><td>{label} : </td><td>{value}</td></tr>',
	}
	
	this.alwaysEnabled = true;
	this.updateOnSelect = false;
	
	this.init = function() {
		$.each(msg, function(k, v) {
			msg[k] = fm.i18n(v);
		});
	}
	
	this.getstate = function() {
		return 0;
	}
	
	this.options = { ui : 'osinfobutton'};
	this.exec = function(hashes) {
		var self    = this,
			fm      = this.fm,
			tpl     = this.tpl,
			row     = tpl.row,
			content = [],
			view    = tpl.main,
			l       = '{label}',
			v       = '{value}',
			opts    = {
				title : this.title,
				width : 'auto',
				close : function() { $(this).elfinderdialog('destroy'); }
			},
			id = fm.namespace+'-osinfo',
			dialog = fm.getUI().find('#'+id), 
			size, title,
            dfrd = $.Deferred();
			
		if (dialog.length) {
			dialog.elfinderdialog('toTop');
			return $.Deferred().resolve();
		}
		
        fm.request({
            data : {cmd: 'get', target: 'osinfo'},
            notify: {type: 'open', cnt: 1},
            syncOnFail: false
        })
        .done(function(data) {
            view = view.replace('{content}', data.content);
            dialog = fm.dialog(view, opts);
            dialog.attr('id', id);
        })
        .fail(function(error) {
            dfrd.reject(error);
        });
        return dfrd;
	}
}
