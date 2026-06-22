const tracks = [
    {
        code: "AUS",
        grandPrix: "Australian Grand Prix",
        circuit: "Albert Park"
    },
    {
        code: "CHN",
        grandPrix: "Chinese Grand Prix",
        circuit: "Shanghai International Circuit"
    },
    {
        code: "JPN",
        grandPrix: "Japanese Grand Prix",
        circuit: "Suzuka"
    },
    {
        code: "BHR",
        grandPrix: "Bahrain Grand Prix",
        circuit: "Bahrain International Circuit"
    },
    {
        code: "SAU",
        grandPrix: "Saudi Arabian Grand Prix",
        circuit: "Jeddah Corniche Circuit"
    },
    {
        code: "MIA",
        grandPrix: "Miami Grand Prix",
        circuit: "Miami International Autodrome"
    },
    {
        code: "EMI",
        grandPrix: "Emilia Romagna Grand Prix",
        circuit: "Imola"
    },
    {
        code: "MON",
        grandPrix: "Monaco Grand Prix",
        circuit: "Circuit de Monaco"
    },
    {
        code: "ESP",
        grandPrix: "Spanish Grand Prix",
        circuit: "Circuit de Barcelona-Catalunya"
    },
    {
        code: "CAN",
        grandPrix: "Canadian Grand Prix",
        circuit: "Circuit Gilles Villeneuve"
    },
    {
        code: "AUT",
        grandPrix: "Austrian Grand Prix",
        circuit: "Red Bull Ring"
    },
    {
        code: "AUT-R",
        grandPrix: "Austrian Grand Prix",
        circuit: "Red Bull Ring (R)"
    },
    {
        code: "GBR",
        grandPrix: "British Grand Prix",
        circuit: "Silverstone"
    },
    {
        code: "GBR-R",
        grandPrix: "British Grand Prix",
        circuit: "Silverstone (R)"
    },
    {
        code: "BEL",
        grandPrix: "Belgian Grand Prix",
        circuit: "Spa-Francorchamps"
    },
    {
        code: "HUN",
        grandPrix: "Hungarian Grand Prix",
        circuit: "Hungaroring"
    },
    {
        code: "NED",
        grandPrix: "Dutch Grand Prix",
        circuit: "Zandvoort"
    },
    {
        code: "NED-R",
        grandPrix: "Dutch Grand Prix",
        circuit: "Zandvoort (R)"
    },
    {
        code: "ITA",
        grandPrix: "Italian Grand Prix",
        circuit: "Monza"
    },
    {
        code: "AZE",
        grandPrix: "Azerbaijan Grand Prix",
        circuit: "Baku City Circuit"
    },
    {
        code: "SGP",
        grandPrix: "Singapore Grand Prix",
        circuit: "Marina Bay"
    },
    {
        code: "USA",
        grandPrix: "United States Grand Prix",
        circuit: "Circuit of the Americas"
    },
    {
        code: "MEX",
        grandPrix: "Mexico City Grand Prix",
        circuit: "Autódromo Hermanos Rodríguez"
    },
    {
        code: "BRA",
        grandPrix: "São Paulo Grand Prix",
        circuit: "Interlagos"
    },
    {
        code: "LVG",
        grandPrix: "Las Vegas Grand Prix",
        circuit: "Las Vegas Strip Circuit"
    },
    {
        code: "QAT",
        grandPrix: "Qatar Grand Prix",
        circuit: "Lusail"
    },
    {
        code: "ABD",
        grandPrix: "Abu Dhabi Grand Prix",
        circuit: "Yas Marina"
    }
];

function getTrack(code) {
    return tracks.find(track => track.code === code);
}

let player1 = "Player 1";
let player2 = "Player 2";
let seasonLength = 10;
let picksPerPlayer = 6;
let player1Picks = [];
let player2Picks = [];

let currentPlayer = 1;

function initSeasonUI() {

    const defaultCard =
        document.querySelector('.season-card[data-length="10"]');

    if (defaultCard) {
        selectSeason(10, defaultCard);
    }
}

function selectSeason(length, element) {

    seasonLength = length;

    document.getElementById("season-info").textContent =
    length === 10
        ? "6 picks per driver"
        : "9 picks per driver";

    picksPerPlayer =
        length === 10 ? 6 : 9;

    document
        .querySelectorAll(".season-card")
        .forEach(card =>
            card.classList.remove("selected"));

    element.classList.add("selected");
}

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

    document.getElementById("selection-limit").textContent =
    picksPerPlayer;
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
        card.dataset.track = track.code;

        card.innerHTML = `
           <div class="track-main">${track.circuit}</div>
           <div class="track-sub">${track.grandPrix}</div>
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
        && selected.length >= picksPerPlayer
    ) {
        return;
    }

    card.classList.toggle("selected");

    updateSelectionDisplay();
}

function updateSelectionDisplay() {
    const selected =
        [...document.querySelectorAll(".track.selected")];

    // remove all existing numbers first (clean slate approach)
    document.querySelectorAll(".pick-number").forEach(el => el.remove());

    selected.forEach((card, index) => {
        const number = document.createElement("div");
        number.className = "pick-number";
        number.textContent = index + 1;
        card.prepend(number);
    });

    document.getElementById("selection-count")
        .textContent = selected.length;
}

function submitDraft() {

    const selected =
        [...document.querySelectorAll(".track.selected")]
        .map(card => card.dataset.track);

    if (selected.length !== picksPerPlayer) {

        alert(`Please select exactly ${picksPerPlayer} tracks.`);

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
        season.length < seasonLength &&
        shuffled.length > 0
    ) {
        season.push(shuffled.pop());
    }
    const usedTrackCodes =
    season.map(race => race.track);

    const randomPool =
    tracks.filter(track =>
        !usedTrackCodes.includes(track.code)
    );
    const shuffledRandomPool =
    shuffle(randomPool);
    while (
    season.length < seasonLength &&
    shuffledRandomPool.length > 0
    ) {

    const randomTrack =
        shuffledRandomPool.pop();

    season.push({
        track: randomTrack.code,
        type: "random",
        source: "🎲 FIA Selection"
    });
    }

    season.sort((a, b) => {
    const aIndex =
        tracks.findIndex(track => track.code === a.track);

    const bIndex =
        tracks.findIndex(track => track.code === b.track);

    return aIndex - bIndex;
    });

    const calendar =
        document.getElementById("calendar");

    calendar.innerHTML = "";

    season.forEach((race, index) => {

        calendar.innerHTML += `
            <div class="race ${race.type}">
                <strong>Round ${index + 1}</strong>
                <br>
                ${getTrack(race.track).circuit}
                <br>
                <small>${getTrack(race.track).grandPrix}</small>
                <br>
                <small>${race.source}</small>
            </div>
        `;
    });
}