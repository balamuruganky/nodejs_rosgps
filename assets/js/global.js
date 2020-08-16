var Global = {};

(function($, document, window) {
    return Global = {
        /*
         loadCssDependency
         This function injects CSS resources programatically.
         For use in JS widgets to load CSS dependencies specific to that widget
         @param: url : just the namespace and name of the CSS resource to be loaded.
         */
        loadCssDependency : function(url) {
            var css = document.createElement('link');
            css.href = "/assets/css" + url;
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("media", "screen");
            document.getElementsByTagName('head')[0].appendChild(css);
        }
    };
})(jQuery, document, window);


Global.gpsLocation = {lat : "0.0", lon : "0.0"};