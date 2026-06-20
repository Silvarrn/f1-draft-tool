const tracks = [
    "Australia",
    "China",
    "Japan",
    "Bahrain",
    "Saudi Arabia",
    "Miami",
    "Emilia Romagna",
    "Monaco",
    "Spain",
    "Canada",
    "Austria",
    "Great Britain",
    "Belgium",
    "Hungary",
    "Netherlands",
    "Italy",
    "Azerbaijan",
    "Singapore",
    "United States",
    "Mexico",
    "Brazil",
    "Las Vegas",
    "Qatar",
    "Abu Dhabi"
];

let player1 = "Player 1";
let player2 = "Player 2";

let player1Picks = [];
let player2Picks = [];

let currentPlayer = 1;

function startDraft() {

    player1 =
        document.getElementById("player1Name").value || "Player 1";

    player2 =
        document.getElementById("player2Name").value || "Player 2";

    document.getElementById("nameScreen").classList.add("hidden");
    document.getElementById("draftScreen").classList.remove("hidden");

    buildTrackList();
}

function buildTrackList() {

    document.getElementById("selectionCount").textContent = 0;

    const grid = document.getElementById("trackGrid");

    grid.innerHTML = "";

    document.getElementById("draftTitle").textContent =
        currentPlayer === 1
            ? `${player1}'s Picks`
            : `${player2}'s Picks`;

    tracks.forEach(track => {

        const label = document.createElement("label");

        label.className = "track";

        label.innerHTML = `
            <input type="checkbox" value="${track}">
            ${track}
        `;

        grid.appendChild(label);
    });

    grid.addEventListener("change", updateCounter);
}

function updateCounter() {

    const count =
        document.querySelectorAll("#trackGrid input:checked").length;

    document.getElementById("selectionCount").textContent = count;

    if (count > 5) {
        event.target.checked = false;
    }
}

function submitDraft() {

    const selected =
        [...document.querySelectorAll("#trackGrid input:checked")]
            .map(x => x.value);

    if (selected.length !== 5) {
        alert("Select exactly 5 tracks.");
        return;
    }

    if (currentPlayer === 1) {

        player1Picks = selected;

        document.getElementById("draftScreen").classList.add("hidden");
        document.getElementById("handoffScreen").classList.remove("hidden");

    } else {

        player2Picks = selected;

        document.getElementById("draftScreen").classList.add("hidden");
        document.getElementById("resultScreen").classList.remove("hidden");

        generateSeason();
    }
}

function beginPlayer2() {

    currentPlayer = 2;

    document.getElementById("handoffScreen").classList.add("hidden");
    document.getElementById("draftScreen").classList.remove("hidden");

    buildTrackList();
}

function shuffle(array) {

    return [...array]
        .sort(() => Math.random() - 0.5);
}

function generateSeason() {

    const shared =
        player1Picks.filter(x => player2Picks.includes(x));

    const pool = [];

    player1Picks
        .filter(x => !shared.includes(x))
        .forEach(track =>
            pool.push({
                track,
                type: "p1",
                source: player1
            }));

    player2Picks
        .filter(x => !shared.includes(x))
        .forEach(track =>
            pool.push({
                track,
                type: "p2",
                source: player2
            }));

    const season = shared.map(track => ({
        track,
        type: "shared",
        source: "Both Players"
    }));

    shuffle(pool)
        .slice(0, 8 - season.length)
        .forEach(x => season.push(x));

    season.sort(
        (a,b) =>
        tracks.indexOf(a.track) -
        tracks.indexOf(b.track)
    );

    const calendar =
        document.getElementById("calendar");

    calendar.innerHTML = "";

    season.forEach((race,index) => {

        calendar.innerHTML += `
            <div class="race ${race.type}">
                <strong>Round ${index+1}</strong><br>
                ${race.track}<br>
                <small>${race.source}</small>
            </div>
        `;
    });
}