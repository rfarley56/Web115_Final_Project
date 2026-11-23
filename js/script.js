// ========== CLASSES ==========
class Player {
  constructor(name) {
    this.name = name;
    this.inventory = [];
    this.bondScore = 0;
    this.affinity = 0;
    this.realm = null;
    this.priority = null;
    this.flags = { foundClue: false, secondSeason: false, bonded: false };
  }

  addItem(item) {
    if (!this.inventory.includes(item)) {
      this.inventory.push(item);
      return true;
    }
    return false;
  }

  updateBond(amount) {
    this.bondScore = Math.max(0, Math.min(10, this.bondScore + amount));
  }
}

class Unicorn {
  constructor(name, gifts, levels) {
    this.name = name;
    this.gifts = gifts;
    this.levels = levels;
  }

  describe() {
    return `${this.name} — Gifts: ${this.gifts.join(", ")}. Levels: Knowledge ${this.levels.knowledge}, Ingenuity ${this.levels.ingenuity}, Stamina ${this.levels.stamina}, Potential ${this.levels.potential}.`;
  }
}

class Realm {
  constructor(name, difficulty, description, image) {
    this.name = name;
    this.difficulty = difficulty;
    this.description = description;
    this.image = image;
  }
}

// ========== GAME STATE ==========
let player = new Player("Ravaryn Nightwillow");
let currentScene = "start";
let unicorns = {
  elheim: new Unicorn("Luminara of the Veil", ["Healing", "Protection", "Sensing Purity"], {knowledge: 9, ingenuity: 8, stamina: 9, potential: 10}),
  drakenhold: new Unicorn("Ashenstride", ["Speed", "Water Purification", "Protection"], {knowledge: 7, ingenuity: 7, stamina: 8, potential: 7}),
  bastoria: new Unicorn("Shorewhisper", ["Healing", "Sensing Purity", "Water Purification"], {knowledge: 6, ingenuity: 6, stamina: 7, potential: 6})
};

// ========== ELEMENT REFERENCES ==========
let para1, para2, para3, storyImage, bondSpan, affinitySpan;
let inventoryList, logEntries, choice1, choice2, choice3;
let nextBtn, backBtn, inputArea, priorityInput, submitBtn;
let validationMsg, secretArea, secretInput, secretBtn, tooltip;

function initElements() {
  para1 = document.getElementById("paragraph1");
  para2 = document.getElementById("paragraph2");
  para3 = document.getElementById("paragraph3");
  storyImage = document.getElementById("story-image");
  bondSpan = document.getElementById("bond-score");
  affinitySpan = document.getElementById("affinity");
  inventoryList = document.getElementById("inventory-list");
  logEntries = document.getElementById("log-entries");
  choice1 = document.getElementById("choice1-btn");
  choice2 = document.getElementById("choice2-btn");
  choice3 = document.getElementById("choice3-btn");
  nextBtn = document.getElementById("next-btn");
  backBtn = document.getElementById("back-btn");
  inputArea = document.getElementById("input-area");
  priorityInput = document.getElementById("priority-input");
  submitBtn = document.getElementById("submit-btn");
  validationMsg = document.getElementById("validation-msg");
  secretArea = document.getElementById("secret-area");
  secretInput = document.getElementById("secret-input");
  secretBtn = document.getElementById("secret-btn");
  tooltip = document.getElementById("tooltip");
}

// ========== HELPER FUNCTIONS ==========
function setImage(filename) {
  try {
    if (storyImage) storyImage.src = "images/" + filename;
  } catch (e) {
    console.error("Image load failed:", e);
  }
}

function setText(p1, p2, p3) {
  if (para1) para1.textContent = p1 || "";
  if (para2) para2.textContent = p2 || "";
  if (para3) para3.textContent = p3 || "";
}

function updateStats() {
  if (bondSpan) bondSpan.textContent = player.bondScore;
  if (affinitySpan) affinitySpan.textContent = player.affinity;
}

function addToLog(message) {
  if (!logEntries) return;
  const entry = document.createElement("p");
  entry.textContent = "• " + message;
  logEntries.appendChild(entry);
  logEntries.scrollTop = logEntries.scrollHeight;
}

