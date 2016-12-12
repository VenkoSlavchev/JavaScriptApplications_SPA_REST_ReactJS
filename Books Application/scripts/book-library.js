function startApp() {
    const baseRequestUrl = 'https://baas.kinvey.com/';
    const baseRequestUrlViewCreateBooks = 'https://baas.kinvey.com/appdata/kid_BJeTAkcze/books/';
    const kinveyBooksAppId = 'kid_BJeTAkcze';
    const kinveyBooksAppSecret = '47a9f4592b434ee9a25decfb74211681';
    const base64auth = btoa(kinveyBooksAppId + ':' + kinveyBooksAppSecret);
    const authHeadersForCreatingUser = {
        "Authorization": "Basic " + base64auth
    };
    const registerForm = $('#formRegister');
    const createBookForm = $('#formCreateBook');
    const editBookForm = $('#formEditBook');
    const booksContainer = $('#books');
    const loginForm = $('#formLogin');
    const infoBox = $('#infoBox');
    const errorBox = $('#errorBox');
    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewHome');

    // Bind the navigation menu links
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(listBooks);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logoutUser);

// Bind the form submit buttons
    $("#buttonLoginUser").click(loginUser);
    $("#buttonRegisterUser").click(registerUser);
    $("#buttonCreateBook").click(createBook);
    $("#buttonEditBook").click(editBook);

    // Bind the info / error boxes: hide on click
    errorBox.click(function () {
        $(this).fadeOut();
    });
    infoBox.click(function () {
        $(this).fadeOut();
    });

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").hide()
        }
    });

    function showHideMenuLinks() {
        $("#linkHome").show();
        if (sessionStorage.getItem('authToken')) {
            // We have logged in user
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkListBooks").show();
            $("#linkCreateBook").show();
            $("#linkLogout").show();
        } else {
            // No logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkListBooks").hide();
            $("#linkCreateBook").hide();
            $("#linkLogout").hide();
        }
    }

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }

    function showHomeView() {
        showView('viewHome');
    }

    function showLoginView() {
        showView('viewLogin');
        loginForm.trigger('reset');
    }

    function showRegisterView() {
        registerForm.trigger('reset');
        showView('viewRegister');
    }

    function showCreateBookView() {
        createBookForm.trigger('reset');
        showView('viewCreateBook');
    }

    function registerUser() {
        let userData = {
            username: registerForm.find('input[name=username]').val(),
            password: registerForm.find('input[name=passwd]').val()
        };
        $.ajax({
            method: "POST",
            url: baseRequestUrl + "user/" + kinveyBooksAppId + "/",
            headers: authHeadersForCreatingUser,
            data: userData,
            success: registerSuccess,
            error: handleAjaxError
        });
        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('User registration successful.');
        }
    }

    function saveAuthInSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        $('#loggedInUser').text(
            "Welcome, " + username + "!");
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0) {
            errorMsg = "Cannot connect due to network error.";
        }
        if (response.responseJSON &&
            response.responseJSON.description) {
            errorMsg = response.responseJSON.description;
        }
        showError(errorMsg);
    }

    function showInfo(message) {
        infoBox.text(message);
        infoBox.show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errorMsg) {
        errorBox.text("Error: " + errorMsg);
        errorBox.show();
    }

    function loginUser() {
        let userData = {
            username: loginForm.find('input[name=username]').val(),
            password: loginForm.find('input[name=passwd]').val()
        };
        $.ajax({
            method: "POST",
            url: baseRequestUrl + "user/" + kinveyBooksAppId + "/login",
            headers: authHeadersForCreatingUser,
            data: userData,
            success: loginSuccess,
            error: handleAjaxError
        });
        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('Login successful.');
        }
    }

    function logoutUser() {
        sessionStorage.clear();
        $('#loggedInUser').text("");
        showHideMenuLinks();
        showView('viewHome');
        showInfo('Logout successful.');
    }

    function listBooks() {
        booksContainer.empty();
        showView('viewBooks');
        $.ajax({
            method: "GET",
            url: baseRequestUrlViewCreateBooks,
            headers: getKinveyUserAuthHeaders(),
            success: loadBooksSuccess,
            error: handleAjaxError
        });
        function loadBooksSuccess(books) {
            showInfo('Books loaded.');
            if (books.length == 0) {
                booksContainer.text('No books in the library.');
            } else {
                let booksTable = $('<table>')
                    .append
                    ($('<tr>')
                        .append(
                            '<th>Title</th><th>Author</th>',
                            '<th>Description</th><th>Actions</th>'
                        )
                    );
                for (let book of books) {
                    appendBookRow(book, booksTable);
                }
                booksContainer.append(booksTable);
            }
        }

    }

    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " +
            sessionStorage.getItem('authToken'),
        };
    }

    function appendBookRow(book, booksTable) {
        let links = [];
        if (book._acl.creator == sessionStorage['userId']) {
            let deleteLink = $('<a href="#">[Delete]</a>')
                .click(function () {
                    deleteBook(book)
                });
            let editLink = $('<a href="#">[Edit]</a>')
                .click(function () {
                    loadBookForEdit(book)
                });
            links = [deleteLink, ' ', editLink];
        }
        booksTable.append(
            $('<tr>')
                .append(
                    $('<td>').text(book.title),
                    $('<td>').text(book.author),
                    $('<td>').text(book.description),
                    $('<td>').append(links)
                )
        );
    }

    function createBook() {
        let bookData = {
            title: createBookForm.find('input[name=title]').val(),
            author: createBookForm.find('input[name=author]').val(),
            description: createBookForm.find('textarea[name=descr]').val()
        };
        $.ajax({
            method: "POST",
            url: baseRequestUrlViewCreateBooks,
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: createBookSuccess,
            error: handleAjaxError
        });
        function createBookSuccess(response) {
            listBooks();
            showInfo('Book created.');
        }
    }

    function deleteBook(book) {
        $.ajax({
            method: "DELETE",
            url: baseRequestUrlViewCreateBooks + book._id,
            headers: getKinveyUserAuthHeaders(),
            success: deleteBookSuccess,
            error: handleAjaxError
        });
        function deleteBookSuccess(response) {
            listBooks();
            showInfo('Book deleted.');
        }
    }

    function loadBookForEdit(book) {
        $.ajax({
            method: "GET",
            url: baseRequestUrlViewCreateBooks + book._id,
            headers: getKinveyUserAuthHeaders(),
            success: loadBookForEditSuccess,
            error: handleAjaxError
        });
        function loadBookForEditSuccess(book) {
            editBookForm.find('input[name=id]').val(book._id);
            editBookForm.find('input[name=title]').val(book.title);
            editBookForm.find('input[name=author]')
                .val(book.author);
            editBookForm.find('textarea[name=descr]')
                .val(book.description);
            showView('viewEditBook');
        }
    }

    function editBook() {
        let bookData = {
            title: editBookForm.find('input[name=title]').val(),
            author: editBookForm.find('input[name=author]').val(),
            description: editBookForm.find('textarea[name=descr]').val()
        };
        $.ajax({
            method: "PUT",
            url: baseRequestUrlViewCreateBooks + editBookForm.find('input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: editBookSuccess,
            error: handleAjaxError
        });

        function editBookSuccess(response) {
            listBooks();
            showInfo('Book edited.');
        }
    }
}