// Function to populate the table
async function fetchAndDisplayData() {
    try {
        const response = await fetch("http://localhost:3000/api/vehicles-type");
        const data = await response.json();

        const tableBody = document.getElementById("vehicles-type-table-body");
        tableBody.innerHTML = ""; // Clear existing data

        data.forEach((item) => {
            const row = `
              <tr>
                  <td>${item['type']}</td>
                  <td>${item['parking_fee']}</td>
                  <td>${item['location']}</td>
                  <td>
                      <button class="edit-btn" id="vehicle-type-edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button class="delete-btn" id="vehicle-type-delete-btn"><i class="fa-solid fa-trash"></i></button>
                  </td>
              </tr>
          `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Initialize DataTable if not already initialized
        table = $('#vehicles-type-table').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[1, "asc"]], // You can modify the column index and order here
            searching: true,
            paging: true,
            responsive: true,
            columnDefs: [
                {
                    targets: 3, // Cột cuối cùng (Action column)
                    orderable: false // Tắt tính năng sắp xếp cho cột này
                },
            ]
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    try {
        const response = await fetch("http://localhost:3000/api/vehicles");
        const data = await response.json();

        const tableBody = document.getElementById("vehicles-table-body");
        tableBody.innerHTML = ""; // Clear existing data

        data.forEach((item) => {
            const row = `
              <tr>
                  <td>${item['license_plate']}</td>
                  <td>${item['apartment_id']}</td>
                  <td>${item['type']}</td>
                  <td>${item['status']}</td>
                  <td>
                      <button class="edit-btn" id="vehicle-edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button class="delete-btn" id="vehicle-delete-btn"><i class="fa-solid fa-trash"></i></button>
                  </td>
              </tr>
          `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Initialize DataTable if not already initialized
        table = $('#vehicles-table').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[0, "asc"]], // You can modify the column index and order here
            searching: true,
            paging: true,
            responsive: true,
            columnDefs: [
                {
                    targets: 4, // Cột cuối cùng (Action column)
                    orderable: false // Tắt tính năng sắp xếp cho cột này
                },
            ]
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// ADD
// Open form when clicking "Add Apartment" button
$("#add-vehicle-btn").click(function () {
    $("#add-vehicle-form").fadeIn();
});

// Close modal when clicking "Cancel" or "X" button
$("#add-vehicle-closeForm, #add-vehicle-cancelForm").click(function () {
    $("#add-vehicle-form").fadeOut();
});

// Submit form
$("#add-vehicle-submitForm").click(async function () {
    // Get form values
    const plate = $("#license-plate").val().trim();
    const apartment = $("#vehicle-apartment-id").val().trim();
    const type = $("#vehicle-type").val();
    const status = $("#vehicle-status").val();

    console.log(type);

    // Validation: Check if all fields are filled
    if (!plate || !apartment || !type || !status) {
        alert("Please fill in all fields before submitting.");
        return;
    }
    const resident_data = {
        plate: plate,
        apartment: apartment,
        type: type,
        status: status
    };

    // Send data to the server
    try {
        // Send ADD request
        const response = await fetch("http://localhost:3000/api/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resident_data)
        });

        // Check if adding successful
        const data = await response.json(); // Get the response JSON
        if (response.ok) {
            alert("Succeed to add the vehicle.");
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
document.getElementById("vehicles-table").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is an edit button
    if (target.classList.contains("edit-btn") && target.id.includes("vehicle-edit-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const old_plate = row.children[0].textContent;
        const apartment = row.children[1].textContent;
        const type = row.children[2].textContent;
        const status = row.children[3].textContent;
        console.log("Edit vehicle:", old_plate);
        
        // Điền dữ liệu vào form
        document.getElementById("edit-license-plate").value = old_plate;
        document.getElementById("edit-vehicle-apartment-id").value = apartment;
        document.getElementById("edit-vehicle-type").value = type;
        document.getElementById("edit-vehicle-status").value = status;

        // Implement edit functionality here
        // Open form when clicking "Edit vehicle" button
        $("#edit-vehicle-form").fadeIn();

        // Close modal when clicking "Cancel" or "X" button
        $("#edit-vehicle-closeForm, #edit-vehicle-cancelForm").click(function () {
            $("#edit-vehicle-form").fadeOut();
            return;
        });

        // Submit form
        $("#edit-vehicle-submitForm").click(async function () {
            // Get form values
            const plate = $("#edit-license-plate").val().trim();
            const apartment = $("#edit-vehicle-apartment-id").val().trim();
            const type = $("#edit-vehicle-type").val().trim();
            const status = $("#edit-vehicle-status").val().trim();

            // Validation: Check if all fields are filled
            if (!plate || !apartment || !type || !status) {
                alert("Please fill in all fields before submitting.");
                return;
            }
            const edit_data = {
                old_plate: old_plate,
                plate: plate,
                apartment: apartment,
                type: type,
                status: status,
            };

            // Send data to the server
            try {
                const response = await fetch(`http://localhost:3000/api/vehicles/${encodeURIComponent(old_plate)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(edit_data)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Vehicle updated successfully!");
                    location.reload(); // Cập nhật bảng sau khi chỉnh sửa
                } else {
                    alert("Error updating vehicle: " + data.message);
                }
            } catch (error) {
                console.error("Error updating vehicle:", error);
                alert("Failed to update vehicle.");
            }
        });
    }
});

// DELETE
document.getElementById("vehicles-table").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is a delete button
    if (target.classList.contains("delete-btn") && target.id.includes("vehicle-delete-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const plate = row.children[0].textContent.trim(); 
        console.log("Delete vehicle:", plate);

        // Confirm deletion
        if (plate && confirm(`Are you sure you want to delete vehicle: ${plate}?`)) {
            try {
                // Send DELETE request
                const response = await fetch(`http://localhost:3000/api/vehicles/${encodeURIComponent(plate)}`, {
                    method: "DELETE"
                });

                // Check if deletion was successful
                const data = await response.json(); // Await response JSON
                if (response.ok) {
                    alert("Successfully deleted the vehicle.");
                    row.remove(); // Remove row from table without reloading
                } else {
                    alert(`Failed to delete the vehicle: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                alert("An error occurred while deleting.");
            }
        }
    }
});

// Fetch and display data
$(document).ready(fetchAndDisplayData());