'use strict';
function solve() {
    let nextStopId = 'depot';
    let currentBusStop;
    const departButton = $('#depart');
    const arriveButton = $('#arrive');
    const infoBox = $('.info');
    departButton.click(depart);
    arriveButton.click(arrive);
    function depart() {
        $.get(`https://judgetests.firebaseio.com/schedule/${nextStopId}.json`)
            .then(getNextBusStop)
            .catch(error);

        function getNextBusStop(data) {
            infoBox.text(`Next stop ${data.name}`);
            currentBusStop = data.name;
            nextStopId = data.next;
            arriveButton.attr('disabled', false);
            departButton.attr('disabled', true);
        }
    }

    function arrive() {

        infoBox.text(`Arriving at ${currentBusStop}`);
        arriveButton.attr('disabled', true);
        departButton.attr('disabled', false);

    }


    function error() {
        infoBox.text(`Error`);
        arriveButton.attr('disabled', 'true');
        departButton.attr('disabled', 'true');
    }

    return {
        depart,
        arrive
    };
}