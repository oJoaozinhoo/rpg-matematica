const sounds = {
  click: document.getElementById("snd-click"),
  hit: document.getElementById("snd-hit"),
  error: document.getElementById("snd-error"),
  win: document.getElementById("snd-win"),
  lose: document.getElementById("snd-lose"),
  chest: document.getElementById("snd-chest"),
};

function playSound(name) {
  const el = sounds[name];
  if (!el) return;
el.currentTime = 0;

if (name === "chest") {
  el.volume = 0.65;
}

el.play().catch(() => {});
}

export { playSound };