function updateInventory() {
  if (!inventoryList) return;
  inventoryList.innerHTML = "";
  player.inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

function saveGame() {
  try {
    const state = {
      bondScore: player.bondScore,
      affinity: player.affinity,
      realm: player.realm,
      priority: player.priority,
      inventory: player.inventory,
      flags: player.flags,
      scene: currentScene
    };
    localStorage.setItem("unicornBondSave", JSON.stringify(state));
    document.cookie = "lastRealm=" + (player.realm || "none") + "; max-age=86400; path=/";
    addToLog("Progress saved.");
  } catch (e) {
    console.error("Save failed:", e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem("unicornBondSave");
    if (saved) {
      const state = JSON.parse(saved);
      player.bondScore = state.bondScore || 0;
      player.affinity = state.affinity || 0;
      player.realm = state.realm;
      player.priority = state.priority;
      player.inventory = state.inventory || [];
      player.flags = state.flags || {};
      currentScene = state.scene || "start";
      updateStats();
      updateInventory();
      addToLog("Previous progress restored.");
      return true;
    }
  } catch (e) {
    console.error("Load failed:", e);
  }
  return false;
}

function showButtons(btn1Text, btn2Text, btn3Text, showNext, showBack) {
  showNext = !!showNext;
  showBack = !!showBack;
  if (choice1) {
    choice1.textContent = btn1Text || "";
    choice1.classList.toggle("hidden", !btn1Text);
  }
  if (choice2) {
    choice2.textContent = btn2Text || "";
    choice2.classList.toggle("hidden", !btn2Text);
  }
  if (choice3) {
    choice3.textContent = btn3Text || "";
    choice3.classList.toggle("hidden", !btn3Text);
  }
  if (nextBtn) nextBtn.classList.toggle("hidden", !showNext);
  if (backBtn) backBtn.classList.toggle("hidden", !showBack);
  if (inputArea) inputArea.classList.add("hidden");
  if (secretArea) secretArea.classList.add("hidden");
}

// ========== SCENE LOGIC ==========
function goToScene(scene) {
  currentScene = scene;
  saveGame();

  switch (scene) {
    case "start":
      setImage("map.jpg");
      setText(
        "In the twilight of the Silverleaf realm, the last of the Nightwillow line stands ready.",
        "Ravaryn Nightwillow, warrior-princess, must find and bond with a unicorn if her people are to survive the Shadowblight.",
        "Three hunting grounds lie before her. Choose carefully — the path shapes the bond that may yet be forged."
      );
      showButtons("Enter Elheim", "Enter Drakenhold", "Enter Bastoria");
      if (tooltip) tooltip.textContent = "The map marks three realms of differing difficulty and gift strength.";
      break;

    case "elheim_enter":
      player.realm = "elheim";
      setImage("elheim.jpg");
      setText(
        "You step into Elheim, the Elderwood Veil. Ancient trees twist overhead, their bark etched with forgotten runes. Mist coils between the roots.",
        "This is the hardest ground. Unicorns are rare, but those that dwell here carry the deepest gifts: true healing, unbreakable protection, and the power to sense purity of heart.",
        "A faint trail of silver light leads deeper. Do you follow it at once, or search for signs of the second season's rising magic?"
      );
      showButtons("Follow the light", "Search for deeper signs", "Turn back");
      player.updateBond(1);
      updateStats();
      addToLog("Entered Elheim, the Elderwood Veil.");
      break;

    case "elheim_second":
      player.flags.secondSeason = true;
      setImage("elheim.jpg");
      setText(
        "The second season of Elheim awakens. The mist thickens into living illusions. Trees rearrange when you look away. A voice like wind through leaves whispers riddles.",
        "You must prove your intent. The illusions test whether your heart is pure enough for a high-gift bond.",
        "What do you value most in this hunt?"
      );
      showButtons("", "", "");
      if (inputArea) inputArea.classList.remove("hidden");
      if (validationMsg) validationMsg.textContent = "";
      addToLog("Entered the second season of Elheim.");
      break;

    case "drakenhold_enter":
      player.realm = "drakenhold";
      setImage("drakenhold.jpg");
      setText(
        "Drakenhold's Ashen Peaks rise before you. Black rock, steam vents, and the bones of long-dead dragons scar the land under a storm-heavy sky.",
        "Unicorns here are more common, their gifts strong but not the absolute pinnacle: unmatched speed, water purification, and solid protection.",
        "A ridge path climbs toward a lone white figure. Storm winds rise. Do you press on, seek shelter to observe, or retreat?"
      );
      showButtons("Climb the ridge", "Observe from shelter", "Turn back");
      player.updateBond(1);
      updateStats();
      addToLog("Entered Drakenhold, the Ashen Peaks.");
      break;

    case "drakenhold_second":
      player.flags.secondSeason = true;
      setImage("drakenhold.jpg");
      setText(
        "The second season of Drakenhold strikes. Ash storms swirl, lightning cracks across the peaks, and the ground trembles with old dragon-magic echoes.",
        "Only steady resolve and clear purpose will let you close the distance to a unicorn here.",
        "What do you value most in this hunt?"
      );
      showButtons("", "", "");
      if (inputArea) inputArea.classList.remove("hidden");
      addToLog("Entered the second season of Drakenhold.");
      break;

    case "bastoria_enter":
      player.realm = "bastoria";
      setImage("bastoria.jpg");
      setText(
        "Bastoria's Verdant Shores welcome you with soft grass, wildflowers, and the distant sound of the sea. The air feels gentle.",
        "This is the easiest ground. Unicorns are plentiful, their gifts reliable but moderate: healing touch, sensing of purity, and water purification.",
        "Several white shapes graze near a stream. Do you approach openly, circle to observe, or leave for harder lands?"
      );
      showButtons("Approach openly", "Circle and observe", "Turn back");
      player.updateBond(1);
      updateStats();
      addToLog("Entered Bastoria, the Verdant Shores.");
      break;

    case "bastoria_second":
      player.flags.secondSeason = true;
      setImage("bastoria.jpg");
      setText(
        "Even Bastoria has a second season. A sudden fog rolls in from the sea, and the unicorns grow wary. One stands apart, watching you with calm intensity.",
        "The bond will still form more easily here, but your stated priority shapes the final strength of the connection.",
        "What do you value most in this hunt?"
      );
      showButtons("", "", "");
      if (inputArea) inputArea.classList.remove("hidden");
      addToLog("Entered the second season of Bastoria.");
      break;

    case "priority_result":
      handlePriorityResult();
      break;

    case "bond_attempt":
      attemptBond();
      break;

    case "ending_best":
      showEnding("best");
      break;

    case "ending_middle":
      showEnding("middle");
      break;

    case "ending_bad":
      showEnding("bad");
      break;

    case "ending_secret":
      showEnding("secret");
      break;

    default:
      setText("The path fades. You must begin again.", "", "");
      showButtons("Return to start", "", "");
  }
}

function handlePriorityResult() {
  const pri = player.priority;
  let bonus = 0;
  let text1 = "";

  if (pri === "gift") {
    bonus = 3;
    text1 = "You prioritize the strength of the magical gifts above all. The unicorn senses your respect for power tempered by purpose.";
    player.affinity += 2;
  } else if (pri === "difficulty") {
    bonus = 2;
    text1 = "You embrace the challenge itself. The harder path has tempered your resolve.";
    player.affinity += 1;
  } else {
    bonus = 1;
    text1 = "You seek the most reliable path. The unicorn appears, but the bond forms more cautiously.";
  }

  player.updateBond(bonus);
  updateStats();

  setImage("unicorn.jpg");
  setText(
    text1,
    "A unicorn steps from the mist or shadow. " + (unicorns[player.realm] ? unicorns[player.realm].describe() : ""),
    "You extend your hand. The moment of bonding arrives."
  );
  showButtons("Attempt the bond", "Step back and reconsider", "");
  addToLog("Priority set to " + pri + ". Bond progress increased.");
}

function attemptBond() {
  const u = unicorns[player.realm];
  let success = false;
  let quality = "none";

  if (player.bondScore >= 7 && player.priority === "gift" && player.realm === "elheim") {
    success = true;
    quality = "best";
  } else if (player.bondScore >= 5) {
    success = true;
    quality = "middle";
  } else if (player.bondScore >= 3) {
    success = true;
    quality = "middle";
  } else {
    success = false;
  }

  if (success && u) {
    player.flags.bonded = true;
    player.addItem("Bond with " + u.name);
    updateInventory();
    addToLog("Bond formed with " + u.name + ".");
    if (quality === "best") {
      goToScene("ending_best");
    } else {
      if (player.affinity >= 3 && player.flags.foundClue) {
        setText(
          "The bond holds. Yet something deeper stirs. An old word from the Nightwillow chronicles rises in your memory.",
          "If you speak it now, the gifts may grow beyond their natural limit.",
          ""
        );
        showButtons("Speak the word", "Accept the bond as it is", "");
        if (secretArea) secretArea.classList.remove("hidden");
      } else {
        goToScene("ending_middle");
      }
    }
  } else {
    goToScene("ending_bad");
  }
}

function showEnding(type) {
  setImage("unicorn.jpg");
  let t1 = "", t2 = "", t3 = "";
  switch (type) {
    case "best":
      t1 = "The strongest bond forms. Luminara of the Veil lowers her horn to your forehead. Power floods through you — pure healing, unbreakable protection, and the clarity to sense any falsehood.";
      t2 = "Spell Knowledge 9, Ingenuity 8, Stamina 9, Potential 10. The Shadowblight recoils as the spirit-bond locks into place.";
      t3 = "You return to Silverleaf with the greatest ally your line has ever known. The realm will endure.";
      break;
    case "middle":
      t1 = "A true bond is forged. The unicorn accepts you. Its gifts of healing, purification, or speed answer your call when needed.";
      t2 = "The connection is solid and lasting. Not the absolute pinnacle, yet more than enough to turn the tide against the blight.";
      t3 = "Ravaryn Nightwillow rides home with a spirit companion at her side. Hope returns to the Silverleaf.";
      break;
    case "bad":
      t1 = "The unicorn turns away. Your intent was not pure enough, or the path too uncertain. No bond forms.";
      t2 = "You leave the hunting ground alone. The Shadowblight continues its slow advance.";
      t3 = "There will be other seasons, but this one ends without the spirit-beast you sought.";
      break;
    case "secret":
      t1 = "You speak the ancient word. The unicorn's horn flares brighter. Its gifts deepen beyond their original measure — Spell Knowledge, Ingenuity, Stamina, and Potential all rise.";
      t2 = "What was already strong becomes legendary. The bond is no longer merely complete; it is transcendent.";
      t3 = "You and your unicorn return as something new. The blight will not stand against you.";
      break;
  }
  setText(t1, t2, t3);
  showButtons("Begin a new quest", "", "");
  addToLog("Reached the " + type + " ending.");
  localStorage.removeItem("unicornBondSave");
}

// ========== EVENT LISTENERS ==========
function attachListeners() {
  if (!choice1 || !choice2 || !choice3) {
    console.error("Buttons not found — check that index.html has the correct button ids");
    return;
  }

  choice1.addEventListener("click", function () {
    if (currentScene === "start") goToScene("elheim_enter");
    else if (currentScene.indexOf("_enter") !== -1) goToScene(currentScene.replace("_enter", "_second"));
    else if (currentScene === "priority_result") goToScene("bond_attempt");
    else if (currentScene.indexOf("ending") === 0) goToScene("start");
  });

  choice2.addEventListener("click", function () {
    if (currentScene === "start") goToScene("drakenhold_enter");
    else if (currentScene.indexOf("_enter") !== -1) goToScene(currentScene.replace("_enter", "_second"));
    else if (currentScene === "priority_result") goToScene("start");
    else if (currentScene.indexOf("ending") === 0) goToScene("start");
  });

  choice3.addEventListener("click", function () {
    if (currentScene === "start") goToScene("bastoria_enter");
    else if (currentScene.indexOf("_enter") !== -1) goToScene("start");
  });

  if (backBtn) {
    backBtn.addEventListener("click", function () { goToScene("start"); });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const val = priorityInput.value.trim().toLowerCase();
      const valid = /^(ease|difficulty|gift)$/.test(val);
      if (!valid) {
        if (validationMsg) {
          validationMsg.textContent = "Please enter exactly one of: ease, difficulty, or gift.";
          validationMsg.style.color = "#e76f51";
        }
        return;
      }
      if (validationMsg) validationMsg.textContent = "";
      player.priority = val;
      if (val === "gift" || val === "difficulty") {
        player.flags.foundClue = true;
        player.addItem("Fragment of Nightwillow lore");
        updateInventory();
        addToLog("Discovered a fragment of ancient lore while focusing your intent.");
      }
      goToScene("priority_result");
    });
  }

  if (secretBtn) {
    secretBtn.addEventListener("click", function () {
      const word = secretInput.value.trim().toLowerCase();
      if (word === "alicorn" || word === "nightwillow") {
        player.updateBond(2);
        player.affinity += 2;
        updateStats();
        goToScene("ending_secret");
      } else {
        if (validationMsg) validationMsg.textContent = "The word does not resonate. The bond remains as it is.";
        setTimeout(function () { goToScene("ending_middle"); }, 1500);
      }
    });
  }

  if (storyImage && tooltip) {
    storyImage.addEventListener("mouseenter", function () {
      tooltip.classList.remove("hidden");
    });
    storyImage.addEventListener("mouseleave", function () {
      tooltip.classList.add("hidden");
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "1" && choice1) choice1.click();
    else if (e.key === "2" && choice2) choice2.click();
    else if (e.key === "3" && choice3) choice3.click();
    else if (e.key === "Enter" && inputArea && !inputArea.classList.contains("hidden") && submitBtn) submitBtn.click();
    else if (e.key === "s" || e.key === "S") saveGame();
  });
}

// ========== INIT ==========
window.addEventListener("load", function () {
  initElements();
  attachListeners();

  const loaded = loadGame();
  if (!loaded) {
    goToScene("start");
  } else {
    goToScene(currentScene);
  }

  const cookies = document.cookie.split("; ");
  const last = cookies.find(function (c) { return c.indexOf("lastRealm=") === 0; });
  if (last) {
    addToLog("Last remembered realm: " + last.split("=")[1]);
  }
});

window.addEventListener("error", function (e) {
  console.error("Unexpected error:", e);
  addToLog("A ripple in the magic occurred. The story continues.");
});
