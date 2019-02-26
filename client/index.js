var a = 0;
var b = 0;

$(document).ready(function() {
    $(".stats").transition({animation: 'fly left',
    duration: 0});
    $(".map").transition({animation: 'fly left',
    duration: 0});
    $(".wiki").transition({animation: 'fly left',
    duration: 0});
});

$(document).ready(function () {
    $(".accordion").accordion();
    submit_button.addEventListener('click', async function(event) {
        let resp;
        resp = await fetch('http://127.0.0.1:8090/invalid_page.html');
        console.log(await resp.status);
        let code = await resp.text();
        console.log(code);
        if (resp.status !== 404) {

        } else {
            eval(code);
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

