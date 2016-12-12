function attachEvents() {
    $(document).ready(function () {
        const kinveyAppId = "kid_rJvFmSeze";
        const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
        const kinveyUsername = "venko";
        const kinveyPassword = "venko";
        const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
        const authHeaders = {"Authorization": "Basic " + base64auth};

        $('#btnLoadPosts').on('click', loadPosts);
        $('#btnViewPost').on('click', viewPosts);


        function loadPosts() {
            let loadPostsRequest = {
                method: "GET",
                url: serviceUrl + "/posts",
                headers: authHeaders,
            };

            $.ajax(loadPostsRequest)
                .then(displayPosts)
                .catch(displayError);


            function displayPosts(responseData) {
                for (let post of responseData) {
                    $('<option>').text(post.title).val(post._id).appendTo($('#posts'));

                }
            }


        }

        function viewPosts() {
            $("ul").empty();
            let loadCurrentPostsRequest = {
                method: "GET",
                url: `${serviceUrl}/posts/${$('option:selected').val()}`,
                headers: authHeaders,
            };
            let loadCommentsForCurrentPostRequest = {
                method: "GET",
                url: `${serviceUrl}/comments/?query={"post_id":"${$('option:selected').val()}"}`,
                headers: authHeaders,
            };


            let requestPosts = $.ajax(loadCurrentPostsRequest);
            let requestComments = $.ajax(loadCommentsForCurrentPostRequest);

            Promise.all([requestPosts, requestComments])
                .then(displayPostsAndComments)
                .catch(displayError);

            function displayPostsAndComments([responsePostData, responseCommentsData]) {
                $('#post-title').text(responsePostData.title);
                $('#post-body').text(responsePostData.body);

                for (let comment of responseCommentsData) {

                    $('<li>').text(comment.text).appendTo($('#post-comments'));
                }


                console.log(responsePostData);
                console.log(responseCommentsData);


            }


        }


        function displayError(error) {
            $('<div>').text(`Error: ${error.status} (${error.statusText})`).prependTo($('body'));


        }
    })


}