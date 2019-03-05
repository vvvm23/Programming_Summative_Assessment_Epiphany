//var a = 0;
//var b = 0;

function modal_error(message) {
    document.getElementById("modal_text").innerHTML = message;
    $(".ui.modal").modal('show');
}

$(document).ready(function () {
    let a = 0; //maybe rename these
    let b = 0;

    $(".accordion").accordion();

    $(".stats").transition({animation: 'fly left',
    duration: 0});
    $(".map").transition({animation: 'fly left',
    duration: 0});
    $(".wiki").transition({animation: 'fly left',
    duration: 0});

    //let map_width = document.getElementById('map_column').offsetWidth;
    //let map_height = document.getElementById('map_column').offsetHeight;

    let map_width = document.getElementById('map_column').offsetWidth;
    let map_height = document.getElementById('map_column').offsetHeight;    
    console.log(map_width + ":" + map_height)
    document.getElementById('map_image').src = "https://image.maps.api.here.com/mia/1.6/mapview?app_id=RUw2eiQLvRoOmpWww3e7&app_code=Jd2W3CtG6MJl0OL-LBoLAg&lat=0.0&lon=0.0&z=3&w="+map_width+"&h="+map_height;
    /*accordion_close.addEventListener('click', function () {
        console.log('accordion clicked');
        $(".accordion").transition({animation: 'fly left',
                                    duration: 1000});
        $(".accordion_divider").transition({animation: 'fly left',
                                            duration: 1000});
    });*/

    submit_button.addEventListener('click', async function(event) {
        $('.ui.accordion .individual').each(function(i){
            $(this).parent().accordion('open',i);
        });
        document.getElementById('map_image').src = "https://image.maps.api.here.com/mia/1.6/mapview?app_id=RUw2eiQLvRoOmpWww3e7&app_code=Jd2W3CtG6MJl0OL-LBoLAg&lat=15.5007&lon=32.5599&z=5&w="+map_width+"&h="+map_height;

        let resp;
        resp = await fetch('http://127.0.0.1:8090/invalid_page.html');
        let status = resp.status
        if (status !== 404) {

        } else {
            modal_error("Error 404: Page not found!");
        }
    })

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