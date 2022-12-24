<h1 align="center">
    Sand
    <br />
    <img src="https://img.shields.io/github/v/release/miscar/Sand?display_name=tag&include_prereleases">
    <img src="https://img.shields.io/badge/platform-windows|linux|macos-lightgray.svg">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
</h1>

<h4 align="center">
    The next-generation FRC dashboard built with <a href="https://tauri.app">Tauri</a>, <a href="https://reactjs.org">React</a> and <a href="https://mantien.dev">Mantine</a>
</h4>

<p align="center">
    <a href="#features">💡 Features</a>
    &nbsp;&middot&nbsp;
    <a href="#getting-started">🚤 Getting Started</a>
    &nbsp;&middot&nbsp;
    <a href="#developing">💻 Developing</a>
    &nbsp;&middot&nbsp;
    <a href="#roadmap">🎯 Roadmap</a>
</p>

## Features

### Design

Sand supports both light and dark mode and one of its goals is to have a good looking user-interface.

<p align="center">
<img width="233" alt="Screenshot 2022-12-24 at 23 38 33" src="https://user-images.githubusercontent.com/63877260/209451560-16e1bed5-bd2d-4a33-a7b4-c9df21c54ced.png">
</p>

### Ease of Use

Sand resembles Shuffleboard so you don't have to get used to different things. Some familiar aspects include the NetworkTables tree view, the drag and drop & grid layout, 

<p align="center">
<img width="577" alt="Screenshot 2022-12-24 at 23 40 00" src="https://user-images.githubusercontent.com/63877260/209451586-d7c8c2ef-d331-4361-85ea-17dbaeabd5e6.png">
</p>

### Keyboard Shortcuts

<p align="center">
<img width="582" alt="Screenshot 2022-12-24 at 23 36 04" src="https://user-images.githubusercontent.com/63877260/209451537-70193efb-6198-4cc5-b90e-c4e7ac807284.png">
</p>

## Getting Started

Simply get the appropriate installer for your OS from the [latest release](https://github.com/MisCar/Sand/releases). This should be a lightweight setup for the application which will automatically prompt you for updates when they are available.

### Connecting to the Robot

In the app settings panel of the Edit tab (with the paste brush icon), enter your robot address. This should be something like `10.TE.AM.2`. Hit save and restart the app, and then you should be connected. Note that Sand uses NT4 so it can only connect to WPILib 2023+ robots.

## Caveats

- While performance seems to be good in our limited testing, and we do try to keep performance as good as possible, it is not a main goal of the project (and indeed React, Mantine, and the code structure reflect quite a bit of room for improvement). Contributions are welcome to address this.
- Web security is quite a complicated topic, and in order to view camera streams Sand must enable unsecure HTTP traffic. This means you should avoid putting non-camera URLs in the Camera widget.

## Developing

- Clone the repository
- Follow the instructions for [tauri and rust](https://tauri.app/v1/guides/getting-started/prerequisites)
- Run `npm install`
- Run `npm run tauri dev`

## Roadmap

- [x] Components
  - [x] Boolean Box
  - [x] Toggle Switch
  - [x] Text View
  - [x] Label
  - [x] Combo-Box Chooser
  - [x] Gauge
  - [x] Graph
  - [x] Field
    - [x] Robot
    - [x] Trajectories
  - [x] Camera
- [x] Robot-side control
- [x] Keyboard shortcuts
- [x] Edit props in-app with a nice GUI
- [ ] Extensions
- [x] Update for NT4

## Acknowledgements

Many things have been implemented as a result of the following:

- [Orbit Dashboard](https://github.com/orbit1690/orbitdashboard)
- [Shuffleboard](https://github.com/wpilibsuite/shuffleboard)
- [FRC Web Components](https://github.com/frc-web-components)
