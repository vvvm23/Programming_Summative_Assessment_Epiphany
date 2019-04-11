function modal_error(message) {
    document.getElementById("modal_text").innerHTML = message;
    $(".ui.modal").modal('show');
}

function resize_map() {
    let map_width = window.innerWidth -  parseInt($('#menu_col').css('width'), 10)
    let map_height = window.innerHeight - parseInt($('#intro_row').css('height'), 10) - parseInt($('#title_row').css('height'), 10);
    document.getElementById('map_image').width = map_width;
    document.getElementById('map_image').height = map_height;
    /*console.log('Window width: ' + window.innerWidth);
    console.log('Window height: ' + window.innerHeight);
    console.log('Width subtract: ' + $('#menu_col').css('width'));
    console.log('Height subtract: ' + $('#intro_row').css('height') + ' : ' + $('#title_row').css('height'));
    console.log(map_width + ' : ' + map_height);*/
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

    const MAP_RES_X = 1920
    const MAP_RES_Y = 1080

    $(".accordion").accordion();

    // maybe replace with # rather than class .
    $(".stats").transition({animation: 'fly left',
    duration: 0});
    $(".map").transition({animation: 'fly left',
    duration: 0});
    $(".wiki").transition({animation: 'fly left',
    duration: 0});

    /*map_width = Math.floor(document.getElementById('map_column').offsetWidth * 0.97);
    map_height = Math.floor(document.getElementById('map_column').offsetHeight * 0.97);    
    console.log(map_width + ":" + map_height)*/

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
        // check if we are allowed to send over json rather than restricted to just url
        /*let checkbox = {
            region : document.getElementById('check_region').checked,
            subregion : document.getElementById('check_subregion').checked ,
            capital : document.getElementById('check_capital').checked ,
            currency : document.getElementById('check_currency').checked,
            languages : document.getElementById('check_languages').checked,
            citizen : document.getElementById('check_citizen').checked ,
            independence : document.getElementById('check_independence').checked,
            translations : document.getElementById('check_translations').checked,
            flag : document.getElementById('check_flag').checked,
            latlng : document.getElementById('check_latlng').checked,
            borders : document.getElementById('check_borders').checked,
            landlocked : document.getElementById('check_landlocked').checked ,
            area : document.getElementById('check_area').checked ,
            callingcode : document.getElementById('check_callingcode').checked ,
            domain : document.getElementById('check_domain').checked
        };*/
        let query_name = document.getElementById('country_name').value;

        let checkbox_binary_string = '';
        // can maybe simplify by looping through a list of the ids  
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_region').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_subregion').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_capital').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_currency').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_languages').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_citizen').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_independence').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_translations').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_flag').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_latlng').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_borders').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_landlocked').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_area').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_callingcode').checked ? '1':'0');
        checkbox_binary_string = checkbox_binary_string.concat(document.getElementById('check_domain').checked ? '1':'0');  

        hide_stat('stats_name');
        $('#stats_name').transition({animation: 'fly left'})
        $('#stats_region').transition({animation: 'fly left'})
        $('#stats_subregion').transition({animation: 'fly left'})
        $('#stats_capital').transition({animation: 'fly left'})
        $('#stats_currency').transition({animation: 'fly left'})
        $('#stats_languages').transition({animation: 'fly left'})
        $('#stats_denonym').transition({animation: 'fly left'})
        $('#stats_independance').transition({animation: 'fly left'})
        $('#stats_translations').transition({animation: 'fly left'})
        $('#stats_flag').transition({animation: 'fly left'})
        $('#stats_latlng').transition({animation: 'fly left'})
        $('#stats_borders').transition({animation: 'fly left'})
        $('#stats_landlocked').transition({animation: 'fly left'})
        $('#stats_area').transition({animation: 'fly left'})
        $('#stats_callingcode').transition({animation: 'fly left'})
        $('#stats_domain').transition({animation: 'fly left'})        


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
            .then(data => console.log(data))
            .catch(function(err) {
                console.log(err);
                modal_error(err);
            });
        } catch (err) {
            console.log(err);
            modal_error(err);
        }
        show_stat('stats_name');
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