# 🐾 Tamagotchi OOP Project
A web-based virtual pet game where users can adopt, name, and care for up to four pets simultaneously. Built with a focus on **Object-Oriented Programming** and **Custom Animations**.
  
<img width="1660" height="844" alt="image" src="https://github.com/user-attachments/assets/b21fc687-306a-4d35-b827-1206da31300d" />

## 📋 Project Context
This project was developed as part of my Frontend Development studies. The goal was to demonstrate proficiency in Object-Oriented Programming (OOP) and Asynchronous JavaScript within a strict two-week sprint.
**The Challenge:** Create a functional Tamagotchi-style game that integrates an external API and manages complex state (timers, stats, and multiple pet instances) simultaneously.
## ✨ Key Features
- **Dynamic Pet Creation:** Choose from 4 animal types or get a random name via the randomuser.me API.
- **Real-time Care:** Manage Energy, Fullness, and Happiness stats.
- **Live History Log:** Tracks every activity ("You played with Maya!") in a scrollable history box.
- **The "Runaway" Logic:** If any stat hits **0**, the pet runs away (removed from DOM), adding a layer of challenge.
- **Tick System:** Stats automatically decrease every 10 seconds using setInterval logic.
## 🎨 My Creative Twist: Animation & Art
As a developer with a background in **Game Development and Animation**, I wanted to push this project beyond the basic requirements:
  
<img width="814" height="205" alt="image" src="https://github.com/user-attachments/assets/9f721614-aa79-4928-bf00-299a147f3afa" />

- **Custom Sprites:** I hand-drew all the assets for each animal type.
- **Idle Animations:** The Dog and Cat have custom idle loops to make the UI feel alive.
- **Action States:** The Dog features special animations for **Feeding** and **Sleeping** to provide immediate visual feedback to the user.

   <img width="1233" height="402" alt="image" src="https://github.com/user-attachments/assets/d0f4eb25-0a03-4194-bffd-f1479796f970" />

## 🚀 Technical Skills Demonstrated
- **OOP Classes:** Used to manage pet states and methods independently.
- **Asynchronous JS:** Using async/await and fetch to grab names from an external API, including error handling (try/catch).
- **Timers:** Managing multiple setInterval instances for concurrent pets.
- **DOM Manipulation:** Dynamically rendering and removing pet cards based on game state.
