function Song(trackid, title, artist) {
	this.trackid = trackid || '';
	this.title = title || '';
	this.artist = artist || '';
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
		dataType: 'jsonp',
		data: {
			uris: self.toURI()
		},
		success: function(data, status) {console.log(data);},
		error: function(jqxhr, status, err) { console.log(jqxhr, status, err); }
	});

return this;
};

Song.prototype.toURI = function() { return 'spotify:track:' + this.trackid; };
Song.prototype.toPlayWidget = function() {
	var src = 'https://embed.spotify.com/?uri=' + this.toURI();
	return $('<iframe>', {src: src, width: 300, height: 380, frameborder: '0', allowtransparency: true}).eq(0);
 };

Song.prototype.getTrackInfo = function getTrackInfo(trackId) {
	// Populates song's title and artist
	var self = this;
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/track/profile',
		data: {
			api_key: enkey,
			format: 'jsonp',
			id: 'spotify:track:' + (trackId || this.trackid), 
			bucket: 'audio_summary'
		},
		dataType: 'jsonp',
		success: function ENTrackSuccess(data, status, jqxhr){
			console.log(data);

			if (data && data.response && data.response.track) {
		
			var analysis_url = data.response.track.audio_summary &&
			data.response.track.audio_summary.analysis_url;
			self.title = data.response.track.title;
			self.artist = data.response.track.artist;
		
			} else { /*TODO*/ return; }
			if (!analysis_url) { /*TODO*/ return; }

			$.getJSON(analysis_url, function analSuc(data,status,jqxhr){
				console.log('anal-', data);
			});
		},
		error: function ENTrackErr(jqxhr, status, err){
			console.log(jqxhr, status, err);
		}
	});

	return this;
}

Song.prototype.getSongInfo = function getSongInfo(title, artist) {
	// Populates song's artistId
	var self = this;
	
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/song/search',
		data: {
			api_key: enkey,
			format: 'jsonp',
			title: title || this.title,
			artist: artist || this.artist
		},
		dataType: 'jsonp',
		success: function(data, status) {console.log(data); self.artistId = data.response && data.response.songs && data.response.songs[0] && data.response.songs[0].artist_id; console.log(self); },
		error: function(jqxhr, status, err) { console.log(jqxhr, status, err); }
		
	});

	return this;
}


Song.prototype.getArtistInfo = function(artistId) {
	var self = this;
	
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/artist/profile?',
		data: {
			api_key: enkey,
			id: artistId || this.artistId,
			format: 'jsonp',
			bucket: ['biographies', 'doc_counts', 'genre', 'images', 'artist_location', 'songs', 'terms', 'years_active']
		},
		dataType: 'jsonp',
		traditional: true,
		success: function(data, status) {console.log(data); },
		error: function(jqxhr, status, err) { console.log(jqxhr, status, err); }
		
	});

	return this;

}

Song.prototype.analyze = function(url){
	$.getJSON(url, function(data,status,jqxhr){
		console.log('anal-', data);
	});
	
}

