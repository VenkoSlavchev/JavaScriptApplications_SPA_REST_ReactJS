function attachEvents() {

    $(document).ready(function () {
        const serviceRequestUrl = 'https://baas.kinvey.com/';
        const appID = 'kid_BJ_Ke8hZg';
        const mainDiv = $('#venue-info');
        const base64auth = btoa("guest:pass");
        const authHeaders = {
            "Authorization": "Basic " + base64auth,
            "Content-Type": "application/json"
        };


        $('#getVenues').on('click', getList);
        mainDiv.on('click', '.info', showVenueDetails);
        mainDiv.on('click', '.purchase', purchase);

        function getList() {
            let venueListIDs = [];
            $('<ul>').attr('id', 'listOfVenues').appendTo(mainDiv);
            $.ajax({
                method: "POST",
                url: serviceRequestUrl + 'rpc/' + appID +
                `/custom/calendar?query=${$('#venueDate').val()}`,
                headers: authHeaders,
            })
                .then(getVenues)
                .catch(displayError)


            function getVenues(responceVenuesList) {
                for (let venue of responceVenuesList) {
                    $.ajax({
                        method: "GET",
                        url: serviceRequestUrl + 'appdata/' + appID +
                        `/venues/${venue}`,
                        headers: authHeaders,
                    })
                        .then(makeListWithVenues)
                        .catch(displayError)


                }

            }


            function makeListWithVenues(responceSingleVenue) {
                $('<li>')
                    .append(`<div class="venue" id="${responceSingleVenue._id}">
										<span class="venue-name"><input class="info" type="button" value="More info">${responceSingleVenue.name}</span>
										<div class="venue-details" style="display: none;">
											<table>
											<tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
											<tr>
												<td class="venue-price">${responceSingleVenue.price} lv</td>
												<td><select class="quantity">
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
												</select></td>
												<td><input class="purchase" type="button" value="Purchase"></td>
											</tr>
											</table>
											<span class="head">Venue description:</span>
											<p class="description">${responceSingleVenue.description}</p>
											<p class="description">Starting time: ${responceSingleVenue.startingHour}</p>
										</div>
										</div>
										`).appendTo($('#listOfVenues'))


            }


        }

        function showVenueDetails() {
            $(this).parent().next().css('display', 'block')

        }

        function purchase() {
            let parent = $(this).parent().parent().parent().parent().parent().parent().parent();
            let price = $(parent).find('.venue-price').text()
            price = price.substring(0, price.length - 3);
            let quantity = $(parent).find('option:selected').text();
            let name = $(parent).find('.info').text();
            let currentId = $(parent).find('.venue').attr('id');
            let confirmationBox = $(`<span class="head">Confirm purchase</span>
											<div class="purchase-info">
											<span>${name}</span>
											<span>${quantity} x ${price}</span>
											<span>Total: ${quantity * price} lv</span>
											<input type="button" value="Confirm">
										</div>`);
            mainDiv.empty();
            mainDiv.append(confirmationBox);
            mainDiv.on('click', 'input[value="Confirm"]', confirmOrder);
            function confirmOrder() {
                $.ajax({
                    method: "POST",
                    url: serviceRequestUrl + 'rpc/' + appID +
                    `/custom/purchase?venue=${currentId}&qty=${quantity}`,
                    headers: authHeaders,
                })
                    .then(displayOrderConfirmedHTML)
                    .catch(displayError)

                function displayOrderConfirmedHTML(lastServerResponce) {
                    mainDiv.empty();
                    mainDiv.append('You may print this page as your ticket');
                    mainDiv.append(lastServerResponce.html);

                }


            }


        }


        function displayError(error) {
            console.log(error);
        }

    })

}