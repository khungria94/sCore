var Mikhail_token = "BQD8Zq9M1GYGD9eLMiS6zMpjhFEJV36YraM6-2VTq8DHKpJEHU7tK1PAZcAtGrhVafXU25ySeiSQ6YbRF0Kw7Grd1qcZ1CK1z-lIEvQGAtwqUz0D2TvSrrdeLh3ma-hvg943ILyOzz1fC4nYqRpcPluN4PeKAnjsr1UTf6KIQej-3TRF9o3f2opEAj2gOh50NnapZ1D69ctT3iqx6wget5DTgIMPC1L0Pv4-lBBFWFvzkzph2-cNXGZ6iJhGz1BiEfuc-qKVkeY977xrnHOb8pkEgu-gSrxjyZvuJdl3A9rl2fo";
var Kenneth_token = "BQAtw6BmPEv_baucW-GY-84l_ZDQ3PLsQ7jDvFLxIZiJoud9sW7ZbowcefQPexpvdTmcEbBD3LMWcGALg4WWWV4eRMTsR51JGOkA5_EN0lRHOBbXeybk76yAQ5FylOE8lUTUaQWMySrHTojP_Ga1T3H5xGq0iG6GIw6HHYI";
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
			'Authorization': 'Bearer ' + Mikhail_token
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
