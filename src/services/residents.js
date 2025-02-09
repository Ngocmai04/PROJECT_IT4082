// Function to populate the table
async function fetchAndDisplayData() {
    try {
        const response = await fetch("http://localhost:3000/api/residents");
        const data = await response.json();

        const tableBody = document.getElementById("resident-table-body");
        tableBody.innerHTML = ""; // Clear existing data

        data.forEach((item) => {
            const row = `
              <tr>
                  <td>${item['resident_id']}</td>
                  <td>${item['full_name']}</td>
                  <td>${item['apartment_id']}</td>
                  <td>${item['birth_date']}</td>
                  <td>${item['phone_number']}</td>
                  <td>${item['email']}</td>
                  <td>
                      <button class="edit-btn" id="resident-edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button class="delete-btn" id="resident-delete-btn"><i class="fa-solid fa-trash"></i></button>
                  </td>
              </tr>
          `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Initialize DataTable if not already initialized
        table = $('#resident-table').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[1, "asc"]], // You can modify the column index and order here
            searching: true,
            paging: true,
            responsive: true,
            columnDefs: [
                {
                    targets: 6, // Cột cuối cùng (Action column)
                    orderable: false // Tắt tính năng sắp xếp cho cột này
                },
                {
                    targets: 3, // Birth date column (adjust index if necessary)
                    render: function (data, type, row) {
                        if (type === "display" || type === "filter") {
                            return new Date(data).toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
                        }
                        return data;
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// ADD
// Open form when clicking "Add Apartment" button
$("#add-resident-btn").click(function () {
    $("#add-resident-form").fadeIn();
});

// Close modal when clicking "Cancel" or "X" button
$("#add-resident-closeForm, #add-resident-cancelForm").click(function () {
    $("#add-resident-form").fadeOut();
});

// Submit form
$("#add-resident-submitForm").click(async function () {
    // Get form values
    const name = $("#resident-fullname").val().trim();
    const apartment = $("#resident-apartment-id").val().trim();
    const birthday = $("#resident-bd").val().trim();
    const phone = $("#resident-phone").val().trim();
    const email = $("#resident-email").val().trim();

    // Validation: Check if all fields are filled
    if (!name || !apartment || !birthday || !phone || !email) {
        alert("Please fill in all fields before submitting.");
        return;
    }
    const resident_data = {
        name: name,
        apartment: apartment,
        birthday: birthday,
        phone: phone,
        email: email
    };

    // Send data to the server
    try {
        // Send ADD request
        const response = await fetch("http://localhost:3000/api/residents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resident_data)
        });

        // Check if adding successful
        const data = await response.json(); // Get the response JSON
        if (response.ok) {
            alert("Succeed to add the resident.");
            location.reload(); // Reloads the current page
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert(data.message);
    }
});

// EDIT
// Using event delegation for edit and delete buttons
document.getElementById("resident-table").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is an edit button
    if (target.classList.contains("edit-btn") && target.id.includes("resident-edit-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const old_id = row.children[0].textContent;
        const name = row.children[1].textContent;
        const apartment = row.children[2].textContent;
        const birthday = row.children[3].textContent;
        const phone = row.children[4].textContent;
        const email = row.children[5].textContent;
        console.log("Edit resident:", name);
        
        // Điền dữ liệu vào form
        document.getElementById("edit-resident-id").value = old_id;
        document.getElementById("edit-resident-fullname").value = name;
        document.getElementById("edit-resident-apartment-id").value = apartment;
        document.getElementById("edit-resident-bd").value = birthday;
        document.getElementById("edit-resident-phone").value = phone;
        document.getElementById("edit-resident-email").value = email;

        // Implement edit functionality here
        // Open form when clicking "Edit Apartment" button
        $("#edit-resident-form").fadeIn();

        // Close modal when clicking "Cancel" or "X" button
        $("#edit-resident-closeForm, #edit-resident-cancelForm").click(function () {
            $("#edit-resident-form").fadeOut();
            return;
        });

        // Submit form
        $("#edit-resident-submitForm").click(async function () {
            // Get form values
            const id = $("#edit-resident-id").val().trim();
            const name = $("#edit-resident-fullname").val().trim();
            const apartment = $("#edit-resident-apartment-id").val().trim();
            const birthday = $("#edit-resident-bd").val().trim();
            const phone = $("#edit-resident-phone").val().trim();
            const email = $("#edit-resident-email").val().trim();

            // Validation: Check if all fields are filled
            if (!id || !name || !apartment || !birthday || !phone || !email) {
                alert("Please fill in all fields before submitting.");
                return;
            }
            const edit_data = {
                old_id: old_id,
                id: id,
                name: name,
                apartment: apartment,
                birthday: birthday,
                phone: phone,
                email: email
            };

            // Send data to the server
            try {
                const response = await fetch(`http://localhost:3000/api/residents/${encodeURIComponent(id)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(edit_data)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Resident updated successfully!");
                    location.reload(); // Cập nhật bảng sau khi chỉnh sửa
                } else {
                    alert("Error updating apartment: " + data.message);
                }
            } catch (error) {
                console.error("Error updating resident:", error);
                alert("Failed to update resident.");
            }
        });
    }
});


// DELETE
document.getElementById("resident-table").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is a delete button
    if (target.classList.contains("delete-btn") && target.id.includes("resident-delete-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const id = row.children[0].textContent.trim(); 
        const name = row.children[1].textContent.trim(); 
        console.log("Delete resident:", name);

        // Confirm deletion
        if (id && confirm(`Are you sure you want to delete resident: ${name}?`)) {
            try {
                // Send DELETE request
                const response = await fetch(`http://localhost:3000/api/residents/${encodeURIComponent(id)}`, {
                    method: "DELETE"
                });

                // Check if deletion was successful
                const data = await response.json(); // Await response JSON
                if (response.ok) {
                    alert("Successfully deleted the resident.");
                    row.remove(); // Remove row from table without reloading
                } else {
                    alert(`Failed to delete the resident: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error("Error deleting resident:", error);
                alert("An error occurred while deleting.");
            }
        }
    }
});

// Fetch and display data
$(document).ready(fetchAndDisplayData());