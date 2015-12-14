var token = "BQB2zEnsRSkdSAXGQlgl1kph80tZ2Xb60CtkbVokMdfsI8eqFv0aHF2Lpwthd-2E";
var KennethToken = "BQAtw6BmPEv_baucW-GY-84l_ZDQ3PLsQ7jDvFLxIZiJoud9sW7ZbowcefQPexpvdTmcEbBD3LMWcGALg4WWWV4eRMTsR51JGOkA5_EN0lRHOBbXeybk76yAQ5FylOE8lUTUaQWMySrHTojP_Ga1T3H5xGq0iG6GIw6HHYI";
var client_id = "9ed7472797b146d1bc5cfaa17f19a6bf";
var client_secret = "695b5b3e9db24f23bd71fcb8c2f85e8c";
var redirect_uri = "http://localhost"
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

	$.ajax({
		url: 'https://api.spotify.com/v1/me',
		headers: {
			'Authorization': 'Bearer ' + KennethToken
		},
		success: function(data) {
			console.log(data.birthdate);
		}
	});

}

function hide() {
	$('#results').slideUp(); 
	$('#playlist').animate({height: '95%'});
}
