"use strict"
/**
 * @class  elFinder toolbar button to switch current directory view.
 *
 **/
$.fn.elfinderosinfobutton = function(cmd) {
	return this.each(function() {
		var button = $(this).elfinderbutton(cmd),
			icon   = button.children('.elfinder-button-icon');
        icon.text('OS Info');
        button.addClass('elfinder-button-osinfo');
	});
}
