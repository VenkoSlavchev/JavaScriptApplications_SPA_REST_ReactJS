$(document).ready(function () {
    $('body').prepend($(`<div id="aside">
    <button class="load">Load</button>
    <fieldset id="addForm">
        <legend>Add Student</legend>
        <label>ID</label>
        <input type="number" id="id"/>
        <label>First Name</label>
        <input type="text" id="firstName"/>
        <label>Last Name</label>
        <input type="text" id="lastName"/>
        <label>Faculty Number</label>
        <input type="text" id="facultyNumber"/>
        <label>Grade</label>
        <input type="number" id="grade"/>
        <button class="add">Add</button>
    </fieldset>
</div>`));

    const serviceRequestUrl = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students';
    const base64auth = btoa("guest:guest");
    const authHeaders = {
        "Authorization": "Basic " + base64auth,
        "Content-Type": "application/json"
    };

    $('.add').on('click', addStudent);
    $('.load').on('click', loadStudents);

    function addStudent() {
        let idValue = Number($('#id').val());
        let firstNameValue = $('#firstName').val();
        let lastNameValue = $('#lastName').val();
        let facultyNumberValue = $('#facultyNumber').val();
        let gradeValue = Number($('#grade').val());

        let data = JSON.stringify({
            ID: idValue,
            FirstName: firstNameValue,
            LastName: lastNameValue,
            FacultyNumber: facultyNumberValue,
            Grade: gradeValue,
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

    function loadStudents() {

        $.ajax({
            method: "GET",
            url: serviceRequestUrl,
            headers: authHeaders
        })
            .then(displayStudents)
            .catch(displayError);

        function displayStudents(responseStudents) {
            responseStudents.sort((a, b) => {
                return a.ID - b.ID
            })
            for (let student of responseStudents) {
                $('#results')
                    .append($(`<tr>
									<td>${student.ID}</td>
									<td>${student.FirstName}</td>
									<td>${student.LastName}</td>
									<td>${student.FacultyNumber}</td>
									<td>${student.Grade}</td>
								</tr>`))
            }

        }
    }

    function displayError(error) {
        console.log(error);
    }

});