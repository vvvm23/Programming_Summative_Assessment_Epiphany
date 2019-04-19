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