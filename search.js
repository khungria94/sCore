// Spotify API
var Mikhail_token = "BQAWq52LPA-hVh5tkhCFfR6hGfH1LMoVENR0NUBrmj4_WNr9n3AtOWEAaEsMsg96_QNyXk9e4xzMkIvaL6IwvbxufrXpZe9o9gQevb3fC7NlmSvg-e8KJIME35NYYK1-uxCBHlmYprxVxr_2bv_ASv0afJR7aIpp1wP27QMn-FcUbxGJm7jxiaiYARJjHKux6INztB6Cx3RDZcU-LcJR1bAc_5FjCy8wvPXiiBXpghe0BLlwUHKKCXP2TFo7s2A0whBwwkF7vJOq0YgCVs8-18eyhVyzTIvmTtL6zeptCDWruf8";
var Kenneth_token = "BQAtw6BmPEv_baucW-GY-84l_ZDQ3PLsQ7jDvFLxIZiJoud9sW7ZbowcefQPexpvdTmcEbBD3LMWcGALg4WWWV4eRMTsR51JGOkA5_EN0lRHOBbXeybk76yAQ5FylOE8lUTUaQWMySrHTojP_Ga1T3H5xGq0iG6GIw6HHYI";
var client_id = "9ed7472797b146d1bc5cfaa17f19a6bf";
var client_secret = "695b5b3e9db24f23bd71fcb8c2f85e8c";
var token;

// Echonest API
var enkey = 'FIWW1FAOTC35KFT7L';

function expand(que) {
	$('#results').slideDown();
	$('#hide').slideDown();
	$('#playlist').animate({height: '40%'});
	search(que);
}

function hide() {
	$('#results').slideUp();
	$('#hide').slideUp();
	$('#playlist').animate({height: '85%'});
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
			if (data && data.tracks && data.tracks.items)
			for (var i = 0; i < data.tracks.items.length; i++) {
				item = data.tracks.items[i];
				$(".results_display").append("<tr class='normal' draggable='true' ondragstart='drag(event)' id = " +
					item.id + " data-trackid=" + item.id + "><td><img src='" +
					item.album.images[2].url + "'></td><td>" + item.name + 
					"<br><font style='font-size:.8em; color: grey'><i>by: " + item.artists[0].name + "</i></font></td></tr>");
			}
			else $('.results_display').append('<tr class="normal"><td>Sorry. No results for that track.</td></tr>'); 
			//console.log(item);
			addListeners();
		},
		error: function(data){
			console.log(data);
			alert('Sorry! I don\'t know what went wrong. Try again. :(');
		}
	});
}

function addListenersPlaylist(){
	var ids = $('#playlist > tr').map(function(i,e){
			return $(e).data('trackid')
		}).get().join('&');
	//console.log(ids.split('&'));
	ids = ids.split('&');
	
	if(ids){
		var index = ids.length-1;
		var song = document.getElementById(ids[index]);
		var s = new Song(ids[index]);
		//console.log(index);
		song.addEventListener("dblclick", function(index){s.getTrackInfo(s.trackid,printSongInfo);},false);
	}
}


function addListeners(){
	var table = document.getElementById("results_table");
	var rows = table.rows;
	for(var i = 0; i < rows.length; i++){
		(function(index){
			var s = new Song(rows[index].id);
			rows[index].addEventListener("dblclick", function(index){s.getTrackInfo(s.trackid,printSongInfo);},false);
		}(i))
	}
}

