var Mikhail_token = "BQD8Zq9M1GYGD9eLMiS6zMpjhFEJV36YraM6-2VTq8DHKpJEHU7tK1PAZcAtGrhVafXU25ySeiSQ6YbRF0Kw7Grd1qcZ1CK1z-lIEvQGAtwqUz0D2TvSrrdeLh3ma-hvg943ILyOzz1fC4nYqRpcPluN4PeKAnjsr1UTf6KIQej-3TRF9o3f2opEAj2gOh50NnapZ1D69ctT3iqx6wget5DTgIMPC1L0Pv4-lBBFWFvzkzph2-cNXGZ6iJhGz1BiEfuc-qKVkeY977xrnHOb8pkEgu-gSrxjyZvuJdl3A9rl2fo";
var Kenneth_token = "BQAGsjQM2yn6Kva-Mu2nbriDqISi2b_Y8bjtxeINLGkHXD5BlcGpOrhZypIdN9hoR422h0sHsdRiLMZrX0-L3nQLonTZYGetZzYgPm4P9VpS2Zane6-uw78fwycFui08_gJrrZ7tu_QMRRrx2Oulce0XEM7eWRU_ish37x8";
var client_id = "9ed7472797b146d1bc5cfaa17f19a6bf";
var client_secret = "695b5b3e9db24f23bd71fcb8c2f85e8c";
var enkey = 'FIWW1FAOTC35KFT7L';
var redirect_uri = "http://localhost";

/*
$.ajax({
	url: 'https://api.spotify.com/v1/me',
	data: {
		'Authorization': token
	},
	success: function(data) {
		console.log("auth");
		console.log(data.data.display_name);
	}
});
*/
function expand() {
	$('#results').slideDown();
	$('#playlist').animate({height: '50%'});

	var x = document.getElementsByName("sname")[0].value;
	search(x);
/*
	$.ajax({
		url: 'https://api.spotify.com/v1/me',
		headers: {
			'Authorization': 'Bearer ' + Kenneth_token
		},
		success: function(data) {
			console.log(data.birthdate);
		}
	});*/


}

function hide() {
	$('#results').slideUp();
	$('#playlist').animate({height: '95%'});
}

function search(q) {
	$.ajax({
		url: 'https://api.spotify.com/v1/search',
		data: {
			q: q,
			type: 'track,artist',
			market: 'US'
		},
		success: function ENSearchSuccess(data, status, jqxhr){
			console.log(data);
		},
		error: function ENSearchErr(jqxhr, status, err){
			console.log(jqxhr, status, err);
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
