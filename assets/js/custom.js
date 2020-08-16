"use_strict";
$( document ).ready(function() {
	getEvents();
});

function getEvents(){
	/* 
	 * Workshops
	 * URL: https://moosehead.javazone.no/data/workshopList
	 *
	 */


	/*
	 * Events
	 * URL: https://api.trondheimdc.no/public/allSessions/TDC2019
	 *
	 */

	 /*
	jQuery.get("https://api.trondheimdc.no/public/allSessions/TDC2019", function(data, status) {
		if(status === "success"){
			
			let events = data.sessions.sort(function(a, b) {
        		return new Date(a.startTime) - new Date(b.startTime);
    		});

			const getGroupByDateTime = groupBy(['startTime']);
			//const getGroupByLanguage = groupBy(['language']);

			let groupByDateTime = getGroupByDateTime(events);

			for (var key in groupByDateTime) {
    			if (groupByDateTime.hasOwnProperty(key)) {
    				var date = new Date(key);
    				var id = date.getDate() + "-" + date.getHours() + "-" + date.getMinutes();
					
    				$("#events").append("<div id="+id+"><h2>" + ('0'+date.getHours()).substr(-2) + ":" + ('0'+date.getMinutes()).substr(-2) +"</h2></div>");

    				for (let i = 0; i < groupByDateTime[key].length; i++) {
    					const language = groupByDateTime[key][i].language === "en" ? "English" : "Norwegian";
    					$("#"+id).append("<div class='row row-striped calendar-event my-5 py-3'>"
						+	"<div class='col-md-10 col-sm-12'>"
						+		"<h3 class='text-uppercase'><strong>"+groupByDateTime[key][i].title+"</strong></h3>"
						+		"<ul class='list-inline'>"
						+			"<li class='list-inline-item'><i class='fas fa-stopwatch' aria-hidden='true'></i> "+groupByDateTime[key][i].length+" Minutes</li>"
						+			"<li class='list-inline-item'><i class='fas fa-location-arrow' aria-hidden='true'></i> "+groupByDateTime[key][i].room+"</li>"
						+			"<li class='list-inline-item'><i class='fas fa-globe-europe' aria-hidden='true'></i> </i> "+language+"</li>"
						+			"<li class='list-inline-item'><i class='fas fa-user' aria-hidden='true'></i> </i> "+groupByDateTime[key][i].speakers[0].name+"</li>"
						+		"</ul>"
						+		"<p>"+groupByDateTime[key][i].intendedAudience+"</p>"
						+	"</div>"
						+ "</div>"    					
    					);
    				}

    				console.log (JSON.stringify(data));
    			}
			}
		} else {
			console.log("Nothing happend, contact administrator!");
		}
	});
	*/	
}

const groupBy = keys => array => array.reduce((objectsByKeyValue, obj) => {
	const value = keys.map(key => obj[key]).join('-');
	objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
	return objectsByKeyValue;
}, {});