function printSongInfo(temp,data){
	if (temp) alert('Sorry! I don\'t know what went wrong. Try again. :(');

	var s = new Song(data.response.track.id,data.response.track.title, data.response.track.artist);
	var table = document.getElementById("infotable");
	var rows = table.rows;
	for(var i = 0; i < rows.length; i++){
		if(rows[i].cells.length > 1)
			rows[i].deleteCell(1);
	}
	var song = rows[0].insertCell(1);
	var artist = rows[1].insertCell(1);
	var album = rows[2].insertCell(1);
	var genre = rows[3].insertCell(1);
	var bio = rows[4].insertCell(1);
	var orgin = rows[5].insertCell(1);
	var active = rows[6].insertCell(1);

	song.innerHTML = s.title;
	artist.innerHTML = s.artist;
	album.innerHTML = data.response.track.release;
	var analysis = data.response.track.audio_summary.analysis_url;
	s.analyze(analysis,analyzeinfo);
	s.getSongInfo(s.title, s.artist, extraSongInfo);
	var table = document.getElementById("results_table");
	var rows = table.rows;
	var spotifyid = data.response.track.foreign_id;
	var id = spotifyid.split(":")[2];
	for(var i = 0; i < rows.length; i++){
		if(rows[i].id != id)
			rows[i].className = "normal";
		else
			rows[i].className = 'highlight';
	}
	var playlist = document.getElementById("playlist");
	test = playlist.getElementsByTagName("tr");
	for(var i = 0; i < test.length; i++){
		if(test[i].id != id)
			test[i].className = "normal";
		else
			test[i].className = 'highlight';
	}

	document.getElementById("frameid").src = "https://embed.spotify.com/?uri=" + spotifyid;
}
//am assumging that the first search result will be the one that we are playing
function extraSongInfo(temp, data){
	if (temp) alert('Sorry! I don\'t know what went wrong. Try again. :(');
	
	var artistid = data.response.songs[0].artist_id;
	var songid = data.response.songs[0].id;
	var s = new Song(data.response.songs[0].id,data.response.songs[0].title, data.response.songs[0].artist_name);
	s.getArtistInfo(artistid, artistInfo);
}

function artistInfo(temp, data){
	if (temp) alert('Sorry! I don\'t know what went wrong. Try again. :(');
	
	var table = document.getElementById("infotable");
	var rows = table.rows;
	//all genres, can make only 1
	for(var i = 0; i < data.response.artist.genres.length; i++){
		if(i == data.response.artist.genres.length-1)
			rows[3].cells[1].innerHTML += data.response.artist.genres[i].name;
		else
			rows[3].cells[1].innerHTML += data.response.artist.genres[i].name + ', ';
	}
	//biographies are cut off
	rows[4].cells[1].innerHTML = (function(bios){
		console.log(bios); var full = bios.filter(x => !x.truncated);
		if (full.length) return full[0].text + ' <a href="' +  full[0].url + '">See Original on ' + full[0].site + '. </a>';
		else return bios[0].text  + ' <a href="' + bios[0].url + '">See Original on ' + bios[0].site + '. </a>';
	})(data.response.artist.biographies);
	rows[5].cells[1].innerHTML = data.response.artist.artist_location.location;
	rows[6].cells[1].innerHTML = data.response.artist.years_active[0].start;

}

//this function has all the analysis info to use for the visual part (data has all the information)
//This is commented out in the PrintSongInfo method

function analyzeinfo(temp,data){
	if (temp) alert('Sorry! I don\'t know what went wrong. Try again. :(');
	// console.log(data);

	function pad(number, length) {
   
 	   var str = '' + number;
    	while (str.length < length) {
        	str = '0' + str;
   	 }
   
  	  return str;

	}
	function timeToString(secs) {
		var secs = Math.round(secs);
		var hours = pad(Math.floor(secs / (60 * 60)),2);

    		var divisor_for_minutes = secs % (60 * 60);
    		var minutes = pad(Math.floor(divisor_for_minutes / 60),2);

    		var divisor_for_seconds = divisor_for_minutes % 60;
    		var seconds = pad(Math.ceil(divisor_for_seconds),2);

        	if (hours > 0) return hours + ':' + minutes + ':' + seconds;
		return minutes + ':' + seconds;
	}
	var length = data.sections.map(function(sec){ return sec.duration; })
			.reduce(function(a,b){ return a + b;});
	var sections = data.sections.map(function(sec){
		sec.proportion = sec.duration/length;
		return sec;
	}).map(function(sec){
		sec.fromTo = timeToString(sec.start) + '-' + timeToString(sec.start + sec.duration);  
		return sec;
	});
	loadVisuals(sections);
}

