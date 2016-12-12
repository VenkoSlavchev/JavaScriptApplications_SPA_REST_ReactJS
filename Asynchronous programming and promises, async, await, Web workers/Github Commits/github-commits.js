'use strict';
function loadCommits() {
    let username = $('#username').val();
    let repoName = $('#repo').val();
    let url = `https://api.github.com/repos/${username}/${repoName}/commits`;
    const commitsContainerList = $('#commits');
    $.get(url)
        .then(renderCommits)
        .catch(displayError);


    function renderCommits(responseData) {

        for (let commit of responseData) {

            $('<li>').text(`${commit.commit.author.name}: ${commit.commit.message}`).appendTo(commitsContainerList);
        }
    }

    function displayError(error) {

        $('<li>').text(`Error: ${error.status} (${error.statusText})`).appendTo(commitsContainerList);

    }

}