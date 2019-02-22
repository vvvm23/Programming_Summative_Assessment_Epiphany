
$(document).ready(function() {
    $(".fullmain").transition({animation: 'fly left',
                                duration: 0});
});

$(document).ready(function () {
    $(".accordion").accordion();
});

document.onkeypress = function() {
    $(".emptymain").transition('fly left');
    $(".fullmain").transition('fly left');
    document.getElementById("empty").style = "position: absolute";
    document.getElementById("full").style = "position: absolute";
};