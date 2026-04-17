const SUPABASE_URL = "https://ygmsmgzntgntutqbmxcg.supabase.co";
const SUPABASE_KEY = "sb_publishable_pQ_jHDaaVAPmADSqIoG7lQ_wtdKyqbr";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showLogin() {
  document.getElementById("app").innerHTML = `
    <h1>Nexus Pro</h1>
    <p>Smart Investment Platform</p>
    <input id="email" placeholder="Email"><br>
    <input id="password" type="password" placeholder="Password"><br>
    <button onclick="register()">Register</button>
    <button onclick="login()">Login</button>
  `;
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await client.auth.signUp({
    email,
    password
  });

  if (error) return alert(error.message);

  await client.from("users").insert([
    { email, balance: 1000 }
  ]);

  alert("Account created! Please login.");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  loadDashboard(email);
}

async function loadDashboard(email) {
  const { data } = await client
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  document.getElementById("app").innerHTML = `
    <h2>Welcome to Nexus Pro</h2>

    <div class="card">
      <h3>Balance: $${data.balance}</h3>
      <button onclick="invest('${email}')">Invest</button>
      <button onclick="logout()">Logout</button>
    </div>
  `;
}

async function invest(email) {
  const { data } = await client
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  const profit = Math.floor(Math.random() * 100);
  const newBalance = data.balance + profit;

  await client
    .from("users")
    .update({ balance: newBalance })
    .eq("email", email);

  loadDashboard(email);
}

function logout() {
  location.reload();
}

showLogin();
