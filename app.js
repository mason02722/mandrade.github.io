const supabaseURL = "https://hajlfhfikjtkxwhoetzf.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamxmaGZpa2p0a3h3aG9ldHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTA0ODAsImV4cCI6MjEwODI4NjQ4MH0.krDQsL1w4ohKWPopuIhawrErVpa92PVoHni8jbA0Wv4"

const supabaseClient = window.supabase.createClient(supabaseURL, supabaseKey);

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const forgotPassword = document.getElementById("forgotPassword");

const authPanel = document.getElementById("authPanel");
const dashboard = document.getElementById("dashboard");
const welcomeText = document.getElementById("welcome");

// SIGN UP with Display Name
signupBtn.addEventListener("click", async () => {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: name // This saves the display name to the user profile
            }
        }
    });

    if (error) {
        alert(error.message);
    } else {
        alert("Registration successful! Check your email for confirmation.");
    }
});

// LOGIN
loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        // Show the Display Name from metadata if available
        const displayName = data.user.user_metadata.display_name || "User";
        
        authPanel.style.display = "none";
        dashboard.style.display = "block";
        welcomeText.innerText = "Welcome back, " + displayName;
    }
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        authPanel.style.display = "block";
        dashboard.style.display = "none";
        welcomeText.innerText = "";
    }
});

// FORGOT PASSWORD
forgotPassword.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    
    if (!email) {
        alert("Please enter your email first so we know where to send the reset link.");
        return;
    }

    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);
    
    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("A password reset link has been sent to your email!");
    }
});
