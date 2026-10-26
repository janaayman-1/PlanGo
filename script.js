const investors = [
    { name: "Sarah mohamed", field: "Tech / AI", range: "50k - 250k", bio: "Looking for scalable software solutions." },
    { name: "Ahmed Mansour", field: "Renewable Energy", range: "100k - 1M", bio: "Interested in green-tech and sustainability." },
    { name: "Digital Alpha Fund", field: "Fintech", range: "500k - 5M", bio: "Venture capital focusing on emerging markets." }
];

const defaultTasks = [
    { title: "Market Research", status: "Done" },
    { title: "MVP Development", status: "In Progress" },
    { title: "User Feedback", status: "Upcoming" }
];

const defaultDeadlines = [
    { title: "Submit Pitch Deck", date: "Oct 30" },
    { title: "Investor Meeting", date: "Nov 05" }
];

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');
    window.scrollTo(0, 0);
}

function toggleAuth() {
    const title = document.getElementById('auth-title');
    const toggleLink = document.querySelector('.toggle-text span');
    if (title.innerText.includes("Login")) {
        title.innerText = "Create New Account";
        toggleLink.innerText = "Login";
    } else {
        title.innerText = "Login to PlanGo";
        toggleLink.innerText = "Sign Up";
    }
}

async function handleLogin() {
    const emailInput = document.querySelector('#auth input[type="email"]');
    const passwordInput = document.querySelector('#auth input[type="password"]');
    const email = emailInput.value;
    const password = passwordInput.value;
    
    const isSignUp = document.getElementById('auth-title').innerText.includes("Create");
    const endpoint = isSignUp ? 'signup' : 'login';

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            if (isSignUp) {
                alert("Account created successfully! Now you can login.");
                toggleAuth();
                emailInput.value = "";
                passwordInput.value = "";
            } else {
                alert("Login Successful!");
                showPage('dashboard');
                renderDashboard(data.user.id);
            }
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        console.error("Auth Error:", err);
        alert("Server is not responding.");
    }
}

async function renderDashboard(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/dashboard/${userId}`);
        const data = await response.json();

        document.getElementById('dash-expenses').innerText = `$${data.expenses || 0}`;
        document.getElementById('dash-revenues').innerText = `$${data.revenues || 0}`;
        document.getElementById('dash-progress').innerText = `${data.progress || 0}%`;

        const tasksList = document.getElementById('ai-tasks-list');
        if (tasksList) {
            tasksList.innerHTML = defaultTasks.map(t => `
                <div class="task-item">
                    <span>${t.title}</span>
                    <span class="status-tag">${t.status}</span>
                </div>
            `).join('');
        }

        const deadlinesList = document.getElementById('deadlines-list');
        if (deadlinesList) {
            deadlinesList.innerHTML = defaultDeadlines.map(d => `
                <div class="reminder-item">
                    <strong>${d.title}</strong>
                    <p style="font-size: 0.8rem; color: #94a3b8;">Due: ${d.date}</p>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Dashboard Load Error:", err);
    }
}

async function renderIdeas() {
    try {
        const response = await fetch('http://localhost:5000/api/ideas');
        const data = await response.json();
        
        const container = document.getElementById('ideas-list');
        if (!container || !data.length) return;
        
        container.innerHTML = data.map(idea => `
            <div class="glass-card">
                <h3>${idea.name}</h3>
                <p style="color: #94a3b8; font-size: 0.9rem; margin: 15px 0;">${idea.description}</p>
                <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px; font-size: 0.85rem;">
                    <p>Cost: <strong>$${idea.cost}</strong></p>
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 20px;" onclick="showPage('dashboard')">Track Project</button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Backend Error:", err);
    }
}

function askMentor() {
    const input = document.getElementById('mentor-input');
    const windowChat = document.getElementById('chat-window');
    
    if (!input || input.value.trim() === "") return;

    windowChat.innerHTML += `<div class="message user-message">${input.value}</div>`;
    const userText = input.value;
    input.value = "";
    windowChat.scrollTop = windowChat.scrollHeight;

    setTimeout(() => {
        windowChat.innerHTML += `
            <div class="message ai-message">
                <i class="fas fa-robot"></i> Analyzing "${userText}"... <br><br>
                Based on current market trends, I suggest focusing on building a strong MVP and validating your idea with real users.
            </div>`;
        windowChat.scrollTop = windowChat.scrollHeight;
    }, 1000);
}

function renderInvestors() {
    const container = document.getElementById('investors-list');
    if (!container) return;
    container.innerHTML = investors.map(inv => `
        <div class="glass-card" style="text-align: center;">
            <div style="width: 70px; height: 70px; background: #000; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border);">
                <i class="fas fa-user-tie" style="font-size: 1.5rem; color: var(--primary-teal);"></i>
            </div>
            <h3>${inv.name}</h3>
            <p style="color: var(--primary-teal); font-weight: 600;">${inv.field}</p>
            <p style="font-size: 0.85rem; margin: 10px 0; color: #94a3b8;">${inv.bio}</p>
            <p><strong>${inv.range}</strong></p>
            <button class="btn-outline" style="width: 100%; margin-top: 15px;">Contact Investor</button>
        </div>
    `).join('');
}

window.onload = () => {
    renderIdeas();
    renderInvestors();
};