function loadVisuals(data) {
	$('#visual > *').empty();
	var text, tar, id, l, SHRINK_FACTOR = 0.8;
	data.forEach(function(e,index,a){
		html ='This section (' + e.fromTo + ') is ' + confMap(e.key_confidence) +
		' in the key of ' + keyMap[e.key] + '.<br> It is ' +
		confMap(e.mde_confidence) + ' in a ' + modeMap[e.mode] +
		' key.<br> The tempo here is ' + confMap(e.tempo_confidence) + ' ' +
		e.tempo + ' (' + tempoMap(e.tempo) + ').<br> And the time signature is ' +
		confMap(e.time_signature_confidence) + ' ' +
		(e.time_signature > 1 ? e.time_signature + '/4.' : ' complex or changing.');
		$('<div>', {
			'id': 'vizinfo-' + index,
			'html': html
		}).hide().appendTo('#visual #viz-info');

		$('<div>', {
			'width': (100 * e.proportion * SHRINK_FACTOR) + '%',
			'class': 'vizsection',
			'id': 'vs-' + index
		})
		.click(function(ev) {
			tar = ev.currentTarget;
			id = tar.id.split('-')[1];
			l = a.length;
			for (var i = 0; i < l; i++){
				if (i == id) $('#vizinfo-' + id).show();
				else $('#vizinfo-' + i).hide();
			}
		})
		.appendTo('#visual #viz-sects');
	});
}

function savePlaylist(name) {
	var ids = $('#playlist > tr').map(function(i,e){
			return $(e).data('trackid')
		}).get().join('&');
	if (localStorage) localStorage.setItem('sCore_' + name, ids);
	else alert('Sorry, we cannot do that at this time');
}

function loadPlaylist(name) {
	var ids;
	if (localStorage) 
		if(localStorage.getItem('sCore_' + name))
			ids = localStorage.getItem('sCore_' + name).split('&');
		else console.warn('Sorry, something went wrong saving the playlist');
	else alert('Sorry, we cannot do that at this time');

	if (ids) { 
		for(var i = 0; i < ids.length; i++){
			$.ajax({
			url: 'https://api.spotify.com/v1/tracks/'+ids[i],
			success: function(data){
				$("#playlist").append("<tr class='normal' draggable='true' ondragstart='playlistdrag(event)' id = " +
					data.id + " data-trackid=" + data.id + "><td><img src='" +
					data.album.images[2].url + "'></td><td>" + data.name + 
					"<br><font style='font-size:.8em; color: grey'><i>by: " + data.artists[0].name + "</i></font></td></tr>");
				addListenersPlaylist();
			},
			error: function(data){
				 alert('Sorry! I don\'t know what went wrong. Try again. :(');
				console.log(data);
			}
		});
		}

	}
}

// Drag access

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    $('#overlay-solid').css('display', 'inherit');
    $('#overlay-border').css('display', 'inherit');
}

function playlistdrag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
	$('#content-solid').css('display', 'inherit');
    $('#content-border').css('display', 'inherit');
}

function deletedrop(ev){
	ev.preventDefault();
	$('#content-border, #overlay-border').css('display', 'none');
    $('#content-solid, #overlay-solid').css('display', 'none');
	var data = ev.dataTransfer.getData("text");
	var x = document.getElementById(data);
	x.parentNode.removeChild(x);
	savePlaylist('playlist');
}

function drop(ev) {
    ev.preventDefault();
    $('#overlay-border, #content-border').css('display', 'none');
    $('#overlay-solid, #content-solid').css('display', 'none');
    var data = ev.dataTransfer.getData("text");
    var element = document.getElementById(data);
    document.getElementById('playlist').appendChild(element);
    element.ondragstart = function(ev){ev.dataTransfer.setData("text", ev.target.id);};
    var temp = 'playlist';
    savePlaylist(temp);
    // console.log(ev.target);
}

window.addEventListener('load', loadPlaylist('playlist'));
//window.onload(loadPlaylist('playlist'));

// function login() {
//     //var state = generateRandomString(16);
//     //localStorage.setItem(stateKey, state);
//     var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-read-birthdate';
//     var url = 'https://accounts.spotify.com/authorize';
//     url += '?response_type=token';
//     url += '&client_id=' + encodeURIComponent(client_id);
//     url += '&scope=' + encodeURIComponent(scope);
//     url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
//     window.location = url;
// }
