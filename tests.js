// ---------- ELEMENTS ----------
var searchInput = document.getElementById("search");
var sortSelect = document.getElementById("sortBy");
var countText = document.getElementById("countText");
var testList = document.getElementById("testList");

var selectedList = document.getElementById("selectedList");
var totalText = document.getElementById("total");
var selectedCountText = document.getElementById("selectedCount");
var selectError = document.getElementById("selectError");
var confirmBtn = document.getElementById("confirmBtn");
var clearBtn = document.getElementById("clearBtn");

var confirmBox = document.getElementById("confirmBox");
var testForm = document.getElementById("testForm");
var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");
var dateInput = document.getElementById("date");
var errorBox = document.getElementById("errorBox");
var result = document.getElementById("result");

// list with the ids of the selected tests
var selected = [];
setMinDate(dateInput);

// ---------- IS IT SELECTED? ----------
function isSelected(id) {
    for (var i = 0; i < selected.length; i++) {
        if (selected[i] === id) {
            return true;
        }
    }
    return false;
}

// ---------- SHOW TESTS ----------
function showTests() {
    var searchText = searchInput.value.toLowerCase().trim();

    // 1) collect the tests that match the search
    var found = [];
    for (var i = 0; i < tests.length; i++) {
        if (tests[i].name.toLowerCase().indexOf(searchText) !== -1) {
            found.push(tests[i]);
        }
    }

    // 2) sorting (bubble sort)
    for (var a = 0; a < found.length; a++) {
        for (var b = 0; b < found.length - 1 - a; b++) {
            var swap = false;
            if (sortSelect.value === "name") {
                if (found[b].name > found[b + 1].name) { swap = true; }
            } else if (sortSelect.value === "priceLow") {
                if (found[b].price > found[b + 1].price) { swap = true; }
            } else {
                if (found[b].price < found[b + 1].price) { swap = true; }
            }
            if (swap) {
                var temp = found[b];
                found[b] = found[b + 1];
                found[b + 1] = temp;
            }
        }
    }

    // 3) display
    testList.innerHTML = "";
    for (var c = 0; c < found.length; c++) {
        var t = found[c];
        var cardClass = "card";
        var button = "<button onclick='toggleTest(" + t.id + ")'>Add</button>";

        if (isSelected(t.id)) {
            cardClass = "card selected";
            button = "<button class='danger' onclick='toggleTest(" + t.id + ")'>Remove</button>";
        }

        testList.innerHTML +=
            "<div class='" + cardClass + "'>" +
            "<div class='avatar'>🧪</div>" +
            "<h3>" + t.name + "</h3>" +
            "<p class='price'>" + t.price + " ALL</p>" +
            "<p>Results: " + resultsText(t.resultDays) + "</p>" +
            button +
            "</div>";
    }

    countText.textContent = found.length + " test(s) found.";
}

// ---------- ADD / REMOVE ----------
function toggleTest(id) {
    if (isSelected(id)) {
        var newList = [];
        for (var i = 0; i < selected.length; i++) {
            if (selected[i] !== id) {
                newList.push(selected[i]);
            }
        }
        selected = newList;
    } else {
        selected.push(id);
    }

    selectError.textContent = "";
    result.innerHTML = "";
    showTests();
    showSummary();
}

// ---------- SUMMARY AND TOTAL ----------
function showSummary() {
    var total = 0;
    selectedList.innerHTML = "";

    for (var i = 0; i < selected.length; i++) {
        for (var j = 0; j < tests.length; j++) {
            if (tests[j].id === selected[i]) {
                total = total + tests[j].price;
                selectedList.innerHTML +=
                    "<div class='sel-row'>" +
                    "<span>" + tests[j].name + "</span>" +
                    "<strong>" + tests[j].price + "</strong>" +
                    "</div>";
            }
        }
    }

    if (selected.length === 0) {
        selectedList.innerHTML = "<p class='muted'>No tests selected.</p>";
        confirmBox.classList.add("hidden");
    }

    totalText.textContent = total;
    selectedCountText.textContent = selected.length;
}

// ---------- CLEAR ----------
clearBtn.addEventListener("click", function () {
    selected = [];
    selectError.textContent = "";
    result.innerHTML = "";
    showTests();
    showSummary();
});

// ---------- CONFIRM (shows the form) ----------
confirmBtn.addEventListener("click", function () {
    result.innerHTML = "";

    if (selected.length === 0) {
        selectError.textContent = "Please select at least one test.";
        return;
    }

    selectError.textContent = "";
    errorBox.textContent = "";
    confirmBox.classList.remove("hidden");
    confirmBox.scrollIntoView();
});

// ---------- FINISH (saves the tests) ----------
testForm.addEventListener("submit", function (event) {
    event.preventDefault();

    try {
        if (selected.length === 0) {
            throw new Error("Please select at least one test.");
        }

        checkName(nameInput.value.trim());
        checkEmail(emailInput.value.trim());
        checkPhone(phoneInput.value.trim());
        checkDate(dateInput.value);
        checkTestDay(dateInput.value);

        // names, total and the longest waiting time for results
        var names = "";
        var total = 0;
        var maxDays = 0;
        for (var i = 0; i < selected.length; i++) {
            for (var j = 0; j < tests.length; j++) {
                if (tests[j].id === selected[i]) {
                    if (i > 0) {
                        names = names + ", ";
                    }
                    names = names + tests[j].name;
                    total = total + tests[j].price;
                    if (tests[j].resultDays > maxDays) {
                        maxDays = tests[j].resultDays;
                    }
                }
            }
        }

        var date = dateInput.value;
        var readyDate = addDays(date, maxDays);

        var list = getAppointments();
        var newAppointment = {
            id: Date.now(),
            type: "Tests",
            title: names,
            patient: nameInput.value.trim(),
            date: date,
            time: "08:00",
            price: total,
            readyDate: readyDate,
            status: "Active"
        };
        list.push(newAppointment);
        saveAppointments(list);

        // message with visiting hours and results time
        var message = "<p>✅ Your tests are confirmed for <strong>" + date + "</strong>. Total: <strong>" + total + " ALL</strong>.</p>";
        message = message + "<p>🏥 You can come to us to do the tests:<br>" +
            "Monday - Friday: 08:00 - 20:00<br>" +
            "Saturday: 08:00 - 14:00<br>" +
            "Sunday: closed for tests</p>";

        message = message + "<p>🧾 Results time:</p>";
        for (var k = 0; k < selected.length; k++) {
            for (var m = 0; m < tests.length; m++) {
                if (tests[m].id === selected[k]) {
                    message = message + "<p>• " + tests[m].name + ": " + resultsText(tests[m].resultDays) + "</p>";
                }
            }
        }
        message = message + "<p>All your results will be ready by <strong>" + readyDate + "</strong>.</p>";
        result.innerHTML = message;

        errorBox.textContent = "";
        testForm.reset();
        confirmBox.classList.add("hidden");
        selected = [];
        showTests();
        showSummary();
        result.scrollIntoView();
    }
    catch (error) {
        errorBox.textContent = error.message;
        result.innerHTML = "";
    }
    finally {
        console.log("Check finished");
    }
});

// ---------- FILTER EVENTS ----------
searchInput.addEventListener("input", showTests);
sortSelect.addEventListener("change", showTests);

// ---------- START ----------
showTests();
showSummary();
