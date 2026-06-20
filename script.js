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
        document.getElementById("player1-name").value.trim()
        || "Player 1";

    player2 =
        document.getElementById("player2-name").value.trim()
        || "Player 2";

    document.getElementById("setup-screen")
        .classList.add("hidden");

    document.getElementById("draft-screen")
        .classList.remove("hidden");

    buildTrackGrid();
}

function buildTrackGrid() {

    const grid =
        document.getElementById("track-grid");

    grid.innerHTML = "";

    document.getElementById("selection-count")
        .textContent = "0";

    document.getElementById("draft-title")
        .textContent =
            currentPlayer === 1
            ? `${player1}'s Draft`
            : `${player2}'s Draft`;

    tracks.forEach(track => {

        const card =
            document.createElement("div");

        card.className = "track";
        card.dataset.track = track;

        card.innerHTML = `
            <div class="track-name">${track}</div>
        `;

        card.addEventListener("click", () => {
            toggleTrack(card);
        });

        grid.appendChild(card);
    });
}

function toggleTrack(card) {

    const selected =
        document.querySelectorAll(".track.selected");

    if (
        !card.classList.contains("selected")
        && selected.length >= 5
    ) {
        return;
    }

    card.classList.toggle("selected");

    updateSelectionDisplay();
}

function updateSelectionDisplay() {

    const selected =
        [...document.querySelectorAll(".track.selected")];

    selected.forEach((card, index) => {

        const existing =
            card.querySelector(".pick-number");

        if (existing) {
            existing.remove();
        }

        const number =
            document.createElement("div");

        number.className = "pick-number";
        number.textContent = index + 1;

        card.prepend(number);
    });

    document
        .querySelectorAll(".track:not(.selected) .pick-number")
        .forEach(el => el.remove());

    document.getElementById("selection-count")
        .textContent = selected.length;
}

function submitDraft() {

    const selected =
        [...document.querySelectorAll(".track.selected")]
        .map(card => card.dataset.track);

    if (selected.length !== 5) {

        alert("Please select exactly 5 tracks.");

        return;
    }

    if (currentPlayer === 1) {

        player1Picks = selected;

        document.getElementById("draft-screen")
            .classList.add("hidden");

        document.getElementById("handoff-screen")
            .classList.remove("hidden");

        document.getElementById("handoff-text")
            .textContent =
            `Pass the device to ${player2}.`;

    } else {

        player2Picks = selected;

        document.getElementById("draft-screen")
            .classList.add("hidden");

        document.getElementById("results-screen")
            .classList.remove("hidden");

        generateSeason();
    }
}

function beginPlayer2() {

    currentPlayer = 2;

    document.getElementById("handoff-screen")
        .classList.add("hidden");

    document.getElementById("draft-screen")
        .classList.remove("hidden");

    buildTrackGrid();
}

function shuffle(array) {

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] =
            [copy[j], copy[i]];
    }

    return copy;
}

function generateSeason() {

    const shared =
        player1Picks.filter(track =>
            player2Picks.includes(track));

    const season = [];

    shared.forEach(track => {

        season.push({
            track,
            type: "shared",
            source: "🤝 Both Players"
        });

    });

    const pool = [];

    player1Picks
        .filter(track => !shared.includes(track))
        .forEach(track => {

            pool.push({
                track,
                type: "p1",
                source: `👤 ${player1}`
            });

        });

    player2Picks
        .filter(track => !shared.includes(track))
        .forEach(track => {

            pool.push({
                track,
                type: "p2",
                source: `👤 ${player2}`
            });

        });

    const shuffled =
        shuffle(pool);

    while (
        season.length < 8 &&
        shuffled.length > 0
    ) {
        season.push(shuffled.pop());
    }

    season.sort(
        (a, b) =>
        tracks.indexOf(a.track)
        - tracks.indexOf(b.track)
    );

    const calendar =
        document.getElementById("calendar");

    calendar.innerHTML = "";

    season.forEach((race, index) => {

        calendar.innerHTML += `
            <div class="race ${race.type}">
                <strong>Round ${index + 1}</strong>
                <br>
                ${race.track}
                <br>
                <small>${race.source}</small>
            </div>
        `;
    });
}