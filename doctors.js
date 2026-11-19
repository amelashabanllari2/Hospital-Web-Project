var searchInput = document.getElementById("search");
var specialtySelect = document.getElementById("specialty");
var dayFilter = document.getElementById("dayFilter");
var sortSelect = document.getElementById("sortBy");
var countText = document.getElementById("countText");
var doctorList = document.getElementById("doctorList");

var bookingBox = document.getElementById("bookingBox");
var selectedDoctorText = document.getElementById("selectedDoctor");
var selectedDaysText = document.getElementById("selectedDays");
var bookingForm = document.getElementById("bookingForm");
var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");
var dateInput = document.getElementById("date");
var timeSelect = document.getElementById("time");
var errorBox = document.getElementById("errorBox");
var result = document.getElementById("result");
var cancelBtn = document.getElementById("cancelBtn");
var profileModal = document.getElementById("profileModal");
var profileContent = document.getElementById("profileContent");

var selectedDoctor = null;
setMinDate(dateInput);

function fillSpecialties() {
    var found = [];
    for (var i = 0; i < doctors.length; i++) {
        var alreadyThere = false;
        for (var j = 0; j < found.length; j++) {
            if (found[j] === doctors[i].specialty) {
                alreadyThere = true;
            }
        }
        if (alreadyThere === false) {
            found.push(doctors[i].specialty);
        }
    }
    for (var k = 0; k < found.length; k++) {
        specialtySelect.innerHTML += "<option value='" + found[k] + "'>" + found[k] + "</option>";
    }
}

function worksOn(doctor, day) {
    for (var i = 0; i < doctor.days.length; i++) {
        if (doctor.days[i] === day) {
            return true;
        }
    }
    return false;
}

function showDoctors() {
    var searchText = searchInput.value.toLowerCase().trim();
    var spec = specialtySelect.value;
    var dayValue = dayFilter.value;

    var found = [];
    for (var i = 0; i < doctors.length; i++) {
        var d = doctors[i];
        var okName = d.name.toLowerCase().indexOf(searchText) !== -1;
        var okSpec = (spec === "all" || d.specialty === spec);
        var okDay = (dayValue === "all" || worksOn(d, Number(dayValue)));

        if (okName && okSpec && okDay) {
            found.push(d);
        }
    }

    for (var a = 0; a < found.length; a++) {
        for (var b = 0; b < found.length - 1 - a; b++) {
            var swap = false;
            if (sortSelect.value === "name") {
                if (found[b].name > found[b + 1].name) { swap = true; }
            } else {
                if (found[b].experience < found[b + 1].experience) { swap = true; }
            }
            if (swap) {
                var temp = found[b];
                found[b] = found[b + 1];
                found[b + 1] = temp;
            }
        }
    }

    doctorList.innerHTML = "";
    for (var c = 0; c < found.length; c++) {
        var doc = found[c];
        doctorList.innerHTML +=
            "<div class='card clickable' onclick='showProfile(" + doc.id + ")'>" +
            "<img class='photo' src='" + doc.photo + "' alt='" + doc.name + "'>" +
            "<h3>" + doc.name + "</h3>" +
            "<p>Specialty: " + doc.specialty + "</p>" +
            "<p>Experience: " + doc.experience + " years</p>" +
            "<p>📅 Days: <strong>" + daysText(doc.days) + "</strong></p>" +
            "<p>🕐 Hours: " + doc.hours[0] + " - " + doc.hours[doc.hours.length - 1] + "</p>" +
            "<p class='link-hint'>Click the card to see the full profile</p>" +
            "<div class='btn-row'><button onclick='event.stopPropagation(); chooseDoctor(" + doc.id + ")'>Book appointment</button></div>" +
            "</div>";
    }

    countText.textContent = found.length + " doctor(s) found.";
}

