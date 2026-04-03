// ================= BASE URL =================
const BASE_URL = "https://golf-app-grx0.onrender.com";

// ================= EMAIL VALID =================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================= LOGIN =================
async function login() {
    console.log("Login clicked 🔥");

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        console.log("Login response:", data); // 🔥 DEBUG

        document.getElementById("msg").innerText = data.message;

        if (data.access) {

            // ✅ SAVE PROPERLY
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("role", data.user.role);

            console.log("Saved role:", data.user.role); // 🔥 DEBUG

            // ✅ REDIRECT BASED ON ROLE
            if (data.user.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }

    } catch (err) {
        console.log(err);
        document.getElementById("msg").innerText = "Server error ❌";
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

        if (!name || !email || !password) {
            return alert("Fill all fields ❌");
        }

        try {
            const res = await fetch(`${BASE_URL}/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, plan, charity })
            });

            const data = await res.json();
            document.getElementById("msg").innerText = data.message;

        } catch {
            document.getElementById("msg").innerText = "Server error ❌";
        }
    });
}

// ================= PASSWORD TOGGLE =================
function toggleLoginPassword() {
    const input = document.getElementById("loginPassword");
    input.type = input.type === "password" ? "text" : "password";
}

function toggleSignupPassword() {
    const input = document.getElementById("signupPassword");
    input.type = input.type === "password" ? "text" : "password";
}

// ================= LOAD DASHBOARD =================
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

        const countEl = document.getElementById("count");
        if (countEl) {
            countEl.innerText = "Total Users: " + users.length;
        }

        const userList = document.getElementById("userList");
        if (!userList) return;

        userList.innerHTML = "";

        users.forEach(user => {
            const li = document.createElement("li");
            li.innerText = `${user.name} - ${user.email}`;
            userList.appendChild(li);
        });

    } catch {
        console.log("Error loading users");
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

    if (!email || !score) return alert("Invalid input ❌");

    if (score < 1 || score > 45) {
        return alert("Score must be 1–45 ❌");
    }

    try {
        await fetch(`${BASE_URL}/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, score })
        });

        loadScores();
        loadLeaderboard();

    } catch {
        console.log("Error adding score");
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
        if (!list) return;

        list.innerHTML = "";

        (data.scores || []).forEach(s => {
            const li = document.createElement("li");
            li.innerText = s;
            list.appendChild(li);
        });

    } catch {
        console.log("Error loading scores");
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

        // TOP 3
        if (data.top3) {
            document.getElementById("gold").innerText =
                `🥇 Gold: ${data.top3[0]?.email || "-"}`;

            document.getElementById("silver").innerText =
                `🥈 Silver: ${data.top3[1]?.email || "-"}`;

            document.getElementById("bronze").innerText =
                `🥉 Bronze: ${data.top3[2]?.email || "-"}`;
        }

    } catch {
        console.log("Error loading leaderboard");
    }
}
// ================= ADMIN USERS =================
async function loadAdminUsers() {
    try {
        const res = await fetch(`${BASE_URL}/admin/users`);
        const data = await res.json();

        console.log("Admin data:", data);

        // ✅ FIX
        const users = data.users || data;

        const list = document.getElementById("adminUsers");
        list.innerHTML = "";

        users.forEach(u => {
            const li = document.createElement("li");
            li.innerText = `${u.name} - ${u.email} - ${u.subscriptionStatus}`;
            list.appendChild(li);
        });

    } catch (err) {
        console.log("Admin error", err);
    }
}
// ================= DRAW =================
let history = [];

function runDraw() {
    const scoreItems = document.querySelectorAll("#scoreList li");

    if (scoreItems.length === 0) {
        alert("No scores available ❌");
        return;
    }

    const scores = Array.from(scoreItems).map(li => Number(li.innerText));

    let draw = [];

    for (let i = 0; i < 5; i++) {
        draw.push(Math.floor(Math.random() * 45) + 1);
    }

    let matches = draw.filter(n => scores.includes(n));

    const result = document.getElementById("drawResult");
    if (result) {
        result.innerText =
            `Draw: ${draw.join(", ")} | Matches: ${matches.length}`;
    }

    history.unshift({
        draw,
        matches: matches.length
    });

    displayHistory();
}

// ================= HISTORY =================
function displayHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;

    list.innerHTML = "";

    history.forEach(h => {
        const li = document.createElement("li");
        li.innerText = `${h.draw.join(", ")} | Matches: ${h.matches}`;
        list.appendChild(li);
    });
}