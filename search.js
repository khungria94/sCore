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
				$(".results_display").append("<tr class='normal' draggable='true' ondragstart='drag(event)' id = " +
					item.id + " data-trackid=" + item.id + "><td>" + item.name + "</td></tr>");
			}
			addListeners();
		},
		error: function(data){
			console.log(data);
		}
	});
}

function addListeners(){
	var table = document.getElementById("results_table");
	var rows = table.rows;
	for(var i = 0; i < rows.length; i++){
		rows[i].addEventListener("dblclick", printSongInfo);
	}
}

function printSongInfo(){
	var s = new Song(this.id);
	s.getTrackInfo(this.id);
	//console.log(s.title + " by " + s.artist);
	var table = document.getElementById("infotable");
	var rows = table.rows;
	for(var i = 0; i < rows.length; i++){
		var x = rows[i].insertCell(1);
		x.innerHTML = s.artist;
	}
	if(this.className == 'normal')
		this.className = 'highlight';
	else
		this.className = 'normal';
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

function drop(ev) {
    ev.preventDefault();
    $('#overlay-border').css('display', 'none');
    $('#overlay-solid').css('display', 'none');
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}




