// Spotify API
var Mikhail_token = "BQAWq52LPA-hVh5tkhCFfR6hGfH1LMoVENR0NUBrmj4_WNr9n3AtOWEAaEsMsg96_QNyXk9e4xzMkIvaL6IwvbxufrXpZe9o9gQevb3fC7NlmSvg-e8KJIME35NYYK1-uxCBHlmYprxVxr_2bv_ASv0afJR7aIpp1wP27QMn-FcUbxGJm7jxiaiYARJjHKux6INztB6Cx3RDZcU-LcJR1bAc_5FjCy8wvPXiiBXpghe0BLlwUHKKCXP2TFo7s2A0whBwwkF7vJOq0YgCVs8-18eyhVyzTIvmTtL6zeptCDWruf8";
var Kenneth_token = "BQAtw6BmPEv_baucW-GY-84l_ZDQ3PLsQ7jDvFLxIZiJoud9sW7ZbowcefQPexpvdTmcEbBD3LMWcGALg4WWWV4eRMTsR51JGOkA5_EN0lRHOBbXeybk76yAQ5FylOE8lUTUaQWMySrHTojP_Ga1T3H5xGq0iG6GIw6HHYI";
var client_id = "9ed7472797b146d1bc5cfaa17f19a6bf";
var client_secret = "695b5b3e9db24f23bd71fcb8c2f85e8c";

// Echonest API
var enkey = 'FIWW1FAOTC35KFT7L';

// Universal
var redirect_uri = "http://localhost";


function expand(que) {
	$('#results').slideDown();
	$('#hide').slideDown();
	$('#playlist').animate({height: '50%'});
	search(que);
}

function hide() {
	$('#results').slideUp();
	$('#hide').slideUp();
	$('#playlist').animate({height: '95%'});
}

function search(q) {
	$.ajax({
		url: 'https://api.spotify.com/v1/search',
		data: {
			q: "track:" + q,
			type: 'track',
			market: 'US'
		},
		success: function(data){
			$(".results_display").empty();
			var item;
			for (var i = 0; i < data.tracks.items.length; i++) {
				item = data.tracks.items[i];
				$(".results_display").append("<tr><td id = "+item.id+" data-trackid=" + item.id + ">" + item.name + "</td><tr>");
			}
			getTrackInfo(item.id);
		},
		error: function(data){
			console.log(data);
		}
	});
}

function getTrackInfo(trackId) {
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/track/profile',
		data: {
			api_key: enkey,
			format: 'jsonp',
			id: trackId, // query artist and title fields
			bucket: 'audio_summary'
		},
		dataType: 'jsonp',
		success: function ENTrackSuccess(data, status, jqxhr){
			console.log(data);
			var analysis_url = data && data.response && data.response.track &&
			data.response.track.audio_summary &&
			data.response.track.audio_summary.analysis_url;
			if (!analysis_url) { /*TODO*/ return; }

			$.getJSON(analysis_url, function analSuc(data,status,jqxhr){
				console.log('anal-', data);
			});
		},
		error: function ENTrackErr(jqxhr, status, err){
			console.log(jqxhr, status, err);
		}
	});
}

function Song(trackid){
	this.trackid = trackid;
	return this;
};

Song.prototype.addToPlaylist = function(playlistId) {
	var url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlistId + '/tracks', self = this;

	$.ajax({
		method: 'POST',
		url: url,
		headers: {
			'Authorization': 'Bearer ' + Mikhail_token
		},
		data: {
			uris: self.toURI()
		},
		success: function(data, status) {console.log(data);},
		error: function(jqxhr, status, err) { console.log(jqxhr, status, err); }
	});
};

Song.prototype.toURI = function() { return 'spotify:track:' + this.trackid; };
Song.prototype.toPlayWidget = function() {
	var src = 'https://embed.spotify.com/?uri=' + this.toURI();
	return $('<iframe>', {src: src, width: 300, height: 380, frameborder: '0', allowtransparency: true}).get(0);
 };

