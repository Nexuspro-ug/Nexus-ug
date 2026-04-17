const SUPABASE_URL = "https://ygmsmgzntgntutqbmxcg.supabase.co";
const SUPABASE_KEY = "sb_publishable_pQ_jHDaaVAPmADSqIoG7lQ_wtdKyqbr";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showLogin() {
  document.getElementById("app").innerHTML = `
    <h1>Nexus Pro</h1>
    <p>Login with Phone</p>
    <input id="phone" placeholder="Phone Number"><br>
    <input id="password" type="password" placeholder="Password"><br>
    <button onclick="register()">Register</button>
    <button onclick="login()">Login</button>
  `;
}

// REGISTER
async function register() {
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  // check if user exists
  const { data: existing } = await client
    .from("users")
    .select("*")
    .eq("phone", phone)
    .single();

  if (existing) {
    alert("User already exists");
    return;
  }

  await client.from("users").insert([
    {
      phone,
      password,
      balance: 1000
    }
  ]);

  alert("Account created! Login now.");
}

// LOGIN
async function login() {
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("phone", phone)
    .eq("password", password)
    .single();

  if (error || !data) {
    alert("Wrong phone or password");
    return;
  }

  loadDashboard(data);
}

// DASHBOARD
function loadDashboard(user) {
  document.getElementById("app").innerHTML = `
    <h2>Welcome to Nexus Pro</h2>
    <div class="card">
      <h3>Balance: $${user.balance}</h3>
      <button onclick="invest('${user.phone}')">Invest</button>
      <button onclick="logout()">Logout</button>
    </div>
  `;
}

// INVEST
async function invest(phone) {
  const { data } = await client
    .from("users")
    .select("*")
    .eq("phone", phone)
    .single();

  const profit = Math.floor(Math.random() * 100);
  const newBalance = data.balance + profit;

  await client
    .from("users")
    .update({ balance: newBalance })
    .eq("phone", phone);

  loadDashboard({ ...data, balance: newBalance });
}

// LOGOUT
function logout() {
  location.reload();
}

showLogin();
