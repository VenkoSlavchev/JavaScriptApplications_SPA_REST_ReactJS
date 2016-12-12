'use strict';
function attachEvents() {
    const phoneBookList = $('#phonebook');
    const personName = $('#person');
    const personPhoneNumber = $('#phone');
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);
    let baseServiceUrl =
        'https://phonebook-nakov.firebaseio.com/phonebook';

    function loadContacts() {
        phoneBookList.empty();
        $.get(baseServiceUrl + '.json')
            .then(displayContacts)
            .catch(displayError);
    }

    function displayError(err) {
        phoneBookList.append($('<li>Error</li>'));
    }

    function displayContacts(contacts) {
        for (let key in contacts) {
            let person = contacts[key]['person'];
            let phone = contacts[key]['phone'];
            let li = $('<li>');
            li.text(person + ': ' + phone + ' ');
            phoneBookList.append(li);
            li.append($('<button>[Delete]</button>')
                .click(function () {
                    deleteContact(key)
                }));
        }
    }

    function createContact() {
        let newContactJSON = JSON.stringify({
            person: personName.val(),
            phone: personPhoneNumber.val()
        });
        $.post(baseServiceUrl + '.json', newContactJSON)
            .then(loadContacts)
            .catch(displayError);
        personName.val('');
        personPhoneNumber.val('');
    }

    function deleteContact(key) {
        let request = {
            method: 'DELETE',
            url: baseServiceUrl + '/' + key + '.json'
        };
        $.ajax(request)
            .then(loadContacts)
            .catch(displayError);
    }


}
