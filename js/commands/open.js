"use strict"
/**
 * @class  elFinder command "open"
 * Enter folder or open files in new windows
 *
 * @author Dmitry (dio) Levashov
 **/  
elFinder.prototype.commands.open = function() {
	this.alwaysEnabled = true;
	
	this._handlers = {
		dblclick : function(e) { e.preventDefault(); this.exec() },
		'select enable disable reload' : function(e) { this.update(e.type == 'disable' ? -1 : void(0));  }
	}
	
	this.shortcuts = [{
		pattern     : 'ctrl+down numpad_enter'+(this.fm.OS != 'mac' && ' enter')
	}];

	this.getstate = function(sel) {
		var sel = this.files(sel),
			cnt = sel.length;
		
		return cnt == 1 
			? 0 
			: cnt ? ($.map(sel, function(file) { return file.mime == 'directory' ? null : file}).length == cnt ? 0 : -1) : -1
	}
	
	this.exec = function(hashes) {
		var fm    = this.fm, 
			dfrd  = $.Deferred().fail(function(error) { error && fm.error(error); }),
			files = this.files(hashes),
			cnt   = files.length,
			file, url, s, w;

		if (!cnt) {
			return dfrd.reject();
		}

		// open folder
		if (cnt == 1 && (file = files[0]) && file.mime == 'directory') {
			return file && !file.read
				? dfrd.reject(['errOpen', file.name, 'errPerm'])
				: fm.request({
						data   : {cmd  : 'open', target : file.hash},
						notify : {type : 'open', cnt : 1, hideCnt : true},
						syncOnFail : true
					});
		}
		
		files = $.map(files, function(file) { return file.mime != 'directory' ? file : null });
		
		// nothing to open or files and folders selected - do nothing
		if (cnt != files.length) {
			return dfrd.reject();
		}
		
		// open files
		cnt = files.length;
		while (cnt--) {
			file = files[cnt];
			
			if (!file.read) {
				return dfrd.reject(['errOpen', file.name, 'errPerm']);
			}
			
            fm.request({
                data : {cmd: 'get', target: file.hash},
                notify: {type: 'download', cnt: 1},
                syncOnFail: false
            })
            .done(function(name) {
                return function(data) {
                    if (window.ArrayBuffer && window.Uint8Array) {
                        var blob = new BlobBuilder(),
                            len = data.content.length,
                            i, arr = new ArrayBuffer(len),
                            arr_bytes = new Uint8Array(arr);
                        for (i = 0; i < len; i++) {
                            arr_bytes[i] = data.content.charCodeAt(i) & 0xff;
                        }
                        blob.append(arr);
                    } else {
                        /* Binary files won't work here. Oh well */
                        var blob = new BlobBuilder();
                        blob.append(data.content);
                    }
                    saveAs(blob.getBlob(), name);
                };
            }(file.name))
            .fail(function(error) {
                dfrd.reject(error);
            })
        }
		return dfrd.resolve(hashes);
	}

}
