// This is sirra-bootstrap.

// Global variable _sirra.
var _sirra = {};
var gv = {};

var current = null;


var isIE = false;
if(navigator.appName == "Microsoft Internet Explorer") isIE = true;

if (!window.console) {
	console = {};
	console.log = function(){};
}

function log() {
	if(isIE) {
		for(var i=0; i<arguments.length; i++) {
			console.log(arguments[i]);
		}
	} else {
		console.log.apply(console, arguments);
	}
};

function err() {
    if(isIE) {
        for(var i=0; i<arguments.length; i++) {
            console.log(arguments[i]);
        }
    } else {
        console.log.apply(console, arguments);
    }
}

log.error = err;

log("Starting sirra-bootstrap.js");

var loadCss = function(cssFile) {
	log("-- Loading css: " + cssFile);
	
	$("head").append("<link>");
    css = $("head").children(":last");
    css.attr({
      rel:  "stylesheet",
      type: "text/css",
      href: cssFile
    });
};

if(isIE) {
	var cssLoader = document.createStyleSheet();
	var cssLoaderCounter = 0;
	var loadCss = function(cssFile) {
		cssLoader.addImport(cssFile);
		cssLoaderCounter++;
		
		if(cssLoaderCounter > 30) { // IE Limit 32
			cssLoader = document.createStyleSheet();
			cssLoaderCounter = 0;
		}
	};
}

function loadHtml(htmlFile, successFunction) {
	log("-- Loading html: " + htmlFile);
	$.ajax({
	  url: htmlFile,
	  success: successFunction,
	  error: function(a,b,c) {
		  log.error("Error loading HTML: " + htmlFile);
		  _showAjaxError(a,b,c);
	  },
	  dataType: "html"
	});
};

function loadJs(jsFile, successFunction) {
	log("-- Loading js: " + jsFile);
	$.ajax({
	  url: jsFile,
	  success: successFunction,
	  error: function(a,b,c) {
		  log.error("Error loading JS: " + jsFile);
		  _showAjaxError(a,b,c);
	  },
	  dataType: "script",
	  cache: true // Cache whenever possible
	});
};

function _showAjaxError(a,b,c) {
	log("HTTP Status: " + a.status);
	log.error(a);
	log.error(b);
	log.error(c);
	log("" + a);
	log("" + b);
	log("" + c);
	log(c.message);
	log(c.stack);
};

var loadCounter = {html:0, js:0, css:0, totalHtml: 0, totalJs: 0};

var _initialLoaded = function(extension) {
	loadCounter[extension]++;
	
	log("LoadCounter: ", loadCounter);

	if(loadCounter.html == loadCounter.totalHtml && loadCounter.js == loadCounter.totalJs) {
		// Done loading.
		
		// Read all the widgets that have been loaded.
		_sirra.processWidgets();
		
		log("Loaded all files. Starting page-specific sirra code.");
		
		current = $("#sirra");
		
		// We need to check if onLoad was already called
		onSirraStart();
	}
}

_sirra.widgetHolder = $("<div></div>");
var _initialLoadedHtml = function(htmlContents) {
	_sirra.widgetHolder.append(htmlContents);
	_initialLoaded("html");
}
