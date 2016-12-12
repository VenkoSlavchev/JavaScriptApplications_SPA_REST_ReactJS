'use strict';

function loadRepos() {
    const repositoryList = $('#repos');
    repositoryList.empty();
    let url = `https://api.github.com/users/${$('#username').val()}/repos`;


    function displayRepos(repos) {
        for (let repo of repos) {
            console.log(repo);
            let link = $('<a>').text(repo.full_name).attr('href', repo.html_url);
            repositoryList.append($('<li>').append(link));
        }
    }

    function displayError(err) {
        repositoryList.append($('<li>').text('Error'));
    }

    return $.ajax({
        url,
        success: displayRepos,
        error: displayError
    });
}




