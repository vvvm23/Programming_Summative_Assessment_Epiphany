//var a = 0;
//var b = 0;


function modal_error(message) {
    document.getElementById("modal_text").innerHTML = message;
    $(".ui.modal").modal('show');
}


$(document).ready(function () {
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

    map_width = Math.floor(document.getElementById('map_column').offsetWidth * 0.97);
    map_height = Math.floor(document.getElementById('map_column').offsetHeight * 0.97);    
    console.log(map_width + ":" + map_height)

    window.onresize = async function() {
        map_width = Math.floor(document.getElementById('map_column').offsetWidth * 0.97);
        map_height = Math.floor(document.getElementById('map_column').offsetHeight * 0.97);    
        console.log(map_width + ":" + map_height)

        // This point on maybe
        // Probably not best to have this here
        let lat = document.getElementById('attribute_one').value;
        let lon = document.getElementById('attribute_two').value;
        let zoom = document.getElementById('attribute_three').value;

        fetch('http://127.0.0.1:8090/map?lat='+lat+'&t=1&lon='+lon+'&z='+zoom+'&x='+map_width+'&y='+map_height)
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
        .catch(err=>console.log(err));
    }  

    document.getElementById('map_image').src = "https://image.maps.api.here.com/mia/1.6/mapview?app_id=RUw2eiQLvRoOmpWww3e7&app_code=Jd2W3CtG6MJl0OL-LBoLAg&lat=0.0&lon=0.0&z=3&w="+map_width+"&h="+map_height;

    submit_map.addEventListener('click', async function(event) {

        let lat = document.getElementById('attribute_one').value;
        let lon = document.getElementById('attribute_two').value;
        let zoom = document.getElementById('attribute_three').value;
        let t = 0;
        if (document.getElementById('map_type').value == 'satellite') {
            t = 1;
        }

        fetch('http://127.0.0.1:8090/map?lat='+lat+'&t='+t+'&lon='+lon+'&z='+zoom+'&x='+map_width+'&y='+map_height)
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
        .catch(err=>console.log(err));
    })

    submit_country.addEventListener('click', async function(event) {
        let checkboxes = {
            region: document.getElementById('check_region').value,
            subregion: document.getElementById('check_subregion').value,
            capital: document.getElementById('check_capital').value,
            currency: document.getElementById('check_currency').value,
            languages: document.getElementById('check_languages').value,
            citizen: document.getElementById('check_citizen').value,
            independance: document.getElementById('check_independance').value,
            translations: document.getElementById('check_translations').value,
            flag: document.getElementById('check_flag').value,
            latlng: document.getElementById('check_latlng').value,
            borders: document.getElementById('check_borders').value,
            landlocked: document.getElementById('check_landlocked').value,
            area: document.getElementById('check_area').value,
            calling_code: document.getElementById('check_callingcode').value,
            domain: document.getElementById('check_domain').value
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