function modal_error(message) {
    document.getElementById("modal_text").innerHTML = message;
    $(".ui.modal").modal('show');
}

$(document).ready(function() {
    const IP = '127.0.0.1';
    const PORT = '8090'

    $('.add').transition({animation: 'fly left', duration: 0});
    $('.delete').transition({animation: 'fly left', duration: 0});
    $('#delete_confirm_label').transition('zoom');

    $('#add_independent_dropdown').dropdown();
    $('#add_landlocked_dropdown').dropdown();
    $('#edit_independent_dropdown').dropdown();
    $('#edit_landlocked_dropdown').dropdown();
    
    a = 2;
    b = 2;

    let delete_index = -1;
    let edit_index = -1;

    add_confirm.addEventListener('click', async function(event) {
        let update = {}
        let id_list = ['name_common', 'name_official', 'name_native', 'region', 'subregion',
                       'capital', 'currency', 'languages', 'demonym', 'independent', 'translations',
                       'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain']

        for (let id = 0; id < id_list.length; id++) {
            let s_id = id_list[id];
            switch(s_id) {
                case 'index':
                    update['index'] = edit_index;
                    break;
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
                    update[s_id] = document.getElementById('add_'+s_id).value
                    break;
            }
        }

        console.log(update);

        fetch('http://'+IP+':'+PORT+'/add', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update)
        })
        .then(function(res) {
            if (res.ok) {
                edit_index = -1;
            } else {
                modal_error(res.statusText);
            }
        })
    })

    delete_search_button.addEventListener('click', async function(event) {
        let query_name = document.getElementById('delete_search').value;
        fetch('http://'+IP + ':' + PORT+'/search/delete?name='+query_name)
        .then(res => res.json())
        .then(function(json) {
            delete_index = json['index'];
            document.getElementById('delete_selected').innerHTML = json['name'];
            document.getElementById('delete_confirm_label_inner').innerHTML = json['name'];
        })
        .catch(err => modal_error(err));
    });

    delete_confirm.addEventListener('click', async function(event) {
        fetch('http://'+IP+':'+PORT+'/delete', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'index': delete_index})
        })
        .then(function(res) {
            if (res.ok) {
                delete_index = -1;
                document.getElementById('delete_selected').innerHTML = 'None';
                document.getElementById('delete_search').value = '';
                $('#delete_confirm_label').transition('zoom');
                $('#delete_confirm_label').transition({animation:'zoom', interval: 2000});
            } else {
                modal_error(res);
            }
        })
    });

    edit_search_button.addEventListener('click', async function(event) {
        // Fetch from search/edit
        // format response in input boxes
        let query_name = document.getElementById('edit_search').value;
        fetch('http://'+IP+':'+PORT+'/search/edit?name='+query_name)
        .then(res => res.json())
        .then(function(data) {
            edit_index = data['index'];
            let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independance', 'translations',
                           'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain']
            for (let id = 0; id < id_list.length; id++) {
                let s_id = id_list[id];
                switch(s_id) {
                    case 'name':
                        document.getElementById('edit_name_common').value = data['name']['common'];
                        document.getElementById('edit_name_official').value = data['name']['official'];
                        
                        let native = data['native_name'];
                        let native_html = '';
                        for (let key in native) {
                            native_html = native_html.concat(native[key] + ', ');
                        }
                        document.getElementById('edit_name_native').value = native_html.substring(0, native_html.length - 2)
                        break;
                    case 'languages':
                        let language_string = '';
                        for (let key in data['languages']) {
                            language_string = language_string.concat(data['languages'][key] + ', ');
                        } 
                        document.getElementById('edit_languages').value = language_string.substring(0, language_string.length - 2);
                        break;
                    case 'independance':
                        //document.getElementById('edit_independent').index = data['independent'] ? true:false;
                        data['independent'] ? $('#edit_independent_dropdown').dropdown('set selected', 'true'):
                                              $('#edit_independent_dropdown').dropdown('set selected', 'false')
                        break;
                    case 'translations':
                        let translation_string = '';
                        for (let key in data['translations']) {
                            translation_string = translation_string.concat(data['translations'][key]['common'] + ', ');
                        }
                        document.getElementById('edit_translations').value = translation_string.substring(0, translation_string.length - 2);
                        break;
                    case 'latlng':
                        document.getElementById('edit_latlng').value = data['latlng'][0] + ', ' + data['latlng'][1];
                        break;
                    case 'borders':
                        let borders_string = '';
                        for (let i = 0; i < data['borders'].length; i++) {
                            borders_string = borders_string.concat(data['borders'][i] + ', ');
                        }
                        document.getElementById('edit_borders').value = borders_string.substring(0, borders_string.length - 2);
                        break;
                    case 'landlocked':
                        //document.getElementById('edit_landlocked').value = data['landlocked'] ? true:false;
                        data['landlocked'] ? $('#edit_landlocked_dropdown').dropdown('set selected', 'true'):
                                              $('#edit_landlocked_dropdown').dropdown('set selected', 'false')
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
    });

    edit_confirm.addEventListener('click', async function() {
        // Make POST with all statistics, delimit some by comma into arrays
        let update = {}
        let id_list = ['index', 'name_common', 'name_official', 'name_native', 'region', 'subregion',
                       'capital', 'currency', 'languages', 'demonym', 'independent', 'translations',
                       'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain']

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
                    break;
                default:
                    update[s_id] = document.getElementById('edit_'+s_id).value
                    break;
            }
        }

        console.log(update);

        fetch('http://'+IP+':'+PORT+'/edit', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(update)
        })
        .then(function(res) {
            if (res.ok) {
                edit_index = -1;
            } else {
                modal_error(res);
            }
        })

    })

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
            a = 1
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
            a = 2
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
            a = 3
        }
    };
})