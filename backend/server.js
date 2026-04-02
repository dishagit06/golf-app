// ================= BASE URL =================
const BASE_URL = "https://golf-app-grx0.onrender.com";

// ================= EMAIL VALIDATION =================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ================= LOGIN =================
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        document.getElementById("msg").innerText = data.message;

        if (data.access) {
            localStorage.setItem("email", email);
            window.location.href = "dashboard.html";
        }

    } catch (err) {
        document.getElementById("msg").innerText = "Server error";
    }
}


// ================= SIGNUP =================
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const plan = document.getElementById("plan").value;
        const charity = document.getElementById("charity").value;

        try {
            const res = await fetch(`${BASE_URL}/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, plan, charity })
            });

            const data = await res.json();
            document.getElementById("msg").innerText = data.message;

        } catch {
            document.getElementById("msg").innerText = "Server error";
        }
    });
}


// ================= DASHBOARD LOAD =================
window.addEventListener("load", () => {
    if (window.location.pathname.includes("dashboard")) {
        loadUsers();
        loadScores();
        loadLeaderboard();
    }
});


// ================= USERS =================
async function loadUsers() {
    try {
        const res = await fetch(`${BASE_URL}/users`);
        const users = await res.json();

        document.getElementById("count").innerText =
            "Total Users: " + users.length;

        const userList = document.getElementById("userList");
        userList.innerHTML = "";

        users.forEach(user => {
            const li = document.createElement("li");
            li.innerText = `${user.name} - ${user.email}`;
            userList.appendChild(li);
        });

    } catch (err) {
        console.log("Error loading users", err);
    }
}


// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("email");
    window.location.href = "index.html";
}


// ================= ADD SCORE =================
async function addScore() {
    const email = localStorage.getItem("email");
    const score = document.getElementById("score").value;

    if (!email) {
        alert("User not logged in");
        return;
    }

    if (!score) {
        alert("Score cannot be empty");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Invalid email format");
        return;
    }

    if (score < 1 || score > 45) {
        alert("Score must be between 1 and 45");
        return;
    }

    try {
        await fetch(`${BASE_URL}/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, score })
        });

        loadScores();
        loadLeaderboard();

    } catch (err) {
        console.log("Error adding score:", err);
    }
}


// ================= LOAD SCORES =================
async function loadScores() {
    const email = localStorage.getItem("email");

    if (!email) return;

    try {
        const res = await fetch(`${BASE_URL}/score/${email}`);
        const data = await res.json();

        const list = document.getElementById("scoreList");
        list.innerHTML = "";

        let scores = data.scores || [];

        if (scores.length === 0) {
            list.innerHTML = "<li>No scores found</li>";
            return;
        }

        scores.forEach(s => {
            const li = document.createElement("li");
            li.innerText = s;
            list.appendChild(li);
        });

    } catch (err) {
        console.log("Error loading scores:", err);
    }
}


// ================= LEADERBOARD =================
async function loadLeaderboard() {
    try {
        const res = await fetch(`${BASE_URL}/leaderboard`);
        const data = await res.json();

        const list = document.getElementById("leaderboardList");
        if (!list) return;

        list.innerHTML = "";

        const leaderboard = data.leaderboard || [];

        leaderboard.forEach(item => {
            const li = document.createElement("li");
            li.innerText = `${item.email} - ${item.total}`;
            list.appendChild(li);
        });

        if (data.top3 && data.top3.length > 0) {
            document.getElementById("gold").innerText =
                `🥇 Gold: ${data.top3[0]?.email || "-"}`;

            document.getElementById("silver").innerText =
                `🥈 Silver: ${data.top3[1]?.email || "-"}`;

            document.getElementById("bronze").innerText =
                `🥉 Bronze: ${data.top3[2]?.email || "-"}`;
        }

    } catch (err) {
        console.log("Leaderboard error:", err);
    }
}


// ================= DRAW =================
let history = [];

function runDraw() {
    const scoreItems = document.querySelectorAll("#scoreList li");
    const scoresList = Array.from(scoreItems).map(li => Number(li.innerText));

    let draw = [];

    for (let i = 0; i < 5; i++) {
        draw.push(Math.floor(Math.random() * 45) + 1);
    }

    let matches = draw.filter(n => scoresList.includes(n));

    history.unshift({ draw, matches: matches.length });

    displayHistory();

    document.getElementById("drawResult").innerText =
        `Draw: ${draw.join(", ")} | Matches: ${matches.length}`;
}


// ================= HISTORY =================
function displayHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    history.forEach(h => {
        const li = document.createElement("li");
        li.innerText = `${h.draw.join(", ")} | Matches: ${h.matches}`;
        list.appendChild(li);
    });
}