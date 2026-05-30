import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBo3Bw1lh4fvHGbMT41bEJ4f-4389kqfM8",
  authDomain: "polismyndighets-rakel.firebaseapp.com",
  projectId: "polismyndighets-rakel",
  storageBucket: "polismyndighets-rakel.firebasestorage.app",
  messagingSenderId: "779611072872",
  appId: "1:779611072872:web:6db7ff4800c7d9552ecedd",
  measurementId: "G-7EYX8PEPWR",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const membersRef = collection(db, "members");

const loginView = document.querySelector("#loginView");
const appView = document.querySelector("#appView");
const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const loginError = document.querySelector("#loginError");
const logoutBtn = document.querySelector("#logoutBtn");

const membersEl = document.querySelector("#members");
const emptyState = document.querySelector("#emptyState");
const memberCount = document.querySelector("#memberCount");
const template = document.querySelector("#memberTemplate");
const form = document.querySelector("#memberForm");
const searchInput = document.querySelector("#searchInput");
const roleInput = document.querySelector("#roleInput");
const filterInputs = [...document.querySelectorAll(".filter-panel input[type='checkbox']")];
const clearFiltersBtn = document.querySelector("#clearFiltersBtn");

const sessionKey = "server-panel-authenticated";
const username = "Medlemsansvarig123";
const password = "Polismyndigheten123";
const policeRanks = [
  "Rikspolischef",
  "Bitr. Rikspolischef",
  "Polisdirektör",
  "Bitr. Polisdirektör",
  "Regions Chef",
  "Polismästare",
  "Polisöverintendent",
  "Polisledning",
  "Veckans kollega",
  "Polisintendent",
  "Sekreterare",
  "Kommissarie",
  "Administration",
  "Inspektör",
  "Polisassistent 4",
  "Polisassistent",
  "Aspirant",
  "Studerande",
];

const legacyRoles = {
  Polismyndigheten: "Polisassistent",
  Serverledning: "Polisledning",
  Civilperson: "Studerande",
  Räddningstjänst: "Studerande",
  Sjukvården: "Studerande",
  SOS: "Studerande",
  Utvecklingsteam: "Administration",
};

const rakelByRank = {
  Rikspolischef: ["1-35-99"],
  "Bitr. Rikspolischef": ["1-35-98"],
  Polisdirektör: ["1-35-97"],
  "Bitr. Polisdirektör": ["1-35-96"],
  "Regions Chef": ["1-35-95"],
  Polismästare: ["1-35-94", "1-35-93", "1-35-92", "1-35-91", "1-35-90"],
  Polisöverintendent: [
    "1-35-89",
    "1-35-88",
    "1-35-87",
    "1-35-86",
    "1-35-85",
    "1-35-84",
    "1-35-83",
    "1-35-82",
    "1-35-81",
    "1-35-80",
  ],
  Polisledning: [],
  "Veckans kollega": [],
  Polisintendent: [
    "1-35-79",
    "1-35-78",
    "1-35-77",
    "1-35-76",
    "1-35-75",
    "1-35-74",
    "1-35-73",
    "1-35-72",
    "1-35-71",
    "1-35-70",
    "1-35-69",
    "1-35-68",
    "1-35-67",
    "1-35-66",
  ],
  Sekreterare: [
    "1-34-95",
    "1-34-94",
    "1-34-93",
    "1-34-92",
    "1-34-91",
    "1-34-90",
    "1-34-89",
    "1-34-88",
    "1-34-87",
    "1-34-86",
    "1-34-85",
  ],
  Kommissarie: [
    "1-33-95",
    "1-33-94",
    "1-33-93",
    "1-33-92",
    "1-33-91",
    "1-33-90",
    "1-33-89",
    "1-33-88",
    "1-33-87",
    "1-33-86",
    "1-33-85",
    "1-33-84",
    "1-33-83",
    "1-33-82",
    "1-33-81",
    "1-33-80",
    "1-33-70",
  ],
  Administration: [],
  Inspektör: [
    "1-32-95",
    "1-32-94",
    "1-32-93",
    "1-32-50",
    "1-32-49",
    "1-32-48",
    "1-32-47",
    "1-32-46",
    "1-32-45",
    "1-32-44",
    "1-32-43",
    "1-32-42",
    "1-32-41",
    "1-32-40",
    "1-32-39",
    "1-32-38",
  ],
  "Polisassistent 4": [
    "1-31-95",
    "1-31-94",
    "1-31-93",
    "1-31-92",
    "1-31-91",
    "1-31-90",
    "1-31-89",
    "1-31-88",
    "1-31-87",
    "1-31-86",
    "1-31-85",
    "1-31-84",
    "1-31-83",
    "1-31-82",
    "1-31-81",
    "1-31-80",
    "1-31-79",
    "1-31-78",
    "1-31-77",
    "1-31-76",
    "1-31-75",
    "1-31-74",
    "1-31-73",
    "1-31-72",
    "1-31-71",
  ],
  Polisassistent: [
    "1-31-48",
    "1-31-47",
    "1-31-46",
    "1-31-45",
    "1-31-44",
    "1-31-43",
    "1-31-42",
    "1-31-41",
    "1-31-40",
    "1-31-39",
    "1-31-38",
    "1-31-37",
    "1-31-36",
    "1-31-35",
    "1-31-34",
    "1-31-33",
    "1-31-32",
    "1-31-31",
    "1-31-30",
    "1-31-29",
    "1-31-28",
    "1-31-27",
    "1-31-26",
    "1-31-25",
    "1-31-24",
    "1-31-23",
    "1-31-22",
    "1-31-21",
    "1-31-20",
    "1-31-19",
    "1-31-18",
    "1-31-17",
  ],
  Aspirant: [
    "1-30-50",
    "1-30-49",
    "1-30-48",
    "1-30-47",
    "1-30-46",
    "1-30-45",
    "1-30-44",
    "1-30-43",
    "1-30-42",
    "1-30-41",
    "1-30-40",
    "1-30-39",
    "1-30-38",
    "1-30-37",
    "1-30-36",
    "1-30-35",
    "1-30-34",
    "1-30-33",
    "1-30-32",
    "1-30-31",
    "1-30-30",
  ],
  Studerande: [
    "1-29-50",
    "1-29-49",
    "1-29-48",
    "1-29-47",
    "1-29-46",
    "1-29-45",
    "1-29-44",
    "1-29-43",
    "1-29-42",
    "1-29-41",
    "1-29-40",
    "1-29-39",
    "1-29-38",
    "1-29-37",
    "1-29-36",
    "1-29-35",
    "1-29-34",
    "1-29-33",
    "1-29-32",
    "1-29-31",
    "1-29-30",
    "1-29-29",
    "1-29-28",
    "1-29-27",
    "1-29-26",
    "1-29-25",
  ],
};

