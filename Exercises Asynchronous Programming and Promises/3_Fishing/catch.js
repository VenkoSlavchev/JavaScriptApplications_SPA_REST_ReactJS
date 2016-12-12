function attachEvents() {
    $(document).ready(function () {

        const serviceRequestUrl = 'https://baas.kinvey.com/appdata/kid_BkpX-s-ze/biggestCatches';
        const kinveyUsername = "guest";
        const kinveyPassword = "guest";
        const base64auth = btoa("guest:guest");
        const authHeaders = {
            "Authorization": "Basic " + base64auth,
            "Content-Type": "application/json"
        };


        $('.add').on('click', addCatch);
        $('.load').on('click', loadCatchDatabase);
        $(document).on('click', '.delete', deleteCatch);
        $(document).on('click', '.update', updateCatch);

        function addCatch() {
            let anglerValue = $('#addForm .angler').val();
            let weightValue = $('#addForm .weight').val();
            let speciesValue = $('#addForm .species').val();
            let locationValue = $('#addForm .location').val();
            let baitValue = $('#addForm .bait').val();
            let captureTimeValue = $('#addForm .captureTime').val();
            let data = JSON.stringify({
                angler: anglerValue,
                weight: weightValue,
                species: speciesValue,
                location: locationValue,
                bait: baitValue,
                captureTime: captureTimeValue
            });

            $.ajax({
                method: "POST",
                url: serviceRequestUrl,
                headers: authHeaders,
                dataType: "json",
                data: data
            })
                .then(renderInfoOnConsole)
                .catch(displayError);

            function renderInfoOnConsole(responsePost) {
                console.log(responsePost);

            }

        }

        function loadCatchDatabase() {

            $.ajax({
                method: "GET",
                url: serviceRequestUrl,
                headers: authHeaders
            })
                .then(displayCatch)
                .catch(displayError);

            function displayCatch(responseCatch) {
                console.log(responseCatch);
                for (let catchElement of responseCatch) {

                    $('#main').append($(`<div id="catches">
							<div class="catch" data-id="${catchElement._id}">
								<label>Angler</label>
								<input type="text" class="angler" value="${catchElement.angler}"/>
								<label>Weight</label>
								<input type="number" class="weight" value="${catchElement.weight}"/>
								<label>Species</label>
								<input type="text" class="species" value="${catchElement.species}"/>
								<label>Location</label>
								<input type="text" class="location" value="${catchElement.location}"/>
								<label>Bait</label>
								<input type="text" class="bait" value="${catchElement.bait}"/>
								<label>Capture Time</label>
								<input type="number" class="captureTime" value="${catchElement.captureTime}"/>
								<button class="update">Update</button>
								<button class="delete">Delete</button>
							</div>
						</div>`));

                }
            }

        }

        function deleteCatch() {
            let elementId = $(this).parent().attr('data-id');
            $.ajax({
                method: 'DELETE',
                url: serviceRequestUrl + `/${elementId}`,
                headers: authHeaders
            })
                .catch(displayError);
            $(this).parent().parent().remove();


        }

        function updateCatch() {
            let elementId = $(this).parent().attr('data-id');
            let anglerValue = $(`div[data-id="${elementId}"] .angler`).val();
            let weightValue = $(`div[data-id="${elementId}"] .weight`).val();
            let speciesValue = $(`div[data-id="${elementId}"]  .species`).val();
            let locationValue = $(`div[data-id="${elementId}"]  .location`).val();
            let baitValue = $(`div[data-id="${elementId}"]  .bait`).val();
            let captureTimeValue = $(`div[data-id="${elementId}"]  .captureTime`).val();
            let data = JSON.stringify({
                angler: anglerValue,
                weight: weightValue,
                species: speciesValue,
                location: locationValue,
                bait: baitValue,
                captureTime: captureTimeValue
            });

            $.ajax({
                method: 'PUT',
                url: serviceRequestUrl + `/${elementId}`,
                headers: authHeaders,
                dataType: "json",
                data: data
            })
                .catch(displayError)


        }

        function displayError(error) {
            console.log(error);
        }
    })

}