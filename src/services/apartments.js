// Function to populate the table
async function fetchAndDisplayData() {
    try {
        const response = await fetch("http://localhost:3000/api/apartments");
        const data = await response.json();

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = ""; // Clear existing data

        data.forEach((item) => {
            const row = `
              <tr data-id="${item['apartment_id']}">
                  <td>${item['apartment_id']}</td>
                  <td>${item['bedrooms']}</td>
                  <td>${item['bathrooms']}</td>
                  <td>${item['loggias']}</td>
                  <td>${item['area']}</td>
                  <td>${item['resident_count']}</td>
                  <td>${item['vehicle_count']}</td>
                  <td>
                      <button class="edit-btn" id="apartment-edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button class="delete-btn" id="apartment-delete-btn"><i class="fa-solid fa-trash"></i></button>
                  </td>
              </tr>
          `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Initialize DataTable if not already initialized
        table = $('#apartmentTable').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[0, "asc"]], // You can modify the column index and order here
            searching: true,
            paging: true,
            responsive: true,
            columnDefs: [
                {
                    targets: 7, // Cột cuối cùng (Action column)
                    orderable: false // Tắt tính năng sắp xếp cho cột này
                }
            ]
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// ADD
// Open form when clicking "Add Apartment" button
$("#addApartmentBtn").click(function () {
    $("#addApartmentForm").fadeIn();
});

// Close modal when clicking "Cancel" or "X" button
$("#add-apartment-closeForm, #add-apartment-cancelForm").click(function () {
    $("#addApartmentForm").fadeOut();
});

// Submit form
$("#add-apartment-submitForm").click(async function () {
    // Get form values
    const apartmentId = $("#apartmentId").val().trim();
    const bedrooms = $("#bedrooms").val().trim();
    const bathrooms = $("#bathrooms").val().trim();
    const logia = $("#logia").val().trim();
    const area = $("#area").val().trim();

    // Validation: Check if all fields are filled
    if (!apartmentId || !bedrooms || !bathrooms || !logia || !area) {
        alert("Please fill in all fields before submitting.");
        return;
    }
    const apartmentData = {
        apartmentId: $("#apartmentId").val(),
        bedrooms: $("#bedrooms").val(),
        bathrooms: $("#bathrooms").val(),
        logia: $("#logia").val(),
        area: $("#area").val()
    };

    // Send data to the server
    try {
        // Send ADD request
        const response = await fetch("http://localhost:3000/api/apartments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apartmentData)
        });

        // Check if adding successful
        const data = await response.json(); // Get the response JSON
        if (response.ok) {
            alert("Succeed to add the apartment.");
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
document.getElementById("apartmentTable").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is an edit button
    if (target.classList.contains("edit-btn") && target.id.includes("apartment-edit-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const old_apartmentId = row.children[0].textContent;
        const apartmentId = row.children[0].textContent; // Get the "Căn hộ" value
        const soPhongNgu = row.children[1].textContent;
        const soWc = row.children[2].textContent;
        const soLogia = row.children[3].textContent;
        const dienTich = row.children[4].textContent;
        console.log("Edit apartment:", apartmentId);

        // Điền dữ liệu vào form
        document.getElementById("edit-apartmentId").value = apartmentId;
        document.getElementById("edit-bedrooms").value = soPhongNgu;
        document.getElementById("edit-bathrooms").value = soWc;
        document.getElementById("edit-logia").value = soLogia;
        document.getElementById("edit-area").value = dienTich;

        // Implement edit functionality here
        // Open form when clicking "Edit Apartment" button
        $("#editApartmentForm").fadeIn();

        // Close modal when clicking "Cancel" or "X" button
        $("#edit-apartment-closeForm, #edit-apartment-cancelForm").click(function () {
            $("#editApartmentForm").fadeOut();
            return;
        });

        // Submit form
        $("#edit-apartment-submitForm").click(async function () {
            // Get form values
            const apartmentId = $("#edit-apartmentId").val().trim();
            const bedrooms = $("#edit-bedrooms").val().trim();
            const bathrooms = $("#edit-bathrooms").val().trim();
            const logia = $("#edit-logia").val().trim();
            const area = $("#edit-area").val().trim();

            // Validation: Check if all fields are filled
            if (!apartmentId || !bedrooms || !bathrooms || !logia || !area) {
                alert("Please fill in all fields before submitting.");
                return;
            }
            const updatedData = {
                old_apartmentId: old_apartmentId,
                apartmentId: apartmentId,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                logia: logia,
                area: area
            };

            // Send data to the server
            try {
                const response = await fetch(`http://localhost:3000/api/apartments/${encodeURIComponent(apartmentId)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Apartment updated successfully!");
                    location.reload(); // Cập nhật bảng sau khi chỉnh sửa
                } else {
                    alert("Error updating apartment: " + data.message);
                }
            } catch (error) {
                console.error("Error updating apartment:", error);
                alert("Failed to update apartment.");
            }
        });
    }
});


// DELETE
document.getElementById("apartmentTable").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is a delete button
    if (target.classList.contains("delete-btn") && target.id.includes("apartment-delete-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const apartmentId = row.children[0].textContent.trim(); // Get the "Căn hộ" value
        console.log("Delete apartment:", apartmentId);

        // Confirm deletion
        if (apartmentId && confirm(`Are you sure you want to delete apartment: ${apartmentId}?`)) {
            try {
                // Send DELETE request
                const response = await fetch(`http://localhost:3000/api/apartments/${encodeURIComponent(apartmentId)}`, {
                    method: "DELETE"
                });

                // Check if deletion was successful
                const data = await response.json(); // Await response JSON
                if (response.ok) {
                    alert("Successfully deleted the apartment.");
                    row.remove(); // Remove row from table without reloading
                } else {
                    alert(`Failed to delete the apartment: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error("Error deleting apartment:", error);
                alert("An error occurred while deleting.");
            }
        }
    }
});

// Fetch and display data
$(document).ready(fetchAndDisplayData());