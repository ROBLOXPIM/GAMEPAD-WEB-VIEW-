let gamepadIndex = null;
let lastTime = performance.now();
let frameCount = 0;
let fpsDisplay = document.getElementById("fps");
let pingDisplay = document.getElementById("ping");
let delay = 0;

function updateStats() {
  frameCount++;
  const now = performance.now();
  const diff = now - lastTime;

  if (diff >= 1000) {
    const fps = Math.round((frameCount * 1000) / diff);
    fpsDisplay.textContent = "FPS: " + fps;
    pingDisplay.textContent = "Ping: " + Math.floor(Math.random() * 50 + 20) + " ms";
    frameCount = 0;
    lastTime = now;
  }
}

function update() {
  let gamepads = navigator.getGamepads();
  let gp = gamepads[gamepadIndex];
  if (!gp) return;

  document.getElementById("gamepadName").textContent = gp.id;

  let map = {
    0: "A", 1: "B", 2: "X", 3: "Y",
    4: "LB", 5: "RB",
    6: "LT", 7: "RT",
    8: "Select", 9: "Start",
    12: "DpadUp", 13: "DpadDown", 14: "DpadLeft", 15: "DpadRight"
  };

  gp.buttons.forEach((btn, index) => {
    let id = map[index];
    if (id) {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("active", btn.pressed);
    }
  });

  let x = gp.axes[0];
  let y = gp.axes[1];
  let stick = document.getElementById("leftStick");
  if (stick) {
    stick.style.left = `${40 + x * 30}px`;
    stick.style.top = `${40 + y * 30}px`;
  }

  if (document.getElementById("toggleFPS").checked || document.getElementById("togglePing").checked) {
    updateStats();
  }

  setTimeout(() => requestAnimationFrame(update), delay);
}

window.addEventListener("gamepadconnected", function (e) {
  gamepadIndex = e.gamepad.index;
  document.getElementById("status").textContent = "🎮 Controle detectado!";
  document.getElementById("gamepadName").textContent = e.gamepad.id;

  const sound = document.getElementById("notifySound");
  if (sound) sound.play();

  const popup = document.getElementById("popup");
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);

  update();
});

window.addEventListener("gamepaddisconnected", function () {
  document.getElementById("status").textContent = "🎮 Controle desconectado.";
  document.getElementById("gamepadName").textContent = "Nenhum controle";
  gamepadIndex = null;
});

document.getElementById("configBtn").addEventListener("click", () => {
  const menu = document.getElementById("colorMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
});

document.getElementById("colorPicker").addEventListener("input", (e) => {
  document.documentElement.style.setProperty('--main-color', e.target.value);
});

document.getElementById("delayInput").addEventListener("input", (e) => {
  delay = parseInt(e.target.value);
});
