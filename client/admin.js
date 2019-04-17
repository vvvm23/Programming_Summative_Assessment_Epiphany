$(document).ready(function() {
    $('.add').transition({animation: 'fly left', duration: 0});
    $('.delete').transition({animation: 'fly left', duration: 0});

    $('#add_independent_dropdown').dropdown();
    $('#add_landlocked_dropdown').dropdown();
    $('#edit_independent_dropdown').dropdown();
    $('#edit_landlocked_dropdown').dropdown();
    
    a = 2;
    b = 2;
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