

var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


function getAppointments() {
    var text = localStorage.getItem("appointments");
    if (text === null) {
        return [];
    }
    return JSON.parse(text);
}

function saveAppointments(list) {
    localStorage.setItem("appointments", JSON.stringify(list));
}

function parseDate(value) {
    return new Date(value + "T00:00:00");
}

function formatDate(d) {
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    return year + "-" + month + "-" + day;
}


function addDays(value, n) {
    var d = parseDate(value);
    d.setDate(d.getDate() + n);
    return formatDate(d);
}


function setMinDate(input) {
    input.min = formatDate(new Date());
}

function daysText(days) {
    var text = "";
    for (var i = 0; i < days.length; i++) {
        if (i > 0) {
            text = text + ", ";
        }
        text = text + shortDays[days[i]];
    }
    return text;
}


function resultsText(n) {
    if (n === 0) {
        return "Same day";
    }
    if (n === 1) {
        return "1 day";
    }
    return n + " days";
}


function isSlotTaken(doctorId, date, time) {
    var list = getAppointments();
    for (var i = 0; i < list.length; i++) {
        var a = list[i];
        if (a.type === "Appointment" && a.status === "Active" && a.doctorId === doctorId && a.date === date && a.time === time) {
            return true;
        }
    }
    return false;
}

function checkName(value) {
    if (value.length < 3) {
        throw new Error("Name must have at least 3 characters.");
    }
}

function checkEmail(value) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) {
        throw new Error("Enter a valid email.");
    }
}

function checkPhone(value) {
    var pattern = /^[0-9+ ]{8,15}$/;
    if (!pattern.test(value)) {
        throw new Error("Enter a valid phone number.");
    }
}

function checkDate(value) {
    if (value === "") {
        throw new Error("Please choose a date.");
    }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var chosen = parseDate(value);
    if (chosen < today) {
        throw new Error("The date cannot be in the past.");
    }
}

// the doctor must work on the chosen day
function checkDoctorDay(doctor, value) {
    var day = parseDate(value).getDay();
    var works = false;
    for (var i = 0; i < doctor.days.length; i++) {
        if (doctor.days[i] === day) {
            works = true;
        }
    }
    if (works === false) {
        throw new Error(doctor.name + " is only available on: " + daysText(doctor.days) + ".");
    }
}


function checkTestDay(value) {
    if (parseDate(value).getDay() === 0) {
        throw new Error("We do not do tests on Sundays. Please choose Monday to Saturday.");
    }
}


function checkPharmacyDay(value) {
    if (parseDate(value).getDay() === 0) {
        throw new Error("The pharmacy is closed on Sundays. Please choose Monday to Saturday.");
    }
}
