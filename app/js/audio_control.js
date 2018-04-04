function playSound(id, from, to) {
  let instance = createjs.Sound.createInstance(id);

  instance.position = from;
  if (to != 0) instance.duration = to;

  return instance.play();
}


function loadSound(sURL, id) {
  console.log("Loading file " + sURL + ", with id " + id);
  createjs.Sound.registerSound(sURL, id);
}
