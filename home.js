var teamList = document.getElementById("teamList");

// ---------- SHOW THE TEAM ----------
for (var i = 0; i < team.length; i++) {
    var person = team[i];
    teamList.innerHTML +=
        "<div class='card team-card'>" +
        "<img class='photo-big' src='" + person.photo + "' alt='" + person.name + "'>" +
        "<h3>" + person.name + "</h3>" +
        "<p>" + person.role + "</p>" +
        "</div>";
}
