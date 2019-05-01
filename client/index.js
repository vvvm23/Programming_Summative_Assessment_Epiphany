// Set maximum resolution for returned map
// Maybe make this adaptable for screen size..
const MAP_RES_X = window.screen.width;
const MAP_RES_Y = window.screen.height;

// Error handling function that displays a modal
function modal_error(message) {
	document.getElementById('modal_text').innerHTML = message;
	$('.ui.modal').modal('show');
}

// Function to resize map if window changes
function resize_map() {
	let map_width = window.innerWidth -  parseInt($('#menu_col').css('width'), 10);
	let map_height = window.innerHeight - parseInt($('#intro_row').css('height'), 10) - parseInt($('#title_row').css('height'), 10);
	document.getElementById('map_image').width = map_width;
	document.getElementById('map_image').height = map_height;
}

// Hide a given element
function hide_stat(stat_id) {
	let element = document.getElementById(stat_id);
	element.style.position = 'absolute';
	element.style.left = '-9999px';
}

// Show a given element
function show_stat(stat_id) {
	let element = document.getElementById(stat_id);
	element.style.position = 'relative';
	element.style.left = '0px';
}

$(document).ready(function () {
	const HOST = '.'; // Set host to prepend to all urls

	// Set start segment to 0
	let a = 0;
	let b = 0;

	$('.ui.checkbox').checkbox();

	// Transition other segments off screen
	$('.stats').transition({animation: 'fly left',
		duration: 0});
	$('.map').transition({animation: 'fly left',
		duration: 0});
	$('.wiki').transition({animation: 'fly left',
		duration: 0});

	// Add event listener that calls resize of map function
	window.onresize = function() {
		resize_map();
	};

	function toggle_all_check() {
		// Function to toggle all checkboxes
		let id_list = ['region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independance', 'translations',
			'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];

		for (let id = 0; id < id_list.length; id++) {
			let s_id = id_list[id];
			$('#check_'+s_id+'_parent').checkbox('toggle');
		}
	}

	resize_map();
	toggle_all_check(); // toggle all on by default
	toggle_all.addEventListener('click', async function() {
		toggle_all_check();
	});

	window.addEventListener('error', function() { // Throws if failed to fetch map
		modal_error('Failed to fetch Map from external API!');
	}, true);

	// Submit map event listener
	submit_map.addEventListener('click', async function(e) {
		e.preventDefault();

		let lat = document.getElementById('attribute_one').value;
		let lon = document.getElementById('attribute_two').value;
		let zoom = document.getElementById('attribute_three').value;
		let t = 0;
		if (document.getElementById('map_type').value == 'satellite') {
			t = 1;
		}

		// Set GET request to /map with parameters
		fetch(HOST+'/map?lat='+lat+'&t='+t+'&lon='+lon+'&z='+zoom+'&x='+MAP_RES_X+'&y='+MAP_RES_Y,
			{mode: 'no-cors'})
			.then(function(resp) {
				if (resp.status === 404) {
					throw 'Error 404: Page not found!';
				} else if (resp.ok) {
					return resp;
				} else {
					throw resp.statusText;
				}
			})
			.then(resp=>resp.clone().json())
			.then(x=>document.getElementById('map_image').src = x['map_url']) // Set src of img to returned url in order to get map from external API
			.then(resize_map())
			.catch(err => modal_error(err));
	});

	submit_country.addEventListener('click', async function(e) {
		e.preventDefault();
		// Submit country query event listener
		let query_name = document.getElementById('country_name').value;
		let checkbox_binary_string = '';

		let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independance', 'translations',
			'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];

		// Iterate through id list and check checked status. use this to build binary string
		for (let id = 0; id < id_list.length; id++) {
			let s_id = id_list[id];
			if (!(s_id == 'name')) {
				checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_'+s_id).checked ? '1':'0');
			}
		}

		// Make GET request to /query
		fetch(HOST+'/query?name='+query_name+'&check='+checkbox_binary_string,
			{mode: 'no-cors'})
			.then(function(resp) {
				if (resp.status === 404) {
					throw 'Error 404: Page not found!';
				} if (resp.ok) {
					return resp;
				} else {
					throw resp.statusText;
				}
			})
			.then(resp => resp.json())
			.then(function (json) {
				if (a != 0) {
					document.getElementById('selected_country').innerHTML = 'Selected Country: ' + json['name']['common'];
					if (a === 1) {
						stats_ok(json); // if currently on stats segment, jump to stats_ok
					} else {
						transition_done(json); // if not, no need to transition
					}
					wiki_get(json['name']['common']); // Get wiki data
					map_get(json['latlng']); // Get map data
				}
			})
			.catch(err => modal_error(err));

		// Runs if stats retrieved successfully and transition required
		function stats_ok(data) {
			// Transition all stats
			for (let id = 0; id < id_list.length; id++) {
				let s_id = id_list[id];
				if (s_id == 'name') {
					$('#stats_name').transition({animation: 'fly left'});
				}
				else if (s_id == id_list[id_list.length - 1]) { // if last to transition, call transition_done when complete
					$('#stats_'+s_id).transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_'+s_id).checked){hide_stat('stats_'+s_id);} else {show_stat('stats_'+s_id);} transition_done(data);}});
				}
				else {
					$('#stats_'+s_id).transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_'+s_id).checked){hide_stat('stats_'+s_id);} else {show_stat('stats_'+s_id);}}});
				}
			}
		}

		// Calls when transition is done (or not required)
		function transition_done(data) {
			let native, native_html;
			// Iterate through ids and update innerHTML of stats
			for (let id = 0; id < id_list.length; id++) {
				let s_id = id_list[id];
				switch(s_id) {
				case 'name':
					document.getElementById('stats_name_inner_common').innerHTML = data['name']['common'] || 'Not defined';
					document.getElementById('stats_name_inner_alternate_one').innerHTML = data['name']['official'] || 'Not defined';
                        
					native = data['native_name'];
					native_html = '';
					for (let key in native) {
						native_html = native_html.concat(native[key] + ' • ');
					}
					document.getElementById('stats_name_inner_alternate_two').innerHTML = native_html.substring(0, native_html.length - 3);
					break;
				case 'languages':
					if (document.getElementById('check_languages').checked) {
						let language_string = '';
						for (let key in data['languages']) {
							language_string = language_string.concat(data['languages'][key] + ', ');
						}
						if (language_string.substring(0, language_string.length - 2) === '') {
							document.getElementById('stats_languages_inner').innerHTML = 'Not defined';
						} else {
							document.getElementById('stats_languages_inner').innerHTML = language_string.substring(0, language_string.length - 2);
						}
					}
					break;
				case 'independance':
					if (document.getElementById('check_independance').checked) {
						document.getElementById('stats_independance_inner').innerHTML = data['independent'] ? 'Yes':
							(data['independent'] === '' ? 'Not defined':'No');
					}
					break;
				case 'translations':
					if (document.getElementById('check_translations').checked) {
						let translation_string = '';
						for (let key in data['translations']) {
							translation_string = translation_string.concat(data['translations'][key]['common'] + ', ');
						}
						if (translation_string.substring(0, translation_string.length - 2) === '') {
							document.getElementById('stats_translations_inner').innerHTML = 'Not defined';
						} else {
							document.getElementById('stats_translations_inner').innerHTML = translation_string.substring(0, translation_string.length - 2);
						}
					}
					break;
				case 'latlng':
					if (document.getElementById('check_latlng').checked) {document.getElementById('stats_latlng_inner').innerHTML = data['latlng'][0] + ', ' + data['latlng'][1];}
					break;
				case 'borders':
					if (document.getElementById('check_borders').checked) {
						let borders_string = '';
						for (let i = 0; i < data['borders'].length; i++) {
							borders_string = borders_string.concat(data['borders'][i] + ', ');
						}
						if (data['borders'].length == 0) {
							document.getElementById('stats_borders_inner').innerHTML = 'No countries bordering selected country.';
						}
						else {
							document.getElementById('stats_borders_inner').innerHTML = borders_string.substring(0, borders_string.length - 2);            
						}
					}
					break;
				case 'landlocked':
					if (document.getElementById('check_landlocked').checked) {
						document.getElementById('stats_landlocked_inner').innerHTML = data['landlocked'] ? 'Yes':
							(data['landlocked'] === '' ? 'Not defined':'No');
					}
					break;
				case 'area':
					if (document.getElementById('check_area').checked && data['area'] != '') {
						document.getElementById('stats_area_inner').innerHTML = data['area'] + ' km<sup>2</sup>';
					} else {
						document.getElementById('stats_area_inner').innerHTML = 'Not defined';
					}
					break;
				case 'callingcode':
					if (document.getElementById('check_callingcode').checked) {document.getElementById('stats_callingcode_inner').innerHTML = data['callingCode'] || 'Not defined';}
					break;
				case 'domain':
					if (document.getElementById('check_domain').checked) {document.getElementById('stats_domain_inner').innerHTML = data['tld'][0] || 'Not defined';}
					break;
				case 'capital':
					if (document.getElementById('check_capital').checked) {document.getElementById('stats_capital_inner').innerHTML = data['capital'][0] || 'Not defined';}
					break;
				default:
					if (document.getElementById('check_'+s_id).checked) { document.getElementById('stats_'+s_id+'_inner').innerHTML = data[s_id] || 'Not defined'; }  
					break;
				}
			}
			if (a===1) {stats_done();} // if on stats segment, call stats_done
		}


		function stats_done() {
			// Iterate through all stats and transition back in
			for (let id = 0; id < id_list.length; id++) {
				$('#stats_'+id_list[id]).transition({animation: 'fly left'});
			}
		}

		// Function to get wiki data from server
		function wiki_get(name) {
			// Make GET request to /wiki with parameters
			fetch(HOST+'/wiki?name='+name,
				{mode: 'no-cors'})
				.then(function(resp) {
					if (resp.ok) {
						return resp;
					} else {
						throw resp.statusText;
					}
				})
				.then(resp => resp.json())
				.then(resp=> document.getElementById('wiki_inner').innerHTML = resp['wiki']) // Set inner html to response body
				.then(document.getElementById('wiki_name').innerHTML = name) // Update name
				.catch(err => modal_error(err));
		}

		// Function to get map url server
		function map_get(latlng) {
			// Make GET request to /map with parameters
			fetch(HOST+'/map?lat='+latlng[0]+'&t=0&lon='+latlng[1]+'&z=6&x='+MAP_RES_X+'&y='+MAP_RES_Y,
				{mode: 'no-cors'})
				.then(function(resp) {
					if (resp.ok) {
						return resp;
					} else {
						throw resp.statusText;
					}
				})
				.then(resp=>resp.json())
				.then(function(json) {
					try {
						document.getElementById('map_image').src = json['map_url']; // Set src of image to returned url
					} catch (error) {
						throw 'Failed to fetch map image!';
					}
				})
				.then(resize_map()) // Resize map to fit
				.catch(err => modal_error(err));
		}
         
	});

	// Code to transition between segments
	document.getElementById('menu_one').onclick = function() {
		b = 1;
		if (a != b) {
			if (a==0) {
				// Coming from start
				$('.emptymain').transition({animation:'fly left', duration: 1000});
				$('.stats').transition({animation:'fly left', duration: 1000});
			} else if (a==1) {
				// Coming from stats
				// pass
			} else if (a==2) {
				// Coming from map
				$('.map').transition({animation:'fly left', duration: 1000});
				$('.stats').transition({animation:'fly left', duration: 1000});
			} else if (a==3) {
				// Coming from wikipedia
				$('.wiki').transition({animation:'fly left', duration: 1000});
				$('.stats').transition({animation:'fly left', duration: 1000});
			}
			a = 1;
		}
	};
    
	document.getElementById('menu_two').onclick = function() {
		b = 2;
		if (a != b) {
			if (a==0) {
				// Coming from start
				$('.emptymain').transition('fly left');
				$('.map').transition('fly left');
			} else if (a==1) {
				// Coming from stats
				$('.stats').transition('fly left');
				$('.map').transition('fly left');
			} else if (a==2) {
				// Coming from map
				// pass
			} else if (a==3) {
				// Coming from wikipedia
				$('.wiki').transition('fly left');
				$('.map').transition('fly left');
			}
			a = 2;
		}
	};
    
	document.getElementById('menu_three').onclick = function() {
		b = 3;
		if (a != b) {
			if (a==0) {
				// Coming from start
				$('.emptymain').transition('fly left');
				$('.wiki').transition('fly left');
			} else if (a==1) {
				// Coming from stats
				$('.stats').transition('fly left');
				$('.wiki').transition('fly left');
			} else if (a==2) {
				// Coming from map
				$('.map').transition('fly left');
				$('.wiki').transition('fly left');
			} else if (a==3) {
				// Coming from wikipedia
				// pass
			}
			a = 3;
		}
	};
});