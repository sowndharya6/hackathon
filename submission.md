# Thermal Conductivity of Metal Rod – 3D Simulation

### Problem Statement Fit
This project simulates steady-state heat conduction in a metal rod and helps calculate thermal conductivity (k) using Fourier’s Law in an interactive 3D environment.

### Target Users
Engineering students and physics learners who struggle to visualize heat transfer concepts in traditional labs.

### What We Built
A real-time 3D simulation of heat flow through a metal rod with heater, cooler, and 9 thermocouples (T1–T9).

### Core Features
- 3D thermal rod simulation
- Heater and cooler system
- 9 temperature sensors
- Heat diffusion visualization
- Steady-state detection
- Thermal conductivity calculation

### Technical Architecture
Babylon.js renders a 3D scene where a numerical heat diffusion model updates temperature values over time.

### Tech Stack
- Babylon.js
- JavaScript
- Vite
- HTML/CSS

### Innovation / Uniqueness
Turns invisible heat transfer into a fully interactive visual simulation with real-time physics-based computation.

### Demo Instructions
Run project using:
npx vite  
Open: http://localhost:5173  
Observe heat flow and steady-state behavior.

### Known Limitations
- Simplified heat model
- No graph visualization yet
- Console-based k value display

### Future Work
- UI dashboard for k value
- Graph plotting
- Multi-material support
- VR lab integration