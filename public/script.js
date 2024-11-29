const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/students' 
  : 'https://student-crud-8c563f877250.herokuapp.com/';


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
    e.preventDefault();

    // Get form input values
    const name = $('#studentName').val();
    const email = $('#studentEmail').val();

    // Validate inputs
    if (!name || !email) {
      alert('Please fill in both name and email.');
      return;
    }

    // Send data to the server
    $.ajax({
      url: API_URL,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ name, email }),
      success: function () {
        fetchStudents(); // Reload the table
        $('#studentName').val(''); // Clear the form
        $('#studentEmail').val('');
      },
      error: function (err) {
        console.error('Error adding student:', err);
        alert('Failed to add student.');
      },
    });
  });

  // Delete a student
  $(document).on('click', '.deleteBtn', function () {
    const id = $(this).data('id');

    $.ajax({
      url: `${API_URL}/${id}`,
      type: 'DELETE',
      success: function () {
        fetchStudents();
      }
    });
  });

  // Edit a student
  $(document).on('click', '.editBtn', function () {
    const id = $(this).data('id');
    const row = $(this).closest('tr');
    const name = row.find('td:eq(1)').text();
    const email = row.find('td:eq(2)').text();

    // Fill the form with the student's data
    $('#studentName').val(name);
    $('#studentEmail').val(email);

    // Change form submit behavior to update the student
    $('#studentForm').off('submit').on('submit', function (e) {
      e.preventDefault();

      const updatedName = $('#studentName').val();
      const updatedEmail = $('#studentEmail').val();

      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name: updatedName, email: updatedEmail }),
        success: function () {
          fetchStudents();
          resetForm(); // Reset the form after editing
        },
        error: function (err) {
          console.error('Error updating student:', err);
          alert('Failed to update student.');
        },
      });
    });
  });

  // Reset the form back to the original state (for adding new students)
  function resetForm() {
    $('#studentForm').off('submit').on('submit', function (e) {
      e.preventDefault();

      const name = $('#studentName').val();
      const email = $('#studentEmail').val();

      // Validate inputs
      if (!name || !email) {
        alert('Please fill in both name and email.');
        return;
      }

      // Send data to the server
      $.ajax({
        url: API_URL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email }),
        success: function () {
          fetchStudents(); // Reload the table
          $('#studentName').val(''); // Clear the form
          $('#studentEmail').val('');
        },
        error: function (err) {
          console.error('Error adding student:', err);
          alert('Failed to add student.');
        },
      });
    });
  }
});
