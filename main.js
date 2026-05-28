import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3
} from "@babylonjs/core";

// -------------------------
// SETUP
// -------------------------
const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);
const scene = new Scene(engine);

// -------------------------
// CAMERA
// -------------------------
const camera = new ArcRotateCamera(
  "camera",
  Math.PI / 2,
  Math.PI / 3,
  15,
  Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

// -------------------------
// LIGHT
// -------------------------
new HemisphericLight("light", new Vector3(0, 1, 0), scene);

// -------------------------
// GROUND
// -------------------------
MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

// -------------------------
// CONSTANTS (THERMAL MODEL)
// -------------------------
const L = 6; // rod length
const A = Math.PI * 0.25 * 0.25; // cross-sectional area
const V = 12; // voltage
const I = 2; // current

// -------------------------
// DATA
// -------------------------
const sensors = [];
let temps = [100, 90, 80, 70, 60, 50, 40, 30, 25];
let previousTemps = [...temps];
let steadyCounter = 0;
let steadyState = false;
let kValue = 0;

// -------------------------
// METAL ROD
// -------------------------
const rod = MeshBuilder.CreateCylinder(
  "rod",
  { height: L, diameter: 0.5 },
  scene
);
rod.position.y = 2;

const rodMat = new StandardMaterial("rodMat", scene);
rodMat.diffuseColor = new Color3(0.7, 0.7, 0.7);
rod.material = rodMat;

// -------------------------
// HEATER
// -------------------------
const heater = MeshBuilder.CreateBox("heater", { size: 1 }, scene);
heater.position.x = -4;
heater.position.y = 2;

const heaterMat = new StandardMaterial("hmat", scene);
heaterMat.diffuseColor = new Color3(1, 0, 0);
heater.material = heaterMat;

// -------------------------
// COOLER
// -------------------------
const cooler = MeshBuilder.CreateBox("cooler", { size: 1 }, scene);
cooler.position.x = 4;
cooler.position.y = 2;

const coolerMat = new StandardMaterial("cmat", scene);
coolerMat.diffuseColor = new Color3(0, 0, 1);
cooler.material = coolerMat;

// -------------------------
// THERMOCOUPLES (T1–T9)
// -------------------------
for (let i = 0; i < 9; i++) {
  const sensor = MeshBuilder.CreateSphere(
    `T${i + 1}`,
    { diameter: 0.15 },
    scene
  );

  sensor.position.y = 4 - i * 0.5;

  const mat = new StandardMaterial(`smat${i}`, scene);
  mat.diffuseColor = new Color3(1, 1, 0);
  sensor.material = mat;

  sensors.push(sensor);
}

// -------------------------
// SIMULATION LOOP
// -------------------------
scene.onBeforeRenderObservable.add(() => {

  // -------------------------
  // HEAT DIFFUSION
  // -------------------------
  const newTemps = [...temps];

  for (let i = 1; i < temps.length - 1; i++) {
    newTemps[i] =
      temps[i] +
      0.08 * (temps[i - 1] + temps[i + 1] - 2 * temps[i]);
  }

  newTemps[0] = 100;
  newTemps[8] = 25;

  temps = newTemps;

  // -------------------------
  // UPDATE SENSORS
  // -------------------------
  for (let i = 0; i < sensors.length; i++) {
    const t = temps[i];

    sensors[i].material.diffuseColor = new Color3(
      t / 100,
      0,
      1 - t / 100
    );
  }

  // -------------------------
  // ROD COLOR
  // -------------------------
  const midTemp = temps[4];
  const normalized = (midTemp - 25) / 75;

  rod.material.diffuseColor = new Color3(
    normalized,
    0,
    1 - normalized
  );

  // -------------------------
  // STEADY STATE DETECTION
  // -------------------------
  let diff = 0;

  for (let i = 0; i < temps.length; i++) {
    diff += Math.abs(temps[i] - previousTemps[i]);
  }

  if (diff < 0.5) {
    steadyCounter++;
  } else {
    steadyCounter = 0;
  }

  if (steadyCounter > 120) {
    steadyState = true;
  }

  previousTemps = [...temps];

  // -------------------------
  // THERMAL CONDUCTIVITY (k)
  // -------------------------
  const Q = V * I;
  const deltaT = temps[0] - temps[8];

  if (deltaT !== 0) {
    kValue = (Q * L) / (A * deltaT);
  }

  console.log("k =", kValue);

  // optional steady-state visual
  if (steadyState) {
    rod.material.diffuseColor = new Color3(1, 1, 0);
  }
});

// -------------------------
// RENDER LOOP
// -------------------------
engine.runRenderLoop(() => {
  scene.render();
});