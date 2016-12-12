function attachEvents() {
    const messageArea = $('#messages');
    $('#refresh').click(render);
    $('#submit').click(submitMessage);

    function render() {
        $.get('https://messanger-465d1.firebaseio.com/messanger.json')
            .then(sortAndRender)
            .catch(error);

        function sortAndRender(data) {
            let arrayOfMessages = [];
            let messages = Object.keys(data);
            let resultStringMessages = '';

            for (let message of messages) {
                arrayOfMessages.push(data[message]);
                arrayOfMessages.sort((a, b) => {
                    return a.timestamp - b.timestamp
                });

            }
            for (let message of arrayOfMessages) {
                resultStringMessages += `${message.author}: ${message.content}\n`;
            }
            messageArea.text(resultStringMessages);


        }

        function error(error) {
            messageArea.text('There is no messages in the chat!');

        }

    }

    function submitMessage() {
        let name = $('#author').val();
        let message = $('#content').val();

        $.post('https://messanger-465d1.firebaseio.com/messanger.json', JSON.stringify({
            author: name,
            content: message,
            timestamp: Date.now()
        })).then(render)
            .catch(error);

        function error() {
            alert('something went wrong')
        }
    }

}
	