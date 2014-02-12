$(document).ready(function() { 
	
	// event to trigger function also on pressing return key
	$('#url').keypress(function (e) {
		if (e.which == 13) {
			jQuery(this).blur();
            jQuery('#url-submit').focus().click();
			return false;    //<---- Add this line
		}
	});
	
	// $('#url-submit').submit(function() {
	$("#url-submit").click(function(){
		
		var loopStreamUrl = "";
		var radimetaApi = "";
		
		// get url from input
		var inputUrl = $("#url").val();
		
		//if input empty take placeholder
		if (inputUrl =="") inputUrl = "http://fm4.orf.at/radio/stories/fm4unlimited";
		
		//get html for url
		$.get(inputUrl, function(res) {
			
			//find loopstream and radimetaApi URLs in <head>
			$("head script").each(function(){
				var text = $(this).html();
				
				var patternApi = /radimetaApi"\s*:\s*"(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))"/;
				var patternLoop = /loopStreamUrl"\s*:\s*"(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))"/;
				 
				patternLoop.exec(text);
				loopStreamUrl = RegExp.$1;
				
				patternApi.exec(text);
				radimetaApi = RegExp.$1;
				
				if (loopStreamUrl !="" && radimetaApi!="")
					return false;
				
			});
			
			
			$(res.responseText).find('.audioplaylist').each(function() {
				//find playlist ids
				var id = $(this).attr('id');
				
				//get playlist json
				var requestUrl = radimetaApi+id+"?callback=?";
				
				$.getJSON(requestUrl).done(function( data ) {
					var loopStreamId = data.streams.0.loopStreamId;
					
					jQuery('<li>', {
						html: loopStreamUrl + "&id="+loopStreamId
					}).appendTo($('#links-liste'));
				});
				
				//generate and output url
			
			});
		
			// jQuery('<li>', {
				// html: url 
			// }).appendTo($('#links-liste'));
		});
	
	// $.get('http://snipplr.com/all/language/jquery', function(res) { //get the html source of this website 
		// $(res.responseText).find('.snippets li h3').each(function() { //loop though all h3 in the snippets list 
			// var anchor = $(this).children('a:last'); //get the actual link with the text inside 
			// jQuery('<li>', { //build a li element 
				// html: jQuery('<a>', { //with a A element inside it 
				// href: 'http://snipplr.com' + anchor.attr('href'), //set the href for the link 
				// text: anchor.text() //and the text 
				// }); 
		// }).appendTo($('#jquery_snippets')); //append it to a list
	// }); 
	// $('#jquery_snippets li:first').remove(); //remove this first li ("Loading...") when done 
	}); 
	// }); 
