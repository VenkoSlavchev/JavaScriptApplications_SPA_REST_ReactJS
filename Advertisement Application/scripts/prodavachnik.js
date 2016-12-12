function startApp() {
    const baseRequestUrl = 'https://baas.kinvey.com/';
    const baseRequestUrlViewCreateAds = 'https://baas.kinvey.com/appdata/kid_BJb8jO4Gl/advertisements';
    const appID = 'kid_BJb8jO4Gl';
    const appSecret = '0992afd05509468697aef0da39713347';
    const base64auth = btoa(appID + ':' + appSecret);
    const authHeadersForCreatingUser = {
        "Authorization": "Basic " + base64auth
    };
    const anchorForEditDeleteButtons = $('#viewAds');
    const listWithAds = $('#ads');
    const createAddForm = $('#formCreateAd');
    const editAddSection = $('#viewEditAd');
    let kinveyAuthorization = {
        "Authorization": "Kinvey " + sessionStorage.getItem('authenticationToken')
    };
    const detailsContainer = $('<section>').attr('id', 'viewDetails').css('display', 'none').appendTo($('main'));

    sessionStorage.clear();
    showProperMenuLinks();
    // Bind the navigation menu links
    $('#linkHome').on('click', showProperMenuLinks);
    $('#linkLogin').on('click', showLoginWindow);
    $('#linkRegister').on('click', showRegisterWindow);
    $('#linkListAds').on('click', showAdsList);
    $('#linkCreateAd').on('click', showCreateAddWindow);
    $('#linkLogout').on('click', logoutUser);
    // Bind the form submit buttons
    $('#buttonRegisterUser').on('click', createUser);
    $('#buttonLoginUser').on('click', loginUser);
    $('#buttonCreateAd').on('click', createAdvertisement);
    anchorForEditDeleteButtons.on('click', '#deleteButton', deleteAd);
    anchorForEditDeleteButtons.on('click', '#editButton', loadAdForEdit);
    anchorForEditDeleteButtons.on('click', '#showMoreButton', viewDetailsForAdvertisement);
    $('#buttonEditAd').on('click', updateAdvertiseRequest);

// Bind the info / error boxes: hide on click
    $('#loadingBox, #errorBox, #infoBox').on('click', hideBoxes);


    function showProperMenuLinks() {

        if (sessionStorage.getItem('authenticationToken')) {
            showSection('#viewHome');
            $('#linkHome').show();
            $('#linkLogin').hide();
            $('#linkRegister').hide();
            $('#linkListAds').show();
            $('#linkCreateAd').show();
            $('#linkLogout').show();
            $('#loggedInUser').show();
        } else {
            showSection('#viewHome');
            $('#linkHome').show();
            $('#linkLogin').show();
            $('#linkRegister').show();
            $('#linkListAds').hide();
            $('#linkCreateAd').hide();
            $('#linkLogout').hide();
            $('#loggedInUser').hide();
        }
    }

// Hide all views and show the selected view only
    function showSection(sectionId) {
        $('section').hide();
        $(sectionId).show();
    }

    function showLoginWindow() {
        $('#viewLogin').trigger('reset');
        showSection('#viewLogin');
    }

    function showRegisterWindow() {
        $('#viewRegister').trigger('reset');
        showSection('#viewRegister');
    }

    function showAdsList() {
        showSection('#viewAds');
        console.log('dsadwa');
    }

    function showCreateAddWindow() {
        $('#viewCreateAd').trigger('reset');
        showSection('#viewCreateAd');
    }

    function showEditWindow() {
        showSection('#viewEditAd');
    }

    function showDetailsWindow() {
        showSection('#viewDetails');
    }

    function logoutUser() {
        $.ajax({
            method: 'POST',
            url: baseRequestUrl + 'user/' + appID + '/_logout',
            headers: {
                "Authorization": "Kinvey " + sessionStorage.getItem('authenticationToken')
            }
        })
            .then(logoutUserSucces)
            .catch(handleError)

        function logoutUserSucces() {
            sessionStorage.clear();
            showInfo('Logout Succesfull');
            showProperMenuLinks();
            showSection('#viewHome');
            $('#loggedInUser').hide();

        }
    }

    function loginUser() {
        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };

        $.ajax({
            method: 'POST',
            url: baseRequestUrl + 'user/' + appID + '/login',
            headers: authHeadersForCreatingUser,
            data: userData,
        })
            .then(loginUserSuccess)
            .catch(handleError)
    }

    function createUser() {
        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };

        $.ajax({
            method: 'POST',
            url: baseRequestUrl + 'user/' + appID + '/',
            headers: authHeadersForCreatingUser,
            data: userData,
        })
            .then(registerUserSuccess)
            .catch(handleError)


    }

    function loginUserSuccess(userInfo) {
        saveAuthenticationSession(userInfo);
        showProperMenuLinks();
        viewAdvertisementsList();
        showInfo('Login Succesfull');
    }

    function registerUserSuccess(userInfo) {
        saveAuthenticationSession(userInfo);
        showProperMenuLinks();
        //viewAdvertisementsList();
        showInfo('Registration Succesfull');
    }

    function saveAuthenticationSession(userInfo) {

        sessionStorage.setItem('authenticationToken', userInfo._kmd.authtoken)
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('userName', userInfo.username);
        $('#loggedInUser').text("Welcome, " + userInfo.username + "!");
    }

    function handleError(error) {
        let errorMsg = JSON.stringify(error);
        if (error.readyState === 0) {
            errorMsg = "Cannot connect due to network error.";
        }
        if (error.responseJSON &&
            error.responseJSON.description) {
            errorMsg = error.responseJSON.description;
        }
        console.log(error);
        showError(errorMsg);

    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(() => {
            $('#infoBox').fadeOut()

        }, 2000)
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }

    function hideBoxes() {
        $('#loadingBox, #errorBox, #infoBox').hide();
    }

// Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show();
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    })
    function createAdvertisement() {
        let date = createAddForm.find('input[name=datePublished]').val();
        date = (date.split('-')).reverse().join('-');
        let advertisementData = {
            title: createAddForm.find('input[name=title]').val(),
            description: createAddForm.find('textarea').val(),
            date: date,
            price: createAddForm.find('input[name=price]').val(),
            views: 0,
            image: 'https://drscdn.500px.org/photo/101695131/m%3D2048/a597a7b71e5a12b69df23bef7639a512',
            publisher: sessionStorage.getItem('userName')
        };

        $.ajax({
            method: 'POST',
            url: baseRequestUrlViewCreateAds,
            headers: kinveyAuthorization,
            data: advertisementData

        })
            .then(advertisementCreated)
            .catch(handleError);

        function advertisementCreated(response) {
            viewAdvertisementsList();
            showInfo('Advertisement created successfully');
        }
    }

    function viewAdvertisementsList() {
        listWithAds.empty();
        $.ajax({
            method: 'GET',
            url: baseRequestUrlViewCreateAds,
            headers: kinveyAuthorization
        })
            .then(advertisementSuccessfulUpdated)
            .catch(handleError);

        function advertisementSuccessfulUpdated(adsResponse) {
            let tableWithAds = $('<table>')
                .append('<tr>')
                .append(
                    $('<th>').text('Title'),
                    $('<th>').text('Description'),
                    $('<th>').text('Publisher'),
                    $('<th>').text('Date Published'),
                    $('<th>').text('Price'),
                    $('<th>').text('Action')
                );

            for (let ad of adsResponse) {
                appendRow(tableWithAds, ad);
            }
            listWithAds.append(tableWithAds);

            function appendRow(tableWithAds, ad) {
                let links = [];
                if (ad._acl.creator == sessionStorage['userId']) {
                    let deleteLink = $('<a>').attr({href: '#', dataAdId: ad._id, id: 'deleteButton'}).text('[Delete]');
                    let editLink = $('<a>').attr({href: '#', dataAdId: ad._id, id: 'editButton'}).text('[Edit]');
                    let readMoreLink = $('<a>').attr({
                        href: '#',
                        dataAdId: ad._id,
                        id: 'showMoreButton'
                    }).text('[Read More]');
                    links = [readMoreLink, ' ', deleteLink, ' ', editLink];
                } else {
                    let readMoreLink = $('<a>').attr({
                        href: '#',
                        dataAdId: ad._id,
                        id: 'showMoreButton'
                    }).text('[Read More]');
                    links = [readMoreLink];
                }
                tableWithAds
                    .append($('<tr>')
                        .append($('<td>').text(ad.title),
                            $('<td>').text(ad.publisher),
                            $('<td>').text(ad.description),
                            $('<td>').text(ad.price),
                            $('<td>').text(ad.date),
                            $('<td>').html(links)
                        )
                    )
            }
        }

        showAdsList();
    }

    function deleteAd() {
        let adId = $(this).attr('dataAdId');
        $.ajax({
            method: 'DELETE',
            url: baseRequestUrlViewCreateAds + '/' + adId,
            headers: kinveyAuthorization
        })
            .then(advertisementSuccessfulDeleted)
            .catch(handleError);

        function advertisementSuccessfulDeleted(deleteResponse) {
            viewAdvertisementsList();
            showInfo('Advertisement successfully deleted');
        }
    }

    function loadAdForEdit() {
        adId = $(this).attr('dataAdId');
        console.log(adId);
        $.ajax({
            method: 'GET',
            url: baseRequestUrlViewCreateAds + '/' + adId,
            headers: kinveyAuthorization
        })
            .then(advertisementLoadedSuccessfulForUpdate)
            .catch(handleError);

        function advertisementLoadedSuccessfulForUpdate(advertisementResponse) {
            console.log(advertisementResponse);
            let date = advertisementResponse.date;
            date = (date.split('-')).reverse().join('-');
            editAddSection.find('input[name=datePublished]').val(date);
            editAddSection.find('input[name=title]').val(advertisementResponse.title);
            editAddSection.find('textarea').val(advertisementResponse.description);
            editAddSection.find('input[name=price]').val(advertisementResponse.price);
            editAddSection.find('input[name=id]').val(advertisementResponse._id);
            editAddSection.find('input[name=publisher]').val(advertisementResponse.publisher);
            showEditWindow();
        }

    }

    function updateAdvertiseRequest() {
        let adId = viewDetailsSection.find('input[name=id]').val();
        let date = viewDetailsSection.find('input[name=datePublished]').val();
        date = (date.split('-')).reverse().join('-');
        let advertisementData = {
            title: viewDetailsSection.find('input[name=title]').val(),
            description: viewDetailsSection.find('textarea').val(),
            date: date,
            price: viewDetailsSection.find('input[name=price]').val(),
        };

        $.ajax({
            method: 'PUT',
            url: baseRequestUrlViewCreateAds + '/' + adId,
            headers: kinveyAuthorization,
            data: advertisementData

        })
            .then(advertisementUpdatedSuccessfully)
            .catch(handleError);

        function advertisementUpdatedSuccessfully(response) {
            viewAdvertisementsList();
            showInfo('Advertisement updated successfully');
        }
    }

    function viewDetailsForAdvertisement() {
        adId = $(this).attr('dataAdId');
        $.ajax({
            method: 'GET',
            url: baseRequestUrlViewCreateAds + '/' + adId,
            headers: kinveyAuthorization
        })
            .then(advertisementDetailsLoadedSuccessfully)
            .catch(handleError);
        function advertisementDetailsLoadedSuccessfully(adResponse) {
            detailsContainer.empty();
            let advertInfo = $('<div>')
                .append(
                    $('<img>').attr({src: `${adResponse.image}`, height: '40', weight: '40'}),
                    $('<br>'),
                    $('<label>').attr('for', 'title').text('Title:'),
                    $('<h1>').text(adResponse.title),
                    $('<label>').attr('for', 'description').text('Description:'),
                    $('<p>').text(adResponse.description),
                    $('<label>').attr('for', 'publisher').text('Publisher:'),
                    $('<p>').text(adResponse.description),
                    $('<label>').attr('for', 'date').text('Date:'),
                    $('<div>').text(adResponse.date),
                    $('<label>').attr('for', 'views').text('Views:'),
                    $('<div>').text()
                );
            detailsContainer.append(advertInfo);
            showDetailsWindow();

        }
    }


}