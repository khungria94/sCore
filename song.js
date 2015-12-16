var keyMap = {
	0: 'c',
	1: 'c-sharp',
	2: 'd',
	3: 'e-flat',
	4: 'e',
	5: 'f',
	6: 'f-sharp',
	7: 'g',
	8: 'a-flat',
	9: 'a',
	10: 'b-flat',
	11: 'b'
};
var modeMap = { 0: 'Minor', 1: 'Major' };
function tempoMap(tempo) {
	if (tempo < 60) return 'Slow';
	else return 'Allegro';
}
function confMap(conf) {
	if (conf < 0.5) return 'maybe';
	else return 'definitely';
}

function Song(trackid, title, artist) {
	// may also have artistId
	this.trackid = trackid || '';
	this.title = title || '';
	this.artist = artist || '';
	return this;
}

Song.prototype.addToPlaylist = function(playlistId, cb) {
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
		success: function(data, status) {console.log(data); if (cb) cb(null, data); },
		error: function(jqxhr, status, err) { console.warn(jqxhr, status, err); if (cb) cb(err); }
	});

return this;
};

Song.prototype.toURI = function() { return 'spotify:track:' + this.trackid; };
Song.prototype.toPlayWidget = function() {
	var src = 'https://embed.spotify.com/?uri=' + this.toURI();
	return $('<iframe>', {src: src, width: 300, height: 380, frameborder: '0', allowtransparency: true}).eq(0);
 };

Song.prototype.getTrackInfo = function getTrackInfo(trackId, cb) {
	// Populates song's title and artist
	if (typeof trackId === 'function' && cb === undefined) { cb = trackId; trackId = null; }

	var self = this;
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/track/profile',
		data: {
			api_key: enkey,
			format: 'jsonp',
			id: 'spotify:track:' + (trackId),
			bucket: 'audio_summary'
		},
		dataType: 'jsonp',
		success: function ENTrackSuccess(data, status, jqxhr){
			console.log(trackId);
			console.log(data);

			if (data && data.response && data.response.track) {

			self.analysis_url = data.response.track.audio_summary &&
			data.response.track.audio_summary.analysis_url;
			self.title = data.response.track.title;
			self.artist = data.response.track.artist;

			} else { /*TODO*/ return; }

			/*$.getJSON(analysis_url, function analSuc(data,status,jqxhr){
				console.log('anal-', data);
			});*/
			//	self.analyze(analysis_url);
			if (cb) cb(null, data);
		},
		error: function ENTrackErr(jqxhr, status, err){
			console.log(trackId);
			console.warn(jqxhr, status, err); if (cb) cb(err);
		}
	});
	return this;
}

// Doesn't work that well right now. I think too much variation in titles
Song.prototype.getSongInfo = function getSongInfo(title, artist, cb) {
	// Populates song's artistId
	if (typeof title === 'function' && cb === undefined) { cb = title; title = null; }
	else if (typeof title === 'string' && typeof artist === 'function' &&
		cb === undefined) { cb = artist; artist = null; }

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
		success: function(data, status) {console.log(data); self.artistId = data.response && data.response.songs && data.response.songs[0] && data.response.songs[0].artist_id; console.log(self); if (cb) cb(null, data); },
		error: function(jqxhr, status, err) { console.warn(jqxhr, status, err); if (cb) cb(err); }

	});
	return this;
}


Song.prototype.getArtistInfo = function getArtistInfo(artistId, cb) {
	if (typeof artistId === 'function' && cb === undefined) { cb = artistId; artistId = null; }
	var self = this;

	$.ajax({
		url: 'http://developer.echonest.com/api/v4/artist/profile?',
		data: {
			api_key: enkey,
			id: this.artistId || artistId,
			format: 'jsonp',
			bucket: ['biographies', 'doc_counts', 'genre', 'images', 'artist_location', 'songs', 'terms', 'years_active']
		},
		dataType: 'jsonp',
		traditional: true,
		success: function(data, status) {
			console.log(data);
			var a = data.response.artist;
			self.artistObj = {
				location: a.artist_location.location,
				bio: a.biographies, // license, site, text, truncated, url
				genres: a.genres.map(function(x) { return x.name; /* don't know how reliable */ }),
				pics: a.images.map(function(x) { return {url: x.url, verified: x.verified, h: x.height, w: x.width}}), // not all populated
				songs: a.songs, // duplicate titles
				terms: a.terms, // frequency 0-1, name, weight 0-1
				years: a.years_active
			};
			if (cb) cb(null, data);
		 },
		error: function(jqxhr, status, err) { console.warn(jqxhr, status, err); if (cb) cb(err); }

	});

	return this;

}

Song.prototype.analyze = function analyze(url, cb){
	if (typeof url === 'string' && cb === undefined) { cb = url; url = null; }

	var self = this;
	$.getJSON(url || self.analysis_url, function(data,status,jqxhr){
		self.analysis = {
		keyString: keyMap[data.track.key],
		keyConfString: confMap(data.track.key_confidence),
		modeString: modeMap[data.track.mode],
		modeConfString: confMap(data.track.mode_confidence),
		tempo: data.track.tempo,
		tempoString: tempoMap(data.track.tempo),
		tempoConf: confMap(data.track.tempo_confidence),
		timeSig: data.track.time_signature, // over 4. val of 1 means complex or changing
		timeSigConf: confMap(data.track.time_signature_confidence)
		};	console.log('anal-', data, self.analysis); if (cb) cb(null, data);
	});

}

Song.prototype.getAllInfo = function() {
	var self = this;
	this.getTrackInfo(function(){ self.getSongInfo(function(){
		self.getArtistInfo(function() { self.analyze();});
	}); });
}

