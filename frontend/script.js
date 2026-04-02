const BASE_URL = "https://golf-app-grx0.onrender.com";

// ================= EMAIL VALID =================
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

        if (data.message === "Login successful") {
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
        console.log(err);
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

    if (!email || !score) return alert("Invalid input");

    try {
        await fetch(`${BASE_URL}/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, score })
        });

        loadScores();
        loadLeaderboard();

    } catch {
        console.log("Error");
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

    } catch {
        console.log("Error");
    }
}

// ================= LEADERBOARD =================
async function loadLeaderboard() {
    try {
        const res = await fetch(`${BASE_URL}/leaderboard`);
        const data = await res.json();

        const list = document.getElementById("leaderboardList");
        list.innerHTML = "";

        (data.leaderboard || []).forEach(item => {
            const li = document.createElement("li");
            li.innerText = `${item.email} - ${item.total}`;
            list.appendChild(li);
        });

    } catch {
        console.log("Error");
    }
}