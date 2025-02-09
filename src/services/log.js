// Function to populate the table
async function fetchAndDisplayData() {
    try {
        const response = await fetch("http://localhost:3000/api/log");
        const data = await response.json();

        const tableBody = document.getElementById("log-table-body");
        tableBody.innerHTML = ""; // Clear existing data

        data.forEach((item) => {
            const row = `
              <tr>
                    <td>${item['id']}</td>
                    <td>${item['time']}</td>
                    <td>${item['time']}</td>
                    <td>${item['time']}</td>
                    <td>${item['license_plate']}</td>
                    <td>${item['direction']}</td>
              </tr>
          `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Initialize DataTable if not already initialized
        table = $('#log-table').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[3, "desc"]], // You can modify the column index and order here
            searching: true,
            paging: true,
            responsive: true,
            columnDefs: [
                {
                    targets: 1, // Cột thứ 2 (index = 1) là "time"
                    render: function (data, type, row) {
                        return new Date(data).toLocaleDateString(); // Chuyển đổi sang định dạng dễ đọc
                    }
                },
                {
                    targets: 2, // Cột thứ 2 (index = 1) là "time"
                    render: function (data, type, row) {
                        return new Date(data).toLocaleTimeString(); // Chuyển đổi sang định dạng dễ đọc
                    }
                },
                {
                    targets: 3, // Cột thứ 2 (index = 1) là "time"
                    render: function (data, type, row) {
                        return new Date(data).toLocaleString(); // Chuyển đổi sang định dạng dễ đọc
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// IN
$("#vehicle-in-btn").click(function () {
    $("#vehicle-in-form").fadeIn();
});

// Close modal when clicking "Cancel" or "X" button
$("#vehicle-in-cancelForm, #vehicle-in-closeForm").click(function () {
    $("#vehicle-in-form").fadeOut();
});

// Submit form
$("#vehicle-in-submitForm").click(async function () {
    // Get form values
    const plate = $("#vehicle-in-plate").val().trim();

    // Validation: Check if all fields are filled
    if (!plate) {
        alert("Please fill in all fields before submitting.");
        return;
    }
    const in_data = {
        plate: plate
    };

    // Send data to the server
    try {
        // Send ADD request
        const response = await fetch(`http://localhost:3000/api/vehicle-in/${encodeURIComponent(plate)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(in_data)
        });

        // Check if adding successful
        const data = await response.json(); // Get the response JSON
        if (response.ok) {
            alert("Succeed.");
            location.reload(); // Reloads the current page
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert(data.message);
    }
});

// OUT
$("#vehicle-out-btn").click(function () {
    $("#vehicle-out-form").fadeIn();
});

// Close modal when clicking "Cancel" or "X" button
$("#vehicle-out-cancelForm, #vehicle-out-closeForm").click(function () {
    $("#vehicle-out-form").fadeOut();
});

// Submit form
$("#vehicle-out-submitForm").click(async function () {
    // Get form values
    const plate = $("#vehicle-out-plate").val().trim();

    // Validation: Check if all fields are filled
    if (!plate) {
        alert("Please fill in all fields before submitting.");
        return;
    }
    const in_data = {
        plate: plate
    };

    // Send data to the server
    try {
        // Send ADD request
        const response = await fetch(`http://localhost:3000/api/vehicle-out/${encodeURIComponent(plate)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(in_data)
        });

        // Check if adding successful
        const data = await response.json(); // Get the response JSON
        if (response.ok) {
            alert("Succeed.");
            location.reload(); // Reloads the current page
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert(data.message);
    }
});

// Fetch and display data
$(document).ready(fetchAndDisplayData());