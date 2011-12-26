"use strict";
/**
 * @class elFinder command "osinfo". 
 * Display dialog with file properties.
 *
 **/
elFinder.prototype.commands.osinfo = function() {
	var m   = 'msg',
		fm  = this.fm;
	this.tpl = {
		main       : '<div class="ui-helper-clearfix elfinder-info-title"><span class="elfinder-cwd-icon {class} ui-corner-all"/>{title}</div><table class="elfinder-info-tb">{content}</table>',
		itemTitle  : '<strong>{name}</strong>',
		row        : '<tr><td>{label} : </td><td>{value}</td></tr>',
	}
	
	this.alwaysEnabled = true;
	this.updateOnSelect = false;
	
	this.init = function() {
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
            notify: {type: 'osinfo', cnt: 1},
            syncOnFail: false
        })
        .done(function(data) {
            var obj = $.parseJSON(data.content);
			title = tpl.itemTitle.replace('{name}', obj.title);
            for (var i = 0; i < obj['rows'].length; i++) {
                content.push(row.replace(l, obj['rows'][i][0]).replace(v, obj['rows'][i][1]));
            }
            view = view.replace('{title}', title).replace('{content}', content.join(''));
            dialog = fm.dialog(view, opts);
            dialog.attr('id', id);
        })
        .fail(function(error) {
            dfrd.reject(error);
        });
        return dfrd;
	}
}
