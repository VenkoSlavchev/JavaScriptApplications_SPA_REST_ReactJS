'use strict';
function getInfo() {
    const stopNameBox = $('#stopName');
    const bussesListBox = $('#buses');
    bussesListBox.empty();
    $.get(`https://judgetests.firebaseio.com/businfo/${$('#stopId').val()}.json`)
        .then(render).catch(error);

    function render(data) {
        let stopName = data.name;
        let bussesListObject = data.buses;
        stopNameBox.text(stopName);

        let busses = Object.keys(bussesListObject);
        for (let bussname of busses) {
            $('<li>').text(`Bus ${bussname} arrives in ${bussesListObject[bussname]} minutes`).appendTo(bussesListBox);
        }

    }

    function error() {
        stopNameBox.text('Error!');
    }


}