function showProfile(id) {
    var doc = null;
    for (var i = 0; i < doctors.length; i++) {
        if (doctors[i].id === id) {
            doc = doctors[i];
        }
    }

    profileContent.innerHTML =
        "<div class='profile-top'>" +
        "<img src='" + doc.photo + "' alt='" + doc.name + "'>" +
        "<div><h3>" + doc.name + "</h3>" +
        "<p class='muted'>" + doc.specialty + " · " + doc.experience + " years of experience</p></div>" +
        "</div>" +
        "<p>" + doc.bio + "</p>" +
        "<div class='info-row'><span>🎓 Education</span>" + doc.education + "</div>" +
        "<div class='info-row'><span>🗣️ Languages</span>" + doc.languages + "</div>" +
        "<div class='info-row'><span>📍 Office</span>" + doc.room + "</div>" +
        "<div class='info-row'><span>📞 Phone</span>" + doc.phone + "</div>" +
        "<div class='info-row'><span>📅 Days</span><strong>" + daysText(doc.days) + "</strong></div>" +
        "<div class='info-row'><span>🕐 Time slots</span>" + doc.hours.join(", ") + "</div>" +
        "<div class='btn-row'><button onclick='closeProfile(); chooseDoctor(" + doc.id + ")'>Book appointment</button></div>";

    profileModal.classList.remove("hidden");
}

function closeProfile() {
    profileModal.classList.add("hidden");
}

profileModal.addEventListener("click", function (event) {
    if (event.target === profileModal) {
        closeProfile();
    }
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeProfile();
    }
});

function chooseDoctor(id) {
    for (var i = 0; i < doctors.length; i++) {
        if (doctors[i].id === id) {
            selectedDoctor = doctors[i];
        }
    }
    selectedDoctorText.textContent = selectedDoctor.name + " (" + selectedDoctor.specialty + ")";
    selectedDaysText.textContent = daysText(selectedDoctor.days);
    bookingBox.classList.remove("hidden");
    result.textContent = "";
    errorBox.textContent = "";
    dateInput.value = "";
    updateTimes();
    bookingBox.scrollIntoView();
}

function updateTimes() {
    timeSelect.innerHTML = "";

    if (dateInput.value === "") {
        timeSelect.innerHTML = "<option value=''>Choose a date first</option>";
        return;
    }

    if (worksOn(selectedDoctor, parseDate(dateInput.value).getDay()) === false) {
        timeSelect.innerHTML = "<option value=''>Not available on this day</option>";
        errorBox.textContent = selectedDoctor.name + " is only available on: " + daysText(selectedDoctor.days) + ".";
        return;
    }

    var freeCount = 0;
    for (var i = 0; i < selectedDoctor.hours.length; i++) {
        var hour = selectedDoctor.hours[i];
        if (isSlotTaken(selectedDoctor.id, dateInput.value, hour)) {
            timeSelect.innerHTML += "<option value='' disabled>" + hour + " (booked)</option>";
        } else {
            timeSelect.innerHTML += "<option value='" + hour + "'>" + hour + "</option>";
            freeCount = freeCount + 1;
        }
    }

    if (freeCount === 0) {
        errorBox.textContent = "All time slots are booked on this day. Please choose another date.";
    } else {
        errorBox.textContent = "";
    }
}

dateInput.addEventListener("change", function () {
    result.textContent = "";
    updateTimes();
});

cancelBtn.addEventListener("click", function () {
    bookingBox.classList.add("hidden");
});

searchInput.addEventListener("input", showDoctors);
specialtySelect.addEventListener("change", showDoctors);
dayFilter.addEventListener("change", showDoctors);
sortSelect.addEventListener("change", showDoctors);

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    try {
        checkName(nameInput.value.trim());
        checkEmail(emailInput.value.trim());
        checkPhone(phoneInput.value.trim());
        checkDate(dateInput.value);
        checkDoctorDay(selectedDoctor, dateInput.value);

        if (timeSelect.value === "") {
            throw new Error("Please choose a free time.");
        }
        if (isSlotTaken(selectedDoctor.id, dateInput.value, timeSelect.value)) {
            throw new Error("Sorry, this time has just been booked. Please choose another one.");
        }

        var list = getAppointments();
        var newAppointment = {
            id: Date.now(),
            type: "Appointment",
            doctorId: selectedDoctor.id,
            title: selectedDoctor.name + " (" + selectedDoctor.specialty + ")",
            patient: nameInput.value.trim(),
            date: dateInput.value,
            time: timeSelect.value,
            price: 0,
            status: "Active"
        };
        list.push(newAppointment);
        saveAppointments(list);

        result.textContent = "Appointment confirmed with " + selectedDoctor.name + " on " + newAppointment.date + " at " + newAppointment.time + ". See 'My appointments'.";
        bookingForm.reset();
        updateTimes();
        errorBox.textContent = "";
    }
    catch (error) {
        errorBox.textContent = error.message;
        result.textContent = "";
    }
    finally {
        console.log("Check finished");
    }
});

fillSpecialties();
showDoctors();