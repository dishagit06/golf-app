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

    } catch {
        document.getElementById("msg").innerText = "Server error";
    }
}


// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

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

    if (!email) return alert("User not logged in");
    if (!score) return alert("Score cannot be empty");
    if (!isValidEmail(email)) return alert("Invalid email");

    try {
        await fetch(`${BASE_URL}/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, score })
        });

        loadScores();
        loadLeaderboard();

    } catch (err) {
        console.log(err);
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

        (data.scores || []).forEach(s => {
            const li = document.createElement("li");
            li.innerText = s;
            list.appendChild(li);
        });

    } catch (err) {
        console.log(err);
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

        (data.leaderboard || []).forEach(item => {
            const li = document.createElement("li");
            li.innerText = `${item.email} - ${item.total}`;
            list.appendChild(li);
        });

    } catch (err) {
        console.log(err);
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