$(document).ready(function () {
    $(".accordion").accordion();
});

document.onkeypress = function() {
    $(".emptymain").transition('fly left');
};
