// Function that displays error message in modal screen //
function modal_error(message) {
	document.getElementById('modal_text').innerHTML = message;
	$('.ui.modal').modal('show');
}

$(document).ready(function() {
	const HOST = '.'; // Host header prepended to urls

	// transition off add and delete segments
	$('.add').transition({animation: 'fly left', duration: 0});
	$('.delete').transition({animation: 'fly left', duration: 0});

	// Hide confirmation labels
	$('#delete_confirm_label').transition({animation:'zoom', duration: 0});
	$('#edit_confirm_label').transition({animation:'zoom', duration: 0});
	$('#add_confirm_label').transition({animation:'zoom', duration: 0});

	// Run startup code for semantic dropdowns
	$('#add_independent_dropdown').dropdown();
	$('#add_landlocked_dropdown').dropdown();
	$('#edit_independent_dropdown').dropdown();
	$('#edit_landlocked_dropdown').dropdown();
	
	// Set current transition segment and target segment
	let a = 2;
	let b = 2;

	// Set starting index to -1 (no target)
	let delete_index = -1;
	let edit_index = -1;

	// Confirm add entry listener
	add_confirm.addEventListener('click', async function() {
		let update = {};
		let id_list = ['name_common', 'name_official', 'name_native', 'region', 'subregion',
			'capital', 'currency', 'languages', 'demonym', 'independent', 'translations',
			'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];

		// Iterate through id list and create update json, selecting special operations for special cases
		for (let id = 0; id < id_list.length; id++) {
			let s_id = id_list[id];
			switch(s_id) {
			case 'currency':                
				update['currency'] = document.getElementById('add_currency').value.replace(/\s/g, '').split(',');
				break;
			case 'languages':
				update['languages'] = document.getElementById('add_languages').value.replace(/\s/g, '').split(',');
				break;
			case 'independent':
				update['independent'] = $('#add_independent_dropdown').dropdown('get value');
				break;
			case 'translations':
				update['translations'] = document.getElementById('add_translations').value.replace(/\s/g, '').split(',');
				break;
			case 'latlng':
				update['latlng'] = document.getElementById('add_latlng').value.replace(/\s/g, '').split(',');
				break;
			case 'borders':
				update['borders'] = document.getElementById('add_borders').value.replace(/\s/g, '').split(',');
				break;
			case 'landlocked':
				update['landlocked'] = $('#add_landlocked_dropdown').dropdown('get value');
				break;
			default:
				update[s_id] = document.getElementById('add_'+s_id).value;
				break;
			}
		}

		// Send json to /add endpoint
		fetch(HOST+'/add', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(update)
		})
			.then(function(res) {
				if (res.ok) { // is response okay, continue
					return res;
				} else {
					throw res.statusText;
				}
			})
			.then(res => res.json())
			.then(function (json) {
				// Update labels, transition and clear input boxes
				document.getElementById('add_confirm_label_inner').innerHTML = json['name'];
				$('#add_confirm_label').transition('zoom');
				$('#add_confirm_label').transition({animation:'zoom', interval: 2000});
				clear_input('add');
			})
			.catch(err => modal_error(err)); // error catcher, simply calls modal_error
	});

	// Search for country to delete listener
	delete_search_button.addEventListener('click', async function() {
		let query_name = document.getElementById('delete_search').value;
		fetch(HOST+'/search/delete?name='+query_name) // Make GET request to /search/delete with query name
			.then(function(res) {
				if (res.ok) {
					return res;
				} else {
					throw res.statusText;
				}
			})
			.then(res => res.json())
			.then(function(json) {
				delete_index = json['index']; // Set delete index
				document.getElementById('delete_selected').innerHTML = json['name']; // Update label
			})
			.catch(err => modal_error(err));
	});

	// Delete confirmation listener
	delete_confirm.addEventListener('click', async function() {
		// Send post request where body is index to delete
		fetch(HOST+'/delete', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'index': delete_index})
		})
			.then(function(res) {
				if (res.ok) {
					return res;
				} else {
					throw res.statusText;
				}
			})
			.then(res => res.json())
			.then(function(json) {
				delete_index = -1; // Reset delete index
				// Update labels, transition
				document.getElementById('delete_selected').innerHTML = 'None';
				document.getElementById('delete_search').value = '';
				document.getElementById('delete_confirm_label_inner').innerHTML = json['name'];
				$('#delete_confirm_label').transition('zoom');
				$('#delete_confirm_label').transition({animation:'zoom', interval: 2000, onHide: function() {
					document.getElementById('delete_confirm_label_inner').innerHTML = '';
				}});
			})
			.catch(err => modal_error(err));
	});

	// Search for country to edit listener
	edit_search_button.addEventListener('click', async function() {
		let query_name = document.getElementById('edit_search').value;
		// Send GET to /search/edit with query name
		fetch(HOST+'/search/edit?name='+query_name)
			.then(function(res) {
				if (res.ok) {
					return res;
				} else {
					throw res.statusText;
				}
			})
			.then(res => res.json())
			// Format response and place in input boxes
			.then(function(data) {
				let native, native_html, language_string, translation_string, borders_string;
				edit_index = data['index'];
				let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independance', 'translations',
					'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];
				for (let id = 0; id < id_list.length; id++) {
					let s_id = id_list[id];
					switch(s_id) {
					case 'name':
						document.getElementById('edit_name_common').value = data['name']['common'];
						document.getElementById('edit_name_official').value = data['name']['official'];
                        
						native = data['native_name'];
						native_html = '';
						for (let key in native) {
							native_html = native_html.concat(native[key] + ', ');
						}
						document.getElementById('edit_name_native').value = native_html.substring(0, native_html.length - 2);
						break;
					case 'languages':
						language_string = '';
						for (let key in data['languages']) {
							language_string = language_string.concat(data['languages'][key] + ', ');
						} 
						document.getElementById('edit_languages').value = language_string.substring(0, language_string.length - 2);
						break;
					case 'independance':
						//document.getElementById('edit_independent').index = data['independent'] ? true:false;
						data['independent'] ? $('#edit_independent_dropdown').dropdown('set selected', 'true'):
							(data['independent'] === '' ? 
								$('#edit_independent_dropdown').dropdown('set selected', 'unknown'):
								$('#edit_independent_dropdown').dropdown('set selected', 'false'));
						break;
					case 'translations':
						translation_string = '';
						for (let key in data['translations']) {
							translation_string = translation_string.concat(data['translations'][key]['common'] + ', ');
						}
						document.getElementById('edit_translations').value = translation_string.substring(0, translation_string.length - 2);
						break;
					case 'latlng':
						document.getElementById('edit_latlng').value = data['latlng'][0] + ', ' + data['latlng'][1];
						break;
					case 'borders':
						borders_string = '';
						for (let i = 0; i < data['borders'].length; i++) {
							borders_string = borders_string.concat(data['borders'][i] + ', ');
						}
						document.getElementById('edit_borders').value = borders_string.substring(0, borders_string.length - 2);
						break;
					case 'landlocked':
						//document.getElementById('edit_landlocked').value = data['landlocked'] ? true:false;
						data['landlocked'] ? $('#edit_landlocked_dropdown').dropdown('set selected', 'true'):
							(data['landlocked'] === '' ? $('#edit_landlocked_dropdown').dropdown('set selected', 'unknown'):
								$('#edit_landlocked_dropdown').dropdown('set selected', 'false'));
						break;
					case 'callingcode':
						document.getElementById('edit_callingcode').value = data['callingCode'];
						break;
					case 'domain':
						document.getElementById('edit_domain').value = data['tld'][0];
						break;
					default:
						document.getElementById('edit_'+s_id).value = data[s_id]; 
						break;
					}
				}
			})
			.catch(err => modal_error(err));
	});

	// Edit confirm listener
	edit_confirm.addEventListener('click', async function() {
		// Make POST with all statistics, delimit some by comma into arrays
		let update = {};
		let id_list = ['index', 'name_common', 'name_official', 'name_native', 'region', 'subregion',
			'capital', 'currency', 'languages', 'demonym', 'independent', 'translations',
			'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];

		// Iterate through ID list, build update json and handle special cases
		for (let id = 0; id < id_list.length; id++) {
			let s_id = id_list[id];
			switch(s_id) {
			case 'index':
				update['index'] = edit_index;
				break;
			case 'currency':                
				update['currency'] = document.getElementById('edit_currency').value.replace(/\s/g, '').split(',');
				break;
			case 'languages':
				update['languages'] = document.getElementById('edit_languages').value.replace(/\s/g, '').split(',');
				break;
			case 'independent':
				update['independent'] = $('#edit_independent_dropdown').dropdown('get value');
				if (update['independent'] === 'unknown') {
					update['independent'] = '';
				}
				break;
			case 'translations':
				update['translations'] = document.getElementById('edit_translations').value.replace(/\s/g, '').split(',');
				break;
			case 'latlng':
				update['latlng'] = document.getElementById('edit_latlng').value.replace(/\s/g, '').split(',');
				break;
			case 'borders':
				update['borders'] = document.getElementById('edit_borders').value.replace(/\s/g, '').split(',');
				break;
			case 'landlocked':
				update['landlocked'] = $('#edit_landlocked_dropdown').dropdown('get value');
				if (update['landlocked'] === 'unknown') {
					update['landlocked'] = '';
				}
				break;
			default:
				update[s_id] = document.getElementById('edit_'+s_id).value;
				break;
			}
		}


		// Send POSt request to /edit with update body
		fetch(HOST+'/edit', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(update)
		})
			.then(function(res) {
				if (res.ok) {
					// reset edit index
					edit_index = -1;
					document.getElementById('edit_search').value = ''; 
					return res;
				} else {
					throw res.statusText;
				}
			})
			.then(res => res.json())
			.then(function (json) {
				// Update labels, transition and clear inputs
				document.getElementById('edit_confirm_label_inner').innerHTML = json['name'];
				$('#edit_confirm_label').transition('zoom');
				$('#edit_confirm_label').transition({animation:'zoom', interval: 2000});
				clear_input('edit');
			})
			.catch(err => modal_error(err));

	});

	// Code for segment transitions
	document.getElementById('menu_one').onclick = function() {
		b = 1;
		if (a != b) {
			if (a==1) {
				// Coming from add
				// pass
			} else if (a==2) {
				// Coming from edit
				$('.edit').transition({animation:'fly left', duration: 1000});
				$('.add').transition({animation:'fly left', duration: 1000});
			} else if (a==3) {
				// Coming from delete
				$('.delete').transition({animation:'fly left', duration: 1000});
				$('.add').transition({animation:'fly left', duration: 1000});
			}
			a = 1;
		}
	};
    
	document.getElementById('menu_two').onclick = function() {
		b = 2;
		if (a != b) {
			if (a==1) {
				// Coming from add
				$('.add').transition('fly left');
				$('.edit').transition('fly left');
			} else if (a==2) {
				// Coming from edit
				// pass
			} else if (a==3) {
				// Coming from delete
				$('.delete').transition('fly left');
				$('.edit').transition('fly left');
			}
			a = 2;
		}
	};
    
	document.getElementById('menu_three').onclick = function() {
		b = 3;
		if (a != b) {
			if (a==1) {
				// Coming from add
				$('.add').transition('fly left');
				$('.delete').transition('fly left');
			} else if (a==2) {
				// Coming from edit
				$('.edit').transition('fly left');
				$('.delete').transition('fly left');
			} else if (a==3) {
				// Coming from delete
				// pass
			}
			a = 3;
		}
	};

	// Function to clear all input boxes from a given type
	function clear_input(type) {
		let id_list = ['name_common', 'name_official', 'name_native', 'region', 'subregion', 'capital',
			'currency', 'languages', 'demonym', 'independent', 'translations',
			'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];

		for (let id = 0; id < id_list.length; id++) {
			let s_id = id_list[id];
			document.getElementById(type+'_'+s_id).value = '';
		}
	}
});