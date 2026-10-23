import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseURL = "https://hajlfhfikjtkxwhoetzf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamxmaGZpa2p0a3h3aG9ldHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTA0ODAsImV4cCI6MjEwODI4NjQ4MH0.krDQsL1w4ohKWPopuIhawrErVpa92PVoHni8jbA0Wv4";
const status = document.getElementById("status");
const authPanel = document.getElementById("authPanel");
const dashboard = document.getElementById("dashboard");
const welcome = document.getElementById("welcome");
const testButton = document.getElementById("testBtn");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutBtn");

const hasSupabaseKey = supabaseKey !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamxmaGZpa2p0a3h3aG9ldHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTA0ODAsImV4cCI6MjEwODI4NjQ4MH0.krDQsL1w4ohKWPopuIhawrErVpa92PVoHni8jbA0Wv4" && supabaseKey.trim() !== "";
const supabaseClient = hasSupabaseKey
  ? createClient(supabaseURL, supabaseKey)
  : null;

function setStatus(message) {
  status.textContent = message;
}

function showError(error) {
  setStatus(error instanceof Error ? error.message : String(error));
}

function showSession(session) {
  const isSignedIn = Boolean(session);
  authPanel.hidden = isSignedIn;
  dashboard.hidden = !isSignedIn;
  welcome.textContent = isSignedIn
    ? `Welcome back ${session.user.email}`
    : "";
}

function getSupabaseClient() {
  if (!supabaseClient) {
    throw new Error(
      "Add your Supabase anon/publishable key in app.js before using this app.",
    );
  }

  return supabaseClient;
}

if (!hasSupabaseKey) {
  setStatus(
    "Add your Supabase anon/publishable key in app.js to connect. Do not use a service_role key here.",
  );
} else {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    showSession(session);
  });

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      showError(error);
      return;
    }

    showSession(data.session);
  }).catch(showError);
}

testButton.addEventListener("click", async () => {
  try {
    getSupabaseClient();
    const response = await fetch(`${supabaseURL}/auth/v1/health`, {
      headers: { apikey: supabaseKey },
    });

    if (!response.ok) {
      throw new Error(`Supabase connection failed (${response.status}).`);
    }

    setStatus("Supabase connection successful.");
  } catch (error) {
    showError(error);
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const client = getSupabaseClient();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const { data, error } = await client.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    if (data.session) {
      setStatus("Your account was created and you are now signed in.");
    } else {
      setStatus("Check your email to confirm your account.");
    }
  } catch (error) {
    showError(error);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const client = getSupabaseClient();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    setStatus("You are signed in.");
  } catch (error) {
    showError(error);
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    const { error } = await getSupabaseClient().auth.signOut();

    if (error) {
      throw error;
    }

    setStatus("You are signed out.");
  } catch (error) {
    showError(error);
  }
});
