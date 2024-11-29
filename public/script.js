const API_URL = '/students';  // Use a relative URL instead of hardcoded localhost

$(document).ready(function () {
  // Fetch and display students
  function fetchStudents() {
    $.get(API_URL, function (data) {
      const tableBody = $('#studentTable tbody');
      tableBody.empty(); // Clear the table before appending

      data.forEach(student => {
        const row = `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
              <button class="btn btn-warning btn-sm editBtn" data-id="${student.id}">Edit</button>
              <button class="btn btn-danger btn-sm deleteBtn" data-id="${student.id}">Delete</button>
            </td>
          </tr>
        `;
        tableBody.append(row);
      });
    });
  }

  fetchStudents();

  // Add a new student
  $('#studentForm').on('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const name = $('#studentName').val().trim(); // Get student name and remove extra spaces
    const email = $('#studentEmail').val().trim(); // Get student email and remove extra spaces

    if (name === "" || email === "") {
      alert("Please fill in both name and email.");
      return;
    }

    $.ajax({
      url: API_URL,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ name: name, email: email }),  // Send name and email in correct JSON format
      success: function (newStudent) {
        // After successful POST, fetch students to reload the table
        fetchStudents();
        
        // Clear the form fields after submission
        $('#studentName').val('');
        $('#studentEmail').val('');
      },
      error: function (err) {
        console.error('Error adding student:', err);
      }
    });
  });

  // Delete a student
  $(document).on('click', '.deleteBtn', function () {
    const id = $(this).data('id');

    $.ajax({
      url: `${API_URL}/${id}`,
      type: 'DELETE',
      success: function () {
        fetchStudents(); // Re-fetch students after deletion
      },
      error: function (err) {
        console.error('Error deleting student:', err);
      }
    });
  });

  // Edit a student
  $(document).on('click', '.editBtn', function () {
    const id = $(this).data('id');
    const row = $(this).closest('tr');
    const name = row.find('td:eq(1)').text();
    const email = row.find('td:eq(2)').text();

    $('#studentName').val(name);
    $('#studentEmail').val(email);

    // Change the submit handler to update the student instead of adding a new one
    $('#studentForm').off('submit').on('submit', function (e) {
      e.preventDefault();

      const updatedName = $('#studentName').val().trim();
      const updatedEmail = $('#studentEmail').val().trim();

      if (updatedName === "" || updatedEmail === "") {
        alert("Please fill in both name and email.");
        return;
      }

      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name: updatedName, email: updatedEmail }),
        success: function () {
          // Re-fetch students after update
          fetchStudents();

          // Reset the form back to "add new student" state
          resetFormForAdd();

          // Clear the form after updating
          $('#studentName').val('');
          $('#studentEmail').val('');
        },
        error: function (err) {
          console.error('Error updating student:', err);
        }
      });
    });
  });

  // Reset the form for adding a new student after editing
  function resetFormForAdd() {
    // Reset the form event listener to add a new student
    $('#studentForm').off('submit').on('submit', function (e) {
      e.preventDefault();
      const name = $('#studentName').val().trim();
      const email = $('#studentEmail').val().trim();

      if (name === "" || email === "") {
        alert("Please fill in both name and email.");
        return;
      }

      $.ajax({
        url: API_URL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: name, email: email }),
        success: function () {
          // After successful POST, fetch students to reload the table
          fetchStudents();
          
          // Clear the form fields after submission
          $('#studentName').val('');
          $('#studentEmail').val('');
        },
        error: function (err) {
          console.error('Error adding student:', err);
        }
      });
    });
  }
});
