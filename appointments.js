var appointmentList = document.getElementById("appointmentList");
var statusFilter = document.getElementById("statusFilter");
var typeFilter = document.getElementById("typeFilter");
var countText = document.getElementById("countText");

var warningBox = document.getElementById("warningBox");
var warningText = document.getElementById("warningText");
var yesBtn = document.getElementById("yesBtn");
var noBtn = document.getElementById("noBtn");
var messageBox = document.getElementById("messageBox");

var pendingId = null;

function showAppointments() {
    var list = getAppointments();
    appointmentList.innerHTML = "";
    var count = 0;

    for (var i = 0; i < list.length; i++) {
        var a = list[i];

        var okStatus = (statusFilter.value === "all" || a.status === statusFilter.value);
        var okType = (typeFilter.value === "all" || a.type === typeFilter.value);

        if (okStatus && okType) {
            var statusClass = "active";
            var buttons = "<button class='danger' onclick='askCancel(" + a.id + ")'>Cancel</button>";

            if (a.status === "Cancelled") {
                statusClass = "cancelled";
                buttons = "<button onclick='deleteAppointment(" + a.id + ")'>Delete</button>";
            }

            var title = "Doctor appointment";
            var timeText = "Date: " + a.date + " at " + a.time;
            if (a.type === "Tests") {
                title = "Tests";
                timeText = "Date: " + a.date;
            }
            if (a.type === "Order") {
                title = "Herbal products order";
                timeText = "Pick-up date: " + a.date;
            }

            var priceText = "";
            if (a.price > 0) {
                priceText = "<p>Price: " + a.price + " ALL</p>";
            }

            var readyText = "";
            if (a.type === "Tests" && a.readyDate) {
                readyText = "<p>Results ready by: <strong>" + a.readyDate + "</strong></p>";
            }

            appointmentList.innerHTML +=
                "<div class='card'>" +
                "<h3>" + title + "</h3>" +
                "<p>" + a.title + "</p>" +
                "<p>Patient: " + a.patient + "</p>" +
                "<p>" + timeText + "</p>" +
                priceText +
                readyText +
                "<p>Status: <span class='" + statusClass + "'>" + a.status + "</span></p>" +
                buttons +
                "</div>";
            count = count + 1;
        }
    }

    if (count === 0) {
        appointmentList.innerHTML = "<p>There is nothing to show.</p>";
    }
    countText.textContent = "Total: " + count;
}

function askCancel(id) {
    var list = getAppointments();
    var name = "";
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            name = list[i].title;
        }
    }

    pendingId = id;
    messageBox.textContent = "";
    warningText.textContent = "⚠️ Are you sure you want to cancel: " + name + "?";
    warningBox.classList.remove("hidden");
    window.scrollTo(0, 0);
}


yesBtn.addEventListener("click", function () {
    var list = getAppointments();
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === pendingId) {
            list[i].status = "Cancelled";
        }
    }
    saveAppointments(list);

    pendingId = null;
    warningBox.classList.add("hidden");
    messageBox.textContent = "Cancelled successfully.";
    showAppointments();
});


noBtn.addEventListener("click", function () {
    pendingId = null;
    warningBox.classList.add("hidden");
});

function deleteAppointment(id) {
    var list = getAppointments();
    var newList = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].id !== id) {
            newList.push(list[i]);
        }
    }
    saveAppointments(newList);
    messageBox.textContent = "";
    showAppointments();
}

statusFilter.addEventListener("change", showAppointments);
typeFilter.addEventListener("change", showAppointments);

showAppointments();
