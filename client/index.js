function modal_error(message) {
    document.getElementById("modal_text").innerHTML = message;
    $(".ui.modal").modal('show');
}

function resize_map() {
    let map_width = window.width - document.getElementById('menu_col').width
    let map_height = window.height - document.getElementById('intro_row').height - document.getElementById('title_row').height;
    console.log(map_width + ' : ' + map_height);
    document.getElementById('map_image').width = map_width;
    document.getElementById('map_image').height = map_height;
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

    $(".stats").transition({animation: 'fly left',
    duration: 0});
    $(".map").transition({animation: 'fly left',
    duration: 0});
    $(".wiki").transition({animation: 'fly left',
    duration: 0});

    /*map_width = Math.floor(document.getElementById('map_column').offsetWidth * 0.97);
    map_height = Math.floor(document.getElementById('map_column').offsetHeight * 0.97);    
    console.log(map_width + ":" + map_height)*/

    window.onresize = resize_map();

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
        let checkbox_encoded = '';
        let checkbox = {
            region : document.getElementById('check_region').checked,
            subregion : document.getElementById('check_subregion').checked ,
            capital : document.getElementById('check_capital').checked ,
            currency : document.getElementById('check_currency').checked,
            languages : document.getElementById('check_languages').checked,
            citizen : document.getElementById('check_citizen').checked ,
            independance : document.getElementById('check_independance').checked,
            translations : document.getElementById('check_translations').checked,
            flag : document.getElementById('check_flag').checked,
            latlng : document.getElementById('check_latlng').checked,
            borders : document.getElementById('check_borders').checked,
            landlocked : document.getElementById('check_landlocked').checked ,
            area : document.getElementById('check_area').checked ,
            callingcode : document.getElementById('check_callingcode').checked ,
            domain : document.getElementById('check_domain').checked
        };
        let query_name = document.getElementById('country_name').value;

        fetch('http://'+IP+':'+PORT+'/query?name='+query_name, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkbox)
        })
        .then(function(resp) {
            if (resp.status === 404) {
                modal_error("Error 404: Page not found!");
                throw new Error("404 Error");
            } else {
                return resp;
            }
        })
        .then(resp => resp.json())
        .then(r_json => console.log(r_json))
        .catch(err => console.log(err));
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