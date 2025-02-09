// Initialize the DataTable with AJAX for dynamic data loading
    $(document).ready(function() {
      const apartmentTable = $('#apartmentTable').DataTable({
        ajax: {
          url: 'http://localhost:3000/api/apartments', // Your backend API
          method: 'GET',
          dataSrc: 'data' // Adjust according to your backend response format
        },
        columns: [
          { data: 'căn_hộ' },
          { data: 'so_phong_ngu' },
          { data: 'so_wc' },
          { data: 'so_logia' },
          { data: 'dien_tich' },
          {
            data: null,
            render: function(data, type, row) {
              return `<button class="edit-btn" data-id="${row.căn_hộ}">Edit</button>
                      <button class="delete-btn" data-id="${row.căn_hộ}">Delete</button>`;
            }
          }
        ]
      });

      // Delete button click handler
      $('#apartmentTable').on('click', '.delete-btn', function() {
        const apartmentId = $(this).data('id');
        if (confirm(`Are you sure you want to delete apartment: ${apartmentId}?`)) {
          // Call the API to delete the apartment
          fetch(`http://localhost:3000/api/apartment/${encodeURIComponent(apartmentId)}`, {
            method: 'DELETE'
          })
          .then(response => {
            if (response.ok) {
              alert('Apartment deleted successfully');
              apartmentTable.ajax.reload(); // Reload table data
            } else {
              alert('Failed to delete the apartment');
            }
          })
          .catch(error => {
            console.error('Error deleting apartment:', error);
            alert('An error occurred while deleting the apartment');
          });
        }
      });

      // Edit button click handler (example, you can implement your own)
      $('#apartmentTable').on('click', '.edit-btn', function() {
        const apartmentId = $(this).data('id');
        alert(`Editing apartment: ${apartmentId}`);
        // Implement your own edit logic (show a form, etc.)
      });
    });