const rakelAssignments = Object.entries(rakelByRank).flatMap(([role, rakels]) =>
  rakels.map((rakel) => ({ rakel, role }))
);

let members = [];
let unsubscribeMembers = null;

function normalizeStatus(status) {
  return status === "Tillgänglig" ? "Ledig" : status;
}

function normalizeRole(role) {
  if (policeRanks.includes(role)) return role;
  return legacyRoles[role] || "Studerande";
}

function normalizeMember(member) {
  return {
    id: member.id || crypto.randomUUID(),
    name: member.name || "",
    discord: member.discord || "",
    role: normalizeRole(member.role),
    status: normalizeStatus(member.status || "Aktiv"),
    inactivityWarning: Boolean(member.inactivityWarning),
  };
}

function legacyUpdateRakelOptions() {
  const usedRakels = new Set(members.map((member) => member.discord));
  const currentValue = roleInput.value;
  const availableAssignments = rakelAssignments.filter(({ rakel }) => !usedRakels.has(rakel));
  roleInput.innerHTML = "";

  if (availableAssignments.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Inga Rakel för vald rang";
    rakelInput.append(option);
    rakelInput.disabled = true;
    return;
  }

  rakelInput.disabled = false;
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Välj Rakel";
  rakelInput.append(placeholder);

  rakelOptions.forEach((rakel) => {
    const option = document.createElement("option");
    option.value = rakel;
    option.textContent = rakel;
    rakelInput.append(option);
  });
}

function updateAssignmentOptions() {
  const usedRakels = new Set(members.map((member) => member.discord));
  const currentValue = roleInput.value;
  const availableAssignments = rakelAssignments.filter(({ rakel }) => !usedRakels.has(rakel));
  roleInput.innerHTML = "";

  if (availableAssignments.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Alla Rakel är upptagna";
    roleInput.append(option);
    roleInput.disabled = true;
    return;
  }

  roleInput.disabled = false;
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Välj Rakel / Polisrang";
  roleInput.append(placeholder);

  availableAssignments.forEach(({ rakel, role }) => {
    const option = document.createElement("option");
    option.value = JSON.stringify({ rakel, role });
    option.textContent = `${rakel} - ${role}`;
    roleInput.append(option);
  });

  if ([...roleInput.options].some((option) => option.value === currentValue)) {
    roleInput.value = currentValue;
  }
}

function showApp() {
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
  startMembersSync();
  renderMembers();
}

function showLogin() {
  appView.classList.add("hidden");
  loginView.classList.remove("hidden");
  passwordInput.value = "";
  usernameInput.focus();
}

async function offerPasswordSave() {
  if (!("credentials" in navigator) || typeof PasswordCredential === "undefined") {
    return;
  }

  try {
    const credential = new PasswordCredential(loginForm);
    await navigator.credentials.store(credential);
  } catch {
    // Some browsers only show their built-in prompt and do not expose a result.
  }
}

