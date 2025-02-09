// Function to populate the table
async function fetchAndDisplayData() {
    try {
        const response = await fetch("http://localhost:3000/api/service-fees");
        const data = await response.json();

        const tableBody = document.getElementById("service-fee-table-body");
        tableBody.innerHTML = ""; // Clear existing data

        data.forEach((item) => {
            const row = `
              <tr>
                  <td>${item['id']}</td>
                  <td>${item['apartment_id']}</td>
                  <td>${item['time_period']}</td>
                  <td>${item['electricity_usage']}</td>
                  <td>${item['water_usage']}</td>
                  <td>${item['cleaning_fee']}</td>
                  <td>${item['parking_fee']}</td>
                  <td>${item['status']}</td>
                  <td>
                      <button class="edit-btn" id="service-fee-edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button class="delete-btn" id="service-fee-delete-btn"><i class="fa-solid fa-trash"></i></button>
                  </td>
              </tr>
          `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Initialize DataTable if not already initialized
        table = $('#service-fee-table').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[0, "desc"]], // You can modify the column index and order here
            searching: true,
            paging: true,
            responsive: true,
            columnDefs: [
                {
                    targets: 7, // Cột cuối cùng (Action column)
                    orderable: false // Tắt tính năng sắp xếp cho cột này
                },
                {
                    targets: 8, // Cột cuối cùng (Action column)
                    orderable: false // Tắt tính năng sắp xếp cho cột này
                },
                {
                    targets: 2, // Birth date column (adjust index if necessary)
                    render: function (data, type, row) {
                        if (type === "display" || type === "filter") {
                            const date = new Date(data);
                            return date.toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit' }); // Format as MM/YYYY
                        }
                        return data;
                    }
                },
                {
                    targets: 7, // Adjust the column index for the status column
                    render: function (data, type, row) {
                        if (type === "display" || type === "filter") {
                            if (data === "pending") {
                                // Return a clickable "Pay" button
                                return '<button class="pay-btn" id="service-fee-pay-btn">Pay</button>';
                            } else if (data === "paid") {
                                // Return a non-clickable button when status is "Paid"
                                return '<button class="pay-btn" id="service-fee-paid-btn" disabled>Paid</button>';
                            } else {
                                return data; // Return the other status as is
                            }
                        }
                        return data; // For other types of operations, return the raw data
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// ADD SINGLE
$("#add-single-service-fee").click(function () {
    $("#add-single-service-fee-form").fadeIn();
});

// Close modal when clicking "Cancel" or "X" button
$("#add-single-service-fee-closeForm, #add-single-service-fee-cancelForm").click(function () {
    $("#add-single-service-fee-form").fadeOut();
});

$("#add-single-service-fee-submitForm").click(async function () {
    // Get form values
    const id = $("#add-service-fee-apartment-id").val().trim();

    // Validation: Check if all fields are filled
    if (!id) {
        alert("Please fill in all fields before submitting.");
        return;
    }
    const add_data = {
        id: id
    };

    // Send data to the server
    try {
        const response = await fetch(`http://localhost:3000/api/service-fees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(add_data)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Add successfully!");
            location.reload(); // Cập nhật bảng sau khi chỉnh sửa
        } else {
            alert("Error add: " + data.message);
        }
    } catch (error) {
        console.error("Error add:", error);
        alert("Failed to add.");
    }
});

// ADD ALL
$("#add-monthly-service-fee").click(async function () {
    // Send data to the server
    try {
        // Send ADD request
        const response = await fetch("http://localhost:3000/api/service-fee-all", {
            method: "POST",
        });

        // Check if adding successful
        const data = await response.json(); // Get the response JSON
        if (response.ok) {
            alert("Succeed to add the data.");
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
document.getElementById("service-fee-table").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is an edit button
    if (target.classList.contains("edit-btn") && target.id.includes("service-fee-edit-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const old_id = row.children[0].textContent;
        const apartment = row.children[1].textContent;
        const time = row.children[2].textContent;
        const electric = row.children[3].textContent;
        const water = row.children[4].textContent;
        const clean = row.children[5].textContent;
        const parking = row.children[6].textContent;
        const status = row.children[6].textContent;
        console.log("Edit:", old_id);

        // Điền dữ liệu vào form
        document.getElementById("edit-service-fee-id").value = old_id;
        document.getElementById("edit-service-fee-apartment-id").value = apartment;
        document.getElementById("edit-service-fee-time").value = time;
        document.getElementById("edit-service-fee-electric").value = electric;
        document.getElementById("edit-service-fee-water").value = water;
        document.getElementById("edit-service-fee-clean").value = clean;
        document.getElementById("edit-service-fee-parking").value = parking;
        document.getElementById("edit-service-fee-status").value = status;

        // Implement edit functionality here
        // Open form when clicking "Edit Apartment" button
        $("#edit-service-fee-form").fadeIn();

        // Close modal when clicking "Cancel" or "X" button
        $("#edit-service-fee-closeForm, #edit-service-fee-cancelForm").click(function () {
            $("#edit-service-fee-form").fadeOut();
            return;
        });

        // Submit form
        $("#edit-service-fee-submitForm").click(async function () {
            // Get form values
            const id = $("#edit-service-fee-id").val().trim();
            const apartment = $("#edit-service-fee-apartment-id").val().trim();
            const time = $("#edit-service-fee-time").val().trim();
            const electric = $("#edit-service-fee-electric").val().trim();
            const water = $("#edit-service-fee-water").val().trim();
            const clean = $("#edit-service-fee-clean").val().trim();
            const parking = $("#edit-service-fee-parking").val().trim();
            const status = $("#edit-service-fee-status").val().trim();


            // Validation: Check if all fields are filled
            if (!id || !apartment || !time || !electric || !water || !clean || !parking || !status) {
                alert("Please fill in all fields before submitting.");
                return;
            }
            const edit_data = {
                old_id: old_id,
                id: id,
                apartment: apartment,
                time: time,
                electric: electric,
                water: water,
                clean: clean,
                parking: parking,
                status: status
            };

            // Send data to the server
            try {
                const response = await fetch(`http://localhost:3000/api/service-fee/${encodeURIComponent(id)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(edit_data)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Updated successfully!");
                    location.reload(); // Cập nhật bảng sau khi chỉnh sửa
                } else {
                    alert("Error updating: " + data.message);
                }
            } catch (error) {
                console.error("Error updating:", error);
                alert("Failed to update.");
            }
        });
    }
});

// DELETE
document.getElementById("service-fee-table").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is a delete button
    if (target.classList.contains("delete-btn") && target.id.includes("service-fee-delete-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const id = row.children[0].textContent.trim();
        console.log("Deleting ID:", id);

        // Confirm deletion
        if (id && confirm(`Are you sure you want to delete ID: ${id}?`)) {
            try {
                // Send DELETE request
                const response = await fetch(`http://localhost:3000/api/service-fee/${encodeURIComponent(id)}`, {
                    method: "DELETE"
                });

                // Check if deletion was successful
                const data = await response.json(); // Await response JSON
                if (response.ok) {
                    alert("Successfully deleted.");
                    row.remove(); // Remove row from table without reloading
                } else {
                    alert(`Failed to delete: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error("Error deleting:", error);
                alert("An error occurred while deleting.");
            }
        }
    }
});

// PAY
document.getElementById("service-fee-table").addEventListener("click", async function (event) {
    const target = event.target;

    // Check if the clicked element is a pay button
    if (target.id.includes("service-fee-pay-btn")) {
        const row = target.closest("tr"); // Get the closest row
        const id = row.children[0].textContent.trim();
        console.log("Paying ID:", id);

        // Confirm paying
        if (id && confirm(`Are you sure you want to pay ID: ${id}?`)) {
            const edit_data = {
                id: id
            };

            try {
                // Send PUT request
                const response = await fetch(`http://localhost:3000/api/pay-service-fee/${encodeURIComponent(id)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(edit_data)
                });

                // Check if paying was successful
                const data = await response.json(); // Await response JSON
                if (response.ok) {
                    alert("Successfully pay.");
                    location.reload();
                } else {
                    alert(`Failed to pay: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error("Error paying:", error);
                alert("An error occurred while paying.");
            }
        }
    }
});

// Fetch and display data
$(document).ready(fetchAndDisplayData());