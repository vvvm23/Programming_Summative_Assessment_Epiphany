const MAP_RES_X = 1920
const MAP_RES_Y = 1080

function modal_error(message) {
    document.getElementById("modal_text").innerHTML = message;
    $(".ui.modal").modal('show');
}

function resize_map() {
    let map_width = window.innerWidth -  parseInt($('#menu_col').css('width'), 10)
    let map_height = window.innerHeight - parseInt($('#intro_row').css('height'), 10) - parseInt($('#title_row').css('height'), 10);
    document.getElementById('map_image').width = map_width;
    document.getElementById('map_image').height = map_height;
}

function hide_stat(stat_id) {
    let element = document.getElementById(stat_id);
    element.style.position = 'absolute';
    element.style.left = '-9999px';
}

function show_stat(stat_id) {
    let element = document.getElementById(stat_id);
    element.style.position = 'relative';
    element.style.left = '0px';
}

$(document).ready(function () {
    const IP = '127.0.0.1';
    const PORT = '8090'

    let a = 0; //maybe rename these
    let b = 0;

    let map_width = 0;
    let map_height = 0;

    $(".accordion").accordion();

    // maybe replace with # rather than class .
    $(".stats").transition({animation: 'fly left',
    duration: 0});
    $(".map").transition({animation: 'fly left',
    duration: 0});
    $(".wiki").transition({animation: 'fly left',
    duration: 0});

    window.onresize = function() {
        resize_map();
    };

    submit_map.addEventListener('click', async function(event) {

        let lat = document.getElementById('attribute_one').value;
        let lon = document.getElementById('attribute_two').value;
        let zoom = document.getElementById('attribute_three').value;
        let t = 0;
        if (document.getElementById('map_type').value == 'satellite') {
            t = 1;
        }

        fetch('http://'+IP+':'+PORT+'/map?lat='+lat+'&t='+t+'&lon='+lon+'&z='+zoom+'&x='+MAP_RES_X+'&y='+MAP_RES_Y)
        .then(function(resp) {
            if (resp.status === 404) {
                modal_error("Error 404: Page not found!");
                throw new Error("404 Error");
            } else {
                return resp;
            }
        })
        .then(resp=>resp.clone().json())
        .then(x=>document.getElementById('map_image').src = x['map_url'])
        .then(resize_map())
        .catch(err=>console.log(err));
    })

    submit_country.addEventListener('click', async function(event) {
        let query_name = document.getElementById('country_name').value;
        let checkbox_binary_string = '';
        // can maybe simplify by looping through a list of the ids  
        let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independance', 'translations',
                       'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain']

        /*checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_region').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_subregion').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_capital').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_currency').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_languages').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_demonym').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_independance').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_translations').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_flag').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_latlng').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_borders').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_landlocked').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_area').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_callingcode').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_domain').checked ? '1':'0');*/
        for (let id = 0; id < id_list.length; id++) {
            let s_id = id_list[id];
            if (!(s_id == 'name')) {
                checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_'+s_id).checked ? '1':'0');
            }
        }

        // Transition off, get results from server, hide and show nessecary, transition back on
        /*$('#stats_name').transition({animation: 'fly left'})
        $('#stats_region').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_region').checked){hide_stat('stats_region');} else {show_stat('stats_region')}}})
        $('#stats_subregion').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_subregion').checked){hide_stat('stats_subregion');} else {show_stat('stats_subregion')}}})
        $('#stats_capital').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_capital').checked){hide_stat('stats_capital');} else {show_stat('stats_capital')}}})
        $('#stats_currency').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_currency').checked){hide_stat('stats_currency');} else {show_stat('stats_currency')}}})
        $('#stats_languages').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_languages').checked){hide_stat('stats_languages');} else {show_stat('stats_languages')}}})
        $('#stats_demonym').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_demonym').checked){hide_stat('stats_demonym');} else {show_stat('stats_demonym')}}})
        $('#stats_independance').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_independance').checked){hide_stat('stats_independance');} else {show_stat('stats_independance')}}})
        $('#stats_translations').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_translations').checked){hide_stat('stats_translations');} else {show_stat('stats_translations')}}})
        $('#stats_flag').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_flag').checked){hide_stat('stats_flag');} else {show_stat('stats_flag')}}})
        $('#stats_latlng').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_latlng').checked){hide_stat('stats_latlng');} else {show_stat('stats_latlng')}}})
        $('#stats_borders').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_borders').checked){hide_stat('stats_borders');} else {show_stat('stats_borders')}}})
        $('#stats_landlocked').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_landlocked').checked){hide_stat('stats_landlocked');} else {show_stat('stats_landlocked')}}})
        $('#stats_area').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_area').checked){hide_stat('stats_area');} else {show_stat('stats_area')}}})
        $('#stats_callingcode').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_callingcode').checked){hide_stat('stats_callingcode');} else {show_stat('stats_callingcode')}}})
        // bit of a dirty fix to only transitioning on stats, may want to recitify this later
        $('#stats_domain').transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_domain').checked){hide_stat('stats_domain');} else {show_stat('stats_domain')} transition_done();}})*/     

        for (let id = 0; id < id_list.length; id++) {
            let s_id = id_list[id];
            if (s_id == 'name') {
                $('#stats_name').transition({animation: 'fly left'});
            }
            else if (s_id == id_list[id_list.length - 1]) {
                console.log(s_id);
                $('#stats_'+s_id).transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_'+s_id).checked){hide_stat('stats_'+s_id);} else {show_stat('stats_'+s_id)} transition_done();}});
            }
            else {
                $('#stats_'+s_id).transition({animation: 'fly left', onHide: function() {if (!document.getElementById('check_'+s_id).checked){hide_stat('stats_'+s_id);} else {show_stat('stats_'+s_id)}}});
            }
        }

        if (a==2 || a==3) {
            transition_done();
        }

        function transition_done() {
            try {
                fetch('http://'+IP+':'+PORT+'/query?name='+query_name+'&check='+checkbox_binary_string)
                .then(function(resp) {
                    if (resp.status === 404) {
                        modal_error("Error 404: Page not found!");
                        throw new Error("404 Error");
                    } else {
                        return resp;
                    }
                })
                .then(resp=> resp.json())
                .then(function(data) {
                    /*document.getElementById('stats_name_inner_common').innerHTML = data['name']['common'];
                    document.getElementById('stats_name_inner_alternate_one').innerHTML = data['name']['official'];
                    
                    let native = data['native_name'];
                    let native_html = '';
                    for (let key in native) {
                        console.log(native[key])
                        native_html = native_html.concat(native[key] + ' • ');
                    }
                    document.getElementById('stats_name_inner_alternate_two').innerHTML = native_html.substring(0, native_html.length - 3)*/
                    
                    for (let id = 0; id < id_list.length; id++) {
                        let s_id = id_list[id];
                        switch(s_id) {
                            case 'name':
                                document.getElementById('stats_name_inner_common').innerHTML = data['name']['common'];
                                document.getElementById('stats_name_inner_alternate_one').innerHTML = data['name']['official'];
                                
                                let native = data['native_name'];
                                let native_html = '';
                                for (let key in native) {
                                    console.log(native[key])
                                    native_html = native_html.concat(native[key] + ' • ');
                                }
                                document.getElementById('stats_name_inner_alternate_two').innerHTML = native_html.substring(0, native_html.length - 3)
                                break;
                            case 'languages':
                                if (document.getElementById('check_languages').checked) {
                                    let language_string = '';
                                    for (let key in data['languages']) {
                                        language_string = language_string.concat(data['languages'][key] + ', ');
                                    } 
                                    document.getElementById('stats_languages_inner').innerHTML = language_string.substring(0, language_string.length - 2);
                                }
                                break;
                            case 'independance':
                                if (document.getElementById('check_independance').checked) {document.getElementById('stats_independance_inner').innerHTML = data['independent'] ? 'Yes':'No';}
                                break;
                            case 'translations':
                                if (document.getElementById('check_translations').checked) {
                                    let translation_string = '';
                                    for (let key in data['translations']) {
                                        translation_string = translation_string.concat(data['translations'][key]['common'] + ', ');
                                    }
                                    document.getElementById('stats_translations_inner').innerHTML = translation_string.substring(0, translation_string.length - 2);
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
                                        document.getElementById('stats_borders_inner').innerHTML = 'No countries bordering selected country.'
                                    }
                                    else {
                                        document.getElementById('stats_borders_inner').innerHTML = borders_string.substring(0, borders_string.length - 2);            
                                    }
                                }
                                break;
                            case 'landlocked':
                                if (document.getElementById('check_landlocked').checked) {document.getElementById('stats_landlocked_inner').innerHTML = data['landlocked'] ? 'Yes':'No';}
                                break;
                            case 'area':
                                if (document.getElementById('check_area').checked) {document.getElementById('stats_area_inner').innerHTML = data['area'] + ' km<sup>2</sup>';}
                                break;
                            case 'callingcode':
                                if (document.getElementById('check_callingcode').checked) {document.getElementById('stats_callingcode_inner').innerHTML = '+' + data['callingCode'];}
                                break;
                            case 'domain':
                                if (document.getElementById('check_domain').checked) {document.getElementById('stats_domain_inner').innerHTML = data['tld'][0];}
                                break;
                            default:
                                if (document.getElementById('check_'+s_id).checked) { document.getElementById('stats_'+s_id+'_inner').innerHTML = data[s_id]; }  
                                break;
                        }
                    }

                    /*if (document.getElementById('check_region').checked) { document.getElementById('stats_region_inner').innerHTML = data['region']; }       
                    if (document.getElementById('check_subregion').checked) {document.getElementById('stats_subregion_inner').innerHTML = data['subregion'];}
                    if (document.getElementById('check_capital').checked) {document.getElementById('stats_capital_inner').innerHTML = data['capital'];}
                    if (document.getElementById('check_currency').checked) {document.getElementById('stats_currency_inner').innerHTML = data['currency'];}
                    if (document.getElementById('check_languages').checked) {
                        let language_string = '';
                        for (let key in data['languages']) {
                            language_string = language_string.concat(data['languages'][key] + ', ');
                        } 
                        document.getElementById('stats_languages_inner').innerHTML = language_string.substring(0, language_string.length - 2);
                    }
                    if (document.getElementById('check_demonym').checked) {document.getElementById('stats_demonym_inner').innerHTML = data['demonym'];}
                    if (document.getElementById('check_independance').checked) {document.getElementById('stats_independance_inner').innerHTML = data['independent'] ? 'Yes':'No';}
                    // maybe have accordion here
                    if (document.getElementById('check_translations').checked) {
                        let translation_string = '';
                        for (let key in data['translations']) {
                            translation_string = translation_string.concat(data['translations'][key]['common'] + ', ');
                        }
                        document.getElementById('stats_translations_inner').innerHTML = translation_string.substring(0, translation_string.length - 2);
                    }
                    if (document.getElementById('check_flag').checked) {document.getElementById('stats_flag_inner').innerHTML = data['flag'];}
                    if (document.getElementById('check_latlng').checked) {document.getElementById('stats_latlng_inner').innerHTML = data['latlng'][0] + ', ' + data['latlng'][1];}
                    if (document.getElementById('check_borders').checked) {
                        let borders_string = '';
                        for (let i = 0; i < data['borders'].length; i++) {
                            borders_string = borders_string.concat(data['borders'][i] + ', ');
                        }
                        if (data['borders'].length == 0) {
                            document.getElementById('stats_borders_inner').innerHTML = 'No countries bordering selected country.'
                        }
                        else {
                            document.getElementById('stats_borders_inner').innerHTML = borders_string.substring(0, borders_string.length - 2);            
                        }
                    }
                    if (document.getElementById('check_landlocked').checked) {document.getElementById('stats_landlocked_inner').innerHTML = data['landlocked'] ? 'Yes':'No';}
                    if (document.getElementById('check_area').checked) {document.getElementById('stats_area_inner').innerHTML = data['area'] + ' km<sup>2</sup>';}
                    if (document.getElementById('check_callingcode').checked) {document.getElementById('stats_callingcode_inner').innerHTML = '+' + data['callingCode'];}
                    if (document.getElementById('check_domain').checked) {document.getElementById('stats_domain_inner').innerHTML = data['tld'][0];}*/
                    
                    document.getElementById('selected_country').innerHTML = 'Selected Country: ' + data['name']['common'];

                    // May want to put wiki in it's own section
                    fetch('http://'+IP+':'+PORT+'/wiki?name='+data['name']['common'])
                    .then(resp => resp.json())
                    .then(resp=> document.getElementById('wiki_inner').innerHTML = resp['wiki'])
                    .then(document.getElementById('wiki_name').innerHTML = data['name']['common']);

                    fetch('http://'+IP+':'+PORT+'/map?lat='+data['latlng'][0]+'&t=0&lon='+data['latlng'][1]+'&z=6&x='+MAP_RES_X+'&y='+MAP_RES_Y)
                    .then(resp=>resp.clone().json())
                    .then(x=>document.getElementById('map_image').src = x['map_url'])
                    .then(resize_map());
                })
                .then(function() {
                    /*$('#stats_name').transition({animation: 'fly left'});
                    $('#stats_region').transition({animation: 'fly left'});
                    $('#stats_subregion').transition({animation: 'fly left'});
                    $('#stats_capital').transition({animation: 'fly left'});
                    $('#stats_currency').transition({animation: 'fly left'});
                    $('#stats_languages').transition({animation: 'fly left'});
                    $('#stats_demonym').transition({animation: 'fly left'});
                    $('#stats_independance').transition({animation: 'fly left'});
                    $('#stats_translations').transition({animation: 'fly left'});
                    $('#stats_flag').transition({animation: 'fly left'});
                    $('#stats_latlng').transition({animation: 'fly left'});
                    $('#stats_borders').transition({animation: 'fly left'});
                    $('#stats_landlocked').transition({animation: 'fly left'});
                    $('#stats_area').transition({animation: 'fly left'});
                    $('#stats_callingcode').transition({animation: 'fly left'});
                    $('#stats_domain').transition({animation: 'fly left'});*/
                    for (let id = 0; id < id_list.length; id++) {
                        $('#stats_'+id_list[id]).transition({animation: 'fly left'});
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    modal_error(err);
                });
            } catch (err) {
                console.log(err);
                modal_error(err);
            }
        }
    });

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
            a = 1
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
            a = 2
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
            a = 3
        }
    };
});