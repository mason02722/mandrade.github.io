const button = doccument.getElementByID("testBtn");
const result = document.getElementById("result");

const supabaseURL = "https://hajlfhfikjtkxwhoetzf.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamxmaGZpa2p0a3h3aG9ldHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTA0ODAsImV4cCI6MjEwODI4NjQ4MH0.krDQsL1w4ohKWPopuIhawrErVpa92PVoHni8jbA0Wv4"
const supabaseClient = window.supabase.createClient(supabaseURL,supabaseKey);

button.addEventListener("click", () => {
    result.innerText = "Supabase client successfully connected";
});
// const supabaseURL = "https://hajlfhfikjtkxwhoetzf.supabase.co"
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamxmaGZpa2p0a3h3aG9ldHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTA0ODAsImV4cCI6MjEwODI4NjQ4MH0.krDQsL1w4ohKWPopuIhawrErVpa92PVoHni8jbA0Wv4"

// const supabaseClient = window.supabase.createClient(supabaseURL,supabaseKey);

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signupEmail").value
    const password = document.getElementById("signupPassword").value

    const{data, error} = await supabaseClient.auth.signUp({
        email: email,
        password: password
    })
    if(error){
        alert(error.message)
    } else{
        alert("User registered successfully")
    }
    
})

loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    const{data, error} = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    })
    if(error){
        alert(error.message)
    } else{
        document.getElementById("welcome").innerText = "Welcome back" + email
    }
    
})