function getFilteredMembers() {
  const queryText = searchInput.value.trim().toLowerCase();
  const selectedRoles = filterInputs
    .filter((input) => input.name === "role" && input.checked)
    .map((input) => input.value);
  const selectedStatuses = filterInputs
    .filter((input) => input.name === "status" && input.checked)
    .map((input) => input.value);
  const warningOnly = document.querySelector("#warningFilter").checked;

  return members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(queryText) ||
      member.discord.toLowerCase().includes(queryText);
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(member.role);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(member.status);
    const matchesWarning = !warningOnly || member.inactivityWarning;

    return matchesSearch && matchesRole && matchesStatus && matchesWarning;
  });
}

function renderMembers() {
  const filteredMembers = getFilteredMembers();
  membersEl.innerHTML = "";
  memberCount.textContent = `${filteredMembers.length} / ${members.length}`;
  emptyState.classList.toggle("hidden", filteredMembers.length !== 0);

  filteredMembers.forEach((member) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".member-card");
    const dot = node.querySelector(".status-dot");
    const warningButton = node.querySelector(".inactivity-warning");

    card.dataset.memberId = member.id;
    card.classList.toggle("has-warning", member.inactivityWarning);
    node.querySelector(".member-name").textContent = member.name;
    node.querySelector(".member-role").textContent = member.role;
    node.querySelector(".member-discord").textContent = member.discord;
    dot.dataset.status = member.status;

    node.querySelector(".remove").addEventListener("click", async () => {
      await deleteDoc(doc(db, "members", member.id));
    });

    warningButton.classList.toggle("is-active", member.inactivityWarning);
    warningButton.addEventListener("click", async () => {
      await updateDoc(doc(db, "members", member.id), {
        inactivityWarning: !member.inactivityWarning,
      });
    });

    const activeButton = node.querySelector(".status-active");
    const inactiveButton = node.querySelector(".status-inactive");
    const availableButton = node.querySelector(".status-available");

    activeButton.classList.toggle("is-selected", member.status === "Aktiv");
    inactiveButton.classList.toggle("is-selected", member.status === "Inaktiv");
    availableButton.classList.toggle("is-selected", member.status === "Ledig");

    activeButton.addEventListener("click", () => setStatus(member, "Aktiv"));
    inactiveButton.addEventListener("click", () => setStatus(member, "Inaktiv"));
    availableButton.addEventListener("click", () => setStatus(member, "Ledig"));

    membersEl.append(node);
  });
}

function startMembersSync() {
  if (unsubscribeMembers) return;

  const membersQuery = query(membersRef, orderBy("createdAt", "desc"));
  unsubscribeMembers = onSnapshot(
    membersQuery,
    (snapshot) => {
      members = snapshot.docs.map((memberDoc) =>
        normalizeMember({
          id: memberDoc.id,
          ...memberDoc.data(),
        })
      );
      updateAssignmentOptions();
      renderMembers();
    },
    (error) => {
      console.error("Firestore sync failed:", error);
      emptyState.textContent = "Kunde inte ansluta till databasen. Kontrollera Firestore-inställningarna.";
      emptyState.classList.remove("hidden");
    }
  );
}

async function setStatus(member, status) {
  await updateDoc(doc(db, "members", member.id), { status });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const validLogin = usernameInput.value.trim() === username && passwordInput.value === password;
  if (!validLogin) {
    loginError.textContent = "Fel användarnamn eller lösenord.";
    return;
  }

  loginError.textContent = "";
  await offerPasswordSave();
  localStorage.setItem(sessionKey, "true");
  showApp();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(sessionKey);
  showLogin();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const selectedAssignment = JSON.parse(roleInput.value || "{}");

  const formData = normalizeMember({
    name: document.querySelector("#nameInput").value.trim(),
    discord: selectedAssignment.rakel || "",
    role: selectedAssignment.role || "",
    status: document.querySelector("#statusInput").value,
  });

  if (!formData.name || !formData.discord) return;

  await addDoc(membersRef, {
    name: formData.name,
    discord: formData.discord,
    role: formData.role,
    status: formData.status,
    inactivityWarning: false,
    createdAt: serverTimestamp(),
  });

  form.reset();
  document.querySelector("#statusInput").value = "Aktiv";
  updateAssignmentOptions();
});

searchInput.addEventListener("input", renderMembers);
filterInputs.forEach((input) => input.addEventListener("change", renderMembers));

clearFiltersBtn.addEventListener("click", () => {
  filterInputs.forEach((input) => {
    input.checked = false;
  });
  renderMembers();
});

if (localStorage.getItem(sessionKey) === "true") {
  showApp();
} else {
  showLogin();
}

updateAssignmentOptions();
