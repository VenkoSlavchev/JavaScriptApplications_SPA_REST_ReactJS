"use strict";

function startApp() {
    const baseRequestUrl = 'https://baas.kinvey.com/';
    const baseRequestUrlViewCreateAds = 'https://baas.kinvey.com/appdata/kid_BJnOpOqml/messages';
    const appID = 'kid_BJnOpOqml';
    const appSecret = '4c22c683e7324e4c8364de3aae4aaf3d';
    const base64auth = btoa(appID + ':' + appSecret);
    const authHeadersForCreatingUser = {
        "Authorization": "Basic " + base64auth
    };


    sessionStorage.clear();
    showProperMenuLinks();
    hideBoxes();

    function showSection(sectionId) {
        $('section').hide();
        $(sectionId).show();
    }

    function showProperMenuLinks() {
        if (sessionStorage.getItem('authenticationToken')) {
            showSection('#viewUserHome');
            $('#linkMenuAppHome').hide();
            $('#linkMenuLogin').hide();
            $('#linkMenuRegister').hide();
            $('#linkMenuUserHome').show();
            $('#linkMenuMyMessages').show();
            $('#linkMenuArchiveSent').show();
            $('#linkMenuSendMessage').show();
            $('#linkMenuLogout').show();
            $('#spanMenuLoggedInUser').show();
        } else {
            showSection('#viewAppHome');
            $('#linkMenuAppHome').show();
            $('#linkMenuLogin').show();
            $('#linkMenuRegister').show();
            $('#linkMenuUserHome').hide();
            $('#linkMenuMyMessages').hide();
            $('#linkMenuArchiveSent').hide();
            $('#linkMenuSendMessage').hide();
            $('#linkMenuLogout').hide();
            $('#spanMenuLoggedInUser').hide();
        }
    }

    $('#loadingBox, #errorBox, #infoBox').on('click', hideBoxes);


    $('#linkMenuRegister').on('click', showRegisterWindow);
    $('#linkMenuLogin').on('click', showLoginWindow);
    $('#linkMenuAppHome').on('click', showHomeWindow);
    $('#linkMenuMyMessages').on('click', showMessages);
    $('#linkMenuArchiveSent').on('click', showArchiveMessages);
    $('#linkMenuSendMessage').on('click', showSendMessagesForm);
    $('#linkMenuUserHome').on('click', showUserHomeWindow);
    $('#formRegister input[value=Register]').on('click', createUser);
    $('#formLogin input[value=Login]').on('click', loginUser);
    $('#linkMenuLogout').on('click', logoutUser);
    $('#linkUserHomeMyMessages').on('click', showMessages);
    $('#linkUserHomeArchiveSent').on('click', showArchiveMessages);
    $('#linkUserHomeSendMessage').on('click', showSendMessagesForm);
    $('#viewArchiveSent').on('click', '#deleteButton', deleteMessage);
    $('#viewSendMessage input[value=Send]').on('click', sendMessage);


    function showRegisterWindow() {
        $('#viewRegister').trigger('reset');
        showSection('#viewRegister');
    }

    function showLoginWindow() {
        $('#viewLogin').trigger('reset');
        showSection('#viewLogin');
    }

    function showHomeWindow() {
        showSection('#viewAppHome');
    }

    function showMyMessagesList() {
        showSection('#viewMyMessages');
    }

    function showMyArchive() {
        showSection('#viewArchiveSent');
    }

    function showUserHomeWindow() {
        showSection('#viewUserHome');
    }

    function showSendMessage() {
        showSection('#viewSendMessage');
    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(() => {
            $('#infoBox').fadeOut()

        }, 3000)
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }

    function hideBoxes() {
        $('#loadingBox, #errorBox, #infoBox').hide();
    }

    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show();
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    })

    function getKinveyAuthHeaders() {
        return {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authenticationToken')
        };
    }

    function createUser(event) {
        event.preventDefault();
        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=password]').val(),
            name: $('#formRegister input[name=name]').val()
        };

        $.ajax({
            method: 'POST',
            url: baseRequestUrl + 'user/' + appID + '/',
            headers: authHeadersForCreatingUser,
            data: userData
        })
            .then(registerUserSuccess)
            .catch(handleError)


    }

    function registerUserSuccess(userInfo) {
        console.log('sucess registered');
        showProperMenuLinks();
        showInfo('User registration successful');
    }

    function saveAuthenticationSession(userInfo) {
        sessionStorage.setItem('authenticationToken', userInfo._kmd.authtoken)
        sessionStorage.setItem('user', userInfo.name);
        sessionStorage.setItem('userName', userInfo.username);
        $('#spanMenuLoggedInUser').text("Welcome, " + userInfo.username + "!");
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

    function loginUser(event) {
        event.preventDefault();
        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=password]').val()
        };

        $.ajax({
            method: 'POST',
            url: baseRequestUrl + 'user/' + appID + '/login',
            headers: authHeadersForCreatingUser,
            data: userData
        })
            .then(loginUserSuccess)
            .catch(handleError)
    }

    function loginUserSuccess(userInfo) {
        console.log('logged in');
        saveAuthenticationSession(userInfo);
        showProperMenuLinks();
        $('#viewUserHomeHeading').text('Welcome, ' + userInfo.username + '!')
        showInfo('Login successful');
        showUserHomeWindow()
    }

    function logoutUser() {
        $.ajax({
            method: 'POST',
            url: baseRequestUrl + 'user/' + appID + '/_logout',
            headers: getKinveyAuthHeaders()
        })
            .then(logoutUserSucces)
            .catch(handleError);

        function logoutUserSucces() {
            console.log('logged out');
            sessionStorage.clear();
            showInfo('Logout Succesfull');
            showProperMenuLinks();
            showHomeWindow();
            $('#spanMenuLoggedInUser').hide();

        }
    }

    function showMessages() {
        $('#myMessages').empty();
        $.ajax({
            method: 'GET',
            url: baseRequestUrlViewCreateAds + `?query={"recipient_username":"${sessionStorage.getItem('userName')}"}`,
            headers: getKinveyAuthHeaders()
        })
            .then(showMyMessageList)
            .catch(handleError);

        function showMyMessageList(messagesResponse) {
            let tableWithMessages = $('<table>')
                .append('<tr>')
                .append(
                    $('<th>').text('From'),
                    $('<th>').text('Message'),
                    $('<th>').text('Date Received')
                );

            for (let message of messagesResponse) {
                tableWithMessages
                    .append($('<tr>')
                        .append($('<td>').text(formatSender(message.sender_name, message.sender_username)),
                            $('<td>').text(message.text),
                            $('<td>').text(formatDate(message._kmd.lmt))
                        )
                    )
            }
            $('#myMessages').append(tableWithMessages);
        }

        showMyMessagesList();
    }

    function formatDate(dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate())) {
            return '';
        }
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    }

    function formatSender(name, username) {
        if (!name) {
            return username;
        } else {
            return username + ' (' + name + ')';
        }
    }

    function showArchiveMessages() {
        $('#sentMessages').empty();
        $.ajax({
            method: 'GET',
            url: baseRequestUrlViewCreateAds + `?query={"sender_username":"${sessionStorage.getItem('userName')}"}`,
            headers: getKinveyAuthHeaders()
        })
            .then(showMyArchiveMessageList)
            .catch(handleError);

        function showMyArchiveMessageList(messagesResponse) {
            let tableWithMessages = $('<table>')
                .append('<tr>')
                .append(
                    $('<th>').text('To'),
                    $('<th>').text('Message'),
                    $('<th>').text('Date Sent'),
                    $('<th>').text('Actions')
                );
            for (let message of messagesResponse) {
                let deleteButton = $('<button>').attr({dataMsgId: message._id, id: 'deleteButton'}).text('Delete');
                tableWithMessages
                    .append($('<tr>')
                        .append($('<td>').text(message.recipient_username),
                            $('<td>').text(message.text),
                            $('<td>').text(formatDate(message._kmd.lmt)),
                            $('<td>').html(deleteButton)
                        )
                    )
            }
            $('#sentMessages').append(tableWithMessages);
        }

        showMyArchive()
    }

    function deleteMessage() {
        let msgId = $(this).attr('dataMsgId');
        $.ajax({
            method: 'DELETE',
            url: baseRequestUrlViewCreateAds + '/' + msgId,
            headers: getKinveyAuthHeaders()
        })
            .then(masageSuccessfulDeleted)
            .catch(handleError);

        function masageSuccessfulDeleted() {
            showArchiveMessages()
            showInfo('Message deleted.');

        }
    }

    function showSendMessagesForm() {
        $('#msgRecipientUsername').empty();
        $('#viewSendMessage input[name=text]').val('');
        $.ajax({
            method: 'GET',
            url: baseRequestUrl + 'user/' + appID,
            headers: getKinveyAuthHeaders()
        })
            .then(recipientsLoadedSuccessful)
            .catch(handleError);

        function recipientsLoadedSuccessful(messagesResponse) {
            for (let message of messagesResponse) {
                let option = $('<option>').text(formatSender(message.name, message.username)).val(message.username);
                $('#msgRecipientUsername').append(option);
            }
            showSendMessage()
        }


    }

    function sendMessage(event) {
        event.preventDefault();
        let senderName = sessionStorage.getItem('user');
        let senderUserName = sessionStorage.getItem('userName');
        let text = $('#viewSendMessage').find('input[name=text]').val();
        let recepientName = $('#msgRecipientUsername').find(":selected").val();
        let messageData = {
            text: text,
            recipient_username: recepientName,
            sender_name: senderName,
            sender_username: senderUserName
        };

        $.ajax({
            method: 'POST',
            url: baseRequestUrlViewCreateAds,
            headers: getKinveyAuthHeaders(),
            data: messageData
        })
            .then(messageSendSuccessful)
            .catch(handleError);

        function messageSendSuccessful() {
            showInfo('Message sent.');
            showArchiveMessages()
        }

    }


}