# 2025-group-27

2025 COMSM0166 group 27

# Game: Glitchwood

![Glitchwood_Poster](docs/assets/selected_images/poster/Glitchwood.png)

## Quick Start

- 🔗 [**Play the Game Now!**](https://uob-comsm0166.github.io/2025-group-27/)  
  _Launch Glitchwood directly in your browser._

- 📁 [**Source Code Directory**](./docs)  
  _All development files and assets are located in the `/docs` folder._

- 📽️ **Demo Video**: *Coming soon!*  
  _A brief gameplay showcase will be added here when finalized._

# Our Group

![Group_photo](docs/assets/selected_images/member/Group27.png)

|   Name        |   Email                                |   Role |   GitHub                                           |
|:-------------:|:----------------------------------------:|:-------:|:--------------------------------------------------:|
| Chengjun Yi   | [lw24658@bristol.ac.uk](mailto:lw24658@bristol.ac.uk) | TBD     | [realYDIAN](https://github.com/realYDIAN)         |
| Qiutong Zhao  | [fa24741@bristol.ac.uk](mailto:fa24741@bristol.ac.uk) | TBD     | [AQIU20](https://github.com/AQIU20)               |
| Heng Zhang    | [gg24694@bristol.ac.uk](mailto:gg24694@bristol.ac.uk) | TBD     | [chrisheng456](https://github.com/chrisheng456)   |
| Tong Yu       | [mp24824@bristol.ac.uk](mailto:mp24824@bristol.ac.uk) | TBD     | [CelesteYt](https://github.com/CelesteYt)         |
| Feihang Yan   | [vj24070@bristol.ac.uk](mailto:vj24070@bristol.ac.uk) | TBD     | [Feihang027](https://github.com/Feihang027)       |
| Xianhang Peng | [ge24600@bristol.ac.uk](mailto:ge24600@bristol.ac.uk) | TBD     | [capybara131](https://github.com/capybara131)     |

# Kanban Board

- 📋 [**Kanban Board (Jira)**](https://1971026049.atlassian.net/jira/software/projects/KAN/boards/1)  
  _Follow our team’s agile workflow and development progress._

# Project Report

## Table of Contents



## 1 Introduction

### 1.1 Overview

**Glitchwood** is a **2D roguelike action RPG** developed using P5.js. Players choose from **three uniquely designed characters**—each with distinct combat styles and upgrade preferences—to battle through procedurally generated stages filled with enemies, traps, and unpredictable challenges.

<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <img src="docs/introduction/start.gif" alt="Start Animation" width="250"/>
  <img src="docs/introduction/char.gif" alt="Character Animation" width="250"/>
  <img src="docs/introduction/boss.gif" alt="Boss Animation" width="250"/>
</div>

The game emphasizes **randomness and replayability**, introducing features like dynamic **weather effects**, **support pets**, **enemy variants**, and **environmental obstacles**. As players progress through increasingly difficult waves, they earn upgrades and eventually unlock an **Endless Mode** to test their endurance.

<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <img src="docs/introduction/pet.gif" alt="Pet Animation" width="250"/>
  <img src="docs/introduction/weather.gif" alt="Weather Animation" width="250"/>
</div>

Designed for both **newcomers and roguelike veterans**, Glitchwood includes a built-in tutorial, intuitive controls, and two difficulty levels. Its gameplay is tied to a deeper theme—**a developer lost inside their own creation**, fighting to escape.

---

### 1.2 Inspiration

Glitchwood draws inspiration from roguelike games like **Vampire Survivors** and **20 Minutes Till Dawn**, known for their escalating difficulty and minimalist gameplay. We appreciated how these games combined randomness with short-session intensity.

<div style="display: flex; justify-content: space-around;">
  <img src="docs/game_idea/Vampire_Survivors.jpg" height="250px" alt="Vampire Survivors">
  <img src="docs/game_idea/20_Minutes_Till_Dawn.jpg" height="250px" alt="20 Minutes Till Dawn">
</div>

However, as computer science students, we wanted to push further—infusing personal and metaphorical meaning. In Glitchwood, the player is trapped inside their own game, battling symbolic “bugs,” navigating unstable “runtime environments,” and relying on tools (weapons, pets) to debug and survive.

Working within the limits of **P5.js**, we focused on modular systems like wave-based enemy spawning, straightforward combat, and randomized upgrades—balancing feasibility with creative depth.

Ultimately, Glitchwood merges familiar roguelike gameplay with **personal meaning and developer culture**.

---

### 1.3 Innovation

Glitchwood brings several innovations to the roguelike format, blending symbolic design with engaging mechanics.

**Mechanically**, the game offers three characters with distinct **combat roles and upgrade styles**, not a shared progression path. We also introduced a **pet system**: after defeating a boss, players choose a pet (attack, shield, or heal) that influences combat strategy. A **dynamic weather system** further alters gameplay: **snow slows movement**, **lightning causes damage**, and **sunlight drains health**—affecting both players and enemies.

#### Characters

| Image | Name | Description |
|:-----:|:----:|:-----------|
| <img src="docs/assets/selected_images/characters/intro/mousegirl_intro.gif" height="100px"> | **Mousegirl** | Charge-based ranged attacker. Fully charged, deals highest damage. Upgrades focus on bow mechanics. |
| <img src="docs/assets/selected_images/characters/intro/computerboy_intro.gif" height="100px"> | **Computerboy** | Easy-to-use character with strong bullet-based attacks. Upgrades boost attributes and firepower. |
| <img src="docs/assets/selected_images/characters/intro/keyboardman_intro.gif" height="100px"> | **Keyboardman** | Melee fighter with high AoE damage. Needs to stay close. Upgrades emphasize survivability and special traits. |

#### Bosses

| Image | Name | Description |
|:-----:|:----:|:-----------|
| <img src="docs/assets/selected_images/bossgif/Slimeboss.gif" height="100px"> | **Slimeboss** | Classic RPG enemy reimagined as a boss. Four colored forms with different attack patterns. |
| <img src="docs/assets/selected_images/bossgif/Birdboss.gif" height="100px"> | **Birdboss** | Shrine-dwelling boss with dash and restriction skills. Stay outside its range to stay safe. |
| <img src="docs/assets/selected_images/bossgif/Bugboss.gif" height="100px"> | **Bugboss** | Disrupts vision and summons ghost flames. Sudden high-damage attacks — stay alert! |


### Weather

| Image | Name | Description |
|:-----:|:----:|:-----------|
| <img src="docs/introduction/flake.gif" height="100px"> | **Snow** | Slows the movement speed of both characters and enemies. |
| <img src="docs/introduction/lightning.gif" height="100px"> | **Lightning** | Deals damage to characters and enemies within its range. |
| <img src="docs/introduction/sun.gif" height="100px"> | **Sun** | Causes gradual health loss over time for both players and enemies. |

### Pets

| Image | Name | Description |
|:-----:|:----:|:-----------|
| <img src="docs/introduction/fox.gif" height="100px"> | **Blaze** | Attacks enemies, dealing damage to them. |
| <img src="docs/introduction/cow.gif" height="100px"> | **Aegis** | Protects the player, preventing damage from enemies and environmental hazards. |
| <img src="docs/introduction/fairy.gif" height="100px"> | **Aurora** | Heals the player by restoring health over time. |


**Narratively**, the game metaphorically reflects a programmer's journey through burnout, bugs, and problem-solving. These ideas are not explained through text, but embedded in every mechanic.

**Visually**, Glitchwood uses pixel art to reflect different programmer archetypes, with UI elements nodding to coding culture. Combined with minimalist sound effects and dynamic visuals, it creates a distinctive atmosphere.

With two difficulty modes, three bosses, and endless replayability, Glitchwood offers not just challenge, but also introspection.

---

### 1.4 Vision

Glitchwood was created with dual objectives: to deliver a polished and replayable roguelike experience, and to explore how technical and creative systems can reflect real-world development processes.

From a gameplay perspective, our goal was to build modular systems—such as the weather engine, pet integration, and enemy generation—that could be scaled or repurposed. We focused on clean architecture and maintainable code to support future content expansions, difficulty tuning, and possibly co-op play.

Technically, we aimed to push the boundaries of what P5.js can handle in a real-time action game. The project provided valuable experience in managing collisions, animation states, and responsive input under performance constraints.

Looking ahead, Glitchwood could evolve in many directions: deeper roguelike branching, community-designed upgrades, or even as a learning platform to demonstrate code-as-world metaphors. Our vision is to keep expanding Glitchwood not just as a game, but as a **sandbox for experimentation in gameplay, storytelling, and system design**.


## 2 Ideation

Before selecting and developing Glitchwood, our team explored two original game concepts. Each was supported by early design prototypes and system planning. This allowed us to evaluate their creative potential, feasibility within our toolset (P5.js), and suitability for an agile development workflow.

### 2.1 Game Idea 1: Survival Roguelike

![Survival Shooting Game](docs/game_idea/Survival_Shooting_Game(Rogue_like_Elements).png)

**Core Concept**  
A wave-based roguelike where players control one of several programmer-themed characters navigating glitchy environments filled with enemies, hazards, and random upgrades. Players adapt to ever-changing weather, pet abilities, and environmental effects while progressing toward high scores or survival.

**Key Mechanics**
- **Distinct characters** with different combat styles and upgrade preferences
- **Dynamic weather system** (e.g., lightning, snow, sunlight) affecting all characters and enemies
- **Wave-based enemy spawning**, with bosses and random rewards scaling over time
- **Pets with combat effects** (attack, heal, shield), acquired after boss battles
- **Endless mode** and increasing difficulty to encourage replayability
  
<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <img src="docs/game_idea/game1_who.gif" alt="Game1 Who Animation" width="250"/>
  <img src="docs/game_idea/game1_select.gif" alt="Game1 Select Animation" width="250"/>
  <img src="docs/game_idea/game1_attack.gif" alt="Game1 Attack Animation" width="250"/>
</div>

**Design Strengths**
- Straightforward system to prototype with paper diagrams and early demos
- Modular enough to design separate upgrade logic, pet effects, and environmental systems
- Compatible with course tools: P5.js, class/use case diagrams, agile iterations

**Related Materials**

- 📄 [**Game 1 – Survival Roguelike: Design Proposal (PDF)**](./docs/game_idea/Survival_Shooting_Game(Roguelike_Elements).pdf)  
  _Detailed breakdown of the core mechanics, setting, and system design._

- 📹 [**Game 1 – Survival Roguelike: Paper Prototype Demo (Video)**](https://github.com/UoB-COMSM0166/2025-group-27/blob/main/docs/prototype/video/Prototype_Game_Idea_1.mp4)

  [![Prototype_Game_Idea_1](https://img.youtube.com/vi/LU3oWswBsX0/0.jpg)](https://www.youtube.com/watch?v=LU3oWswBsX0)
  
  _Early-stage gameplay exploration through paper prototyping._

  ---
  
### 2.2 Game Idea 2: Horror Puzzle RPG

![Horror Puzzle RPG Game](docs/game_idea/Horror_Puzzle_RPG_Game.png)

**Core Concept**  
A time-loop puzzle RPG set in a frozen university lab. Players explore, solve programming-themed puzzles, and uncover hidden experiments to escape a mysterious temporal trap.

**Key Mechanics**
- Environmental puzzles (logic, object-based, memory)
- Repeated time loops revealing more story and areas
- Supernatural horror events and evolving world state
- Multiple endings based on player decisions

<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <img src="docs/game_idea/game2_start.gif" alt="Game2 Start Animation" width="250"/>
  <img src="docs/game_idea/game2_key.gif" alt="Game2 Key Animation" width="250"/>
  <img src="docs/game_idea/game2_ghost.gif" alt="Game2 Ghost Animation" width="250"/>
</div>

**Design Limitations**
- Requires extensive narrative scripting and state control
- Harder to modularize for team collaboration
- Fewer opportunities for randomness or iterative balance tuning
- Less suited for fast prototyping and testing in P5.js

**Related Materials**

- 📄 [**Game 2 – Horror Puzzle RPG: Design Proposal (PDF)**](./docs/game_idea/Horror_Puzzle_RPG.pdf)  
  _Narrative structure, gameplay loops, and puzzle design overview._

- 📹 [**Game 2 – Horror Puzzle RPG: Paper Prototype Demo (Video)**](https://github.com/UoB-COMSM0166/2025-group-27/blob/main/docs/prototype/video/Prototype_Game_Idea_2.mp4)
  
    [![Prototype_Game_Idea_2](https://img.youtube.com/vi/HQiOb3xbiVc/0.jpg)](https://www.youtube.com/watch?v=HQiOb3xbiVc)
  
  _Walkthrough of story-driven puzzle concepts via paper prototype._

  ---
  
### 2.3 Why We Chose Game Idea 1

After structured comparison, we selected **Game Idea 1** as the foundation for Glitchwood. This decision was based on the following:

- **Better modularity and scalability**: Wave-based combat, pet effects, weather changes, and upgrade logic could be developed in parallel by different team members.
- **Stronger compatibility with course tools**: We could apply use case diagrams, class diagrams, and early paper prototypes effectively.
- **Supports agile iteration**: Core mechanics (spawning, combat, upgrades) could be tested and refined incrementally in sprints.
- **Higher alignment with learning goals**: The idea allowed us to explore randomness, system balance, and symbolic design while reinforcing CS themes (e.g., bugs, debugging, resilience).
- **Better fit for team collaboration**: Each subsystem (combat, environment, pet system) could be assigned clearly, allowing us to coordinate through GitHub and version control.


## 3 Requirements

Throughout the development of *Glitchwood*, we applied structured requirement planning techniques to guide our design and implementation. Specifically, we used tools such as **Epics**, **User Stories**, and **Acceptance Criteria**, which are widely adopted in agile software development. These approaches helped us define goals more clearly, understand different stakeholder needs, and manage the complexity of the project in a collaborative and iterative way.

### 3.1 The Onion Model of Stakeholders

Our first step was to identify all relevant stakeholders involved in or affected by the development of *Glitchwood*. To visualize the relationships and influence between them, we adopted the **Onion Model** of stakeholders, which classifies them into concentric layers from core systems to external environments.

![Onion Model of Stakeholders](docs/requirements/Onion_Model.png)

- **Level 1: System** – Glitchwood (the game itself).
- **Level 2: Containing System** – Testers, Players.
- **Level 3: Wider Environment** – Instructors, Designers, Team Members.
- **Level 4: External Environment** – Game Platform, Influencers, Competitors, Public.

This layered structure helped us balance the technical, experiential, and market considerations during the development process.

---

### 3.2 Epics, User Stories, and Acceptance Criteria

Once stakeholders were defined, we translated their needs into high-level **Epics**, which represent core goals or features. These were then broken down into more detailed **User Stories**, written in the standard format:

> *As a [user], I want [goal], so that [reason].*

To validate each user story, we defined **Acceptance Criteria** using the "Given-When-Then" format, which ensures each requirement is testable and concrete. This helped align our expectations across design and development phases.

The following diagram summarizes the epics, stories, and acceptance criteria across five key stakeholder groups:

![Stakeholder Requirements](docs/requirements/Stakeholder_Requirements.png)

This visual representation allowed us to keep the entire team focused on stakeholder-driven value, while ensuring coverage of both functional and experiential aspects of the game.

---

### 3.3 Applying Requirements to Our Game

This structured planning method guided how we designed *Glitchwood* from the start. Instead of diving directly into coding, we first assessed the goals and concerns of different groups:

- **Players** needed fun and progression, through intuitive controls and immersive combat.
- **Developers** focused on modularity and long-term maintainability.
- **The Game Platform** emphasized user engagement, rating systems, and retention.
- **Publishers** required monetizable gameplay loops with high replayability.
- **The Marketing Team** requested visuals and UI elements that aligned with market trends.

By mapping these needs to specific game features (e.g., combat mechanics, weather system, pet interactions, scalable upgrades), we could ensure each implemented feature directly served user or business value.

---

### 3.4 Reflection and Conclusion

Using Epics, User Stories, and Acceptance Criteria helped us move from vague design ideas to a concrete, testable structure. It reduced miscommunication, supported iterative planning, and clarified the purpose of every system we implemented.

Most importantly, this process improved our **collaboration**, **task management**, and **feature validation**, all of which were crucial for maintaining project velocity. Moving forward, this approach will remain a valuable framework for future projects and professional practice in both game development and software engineering.


## 4 Design

The design phase of our project involved early-stage modeling of key systems to establish a clear architecture, identify core entities, and plan interactions. We focused on three aspects: **system architecture**, **class diagram** (static structure), and **sequence diagram** (behavioral interaction).

### 4.1 System Architecture Overview

We adopted an object-oriented architecture tailored for our game's modular systems. All game elements—player characters, enemies, pets, weather, rewards—are designed as independent yet interactable components. This allowed us to:

- **Scale efficiently**, e.g., adding new weather effects, characters, or reward types  
- **Separate responsibilities**, making code easier to maintain and extend  
- **Support collaborative agile workflows**, with clear subsystem ownership for different team members

---

### 4.2 Class Diagram

The following UML class diagram captures the **static structure** of Glitchwood’s core gameplay systems.

![Class Diagram](docs/design/ClassDiagram.png)

#### 📌 Key Components

- **Field & Figures**  
  - `Field`: Represents the game space and its properties.  
  - `Figures`: Abstract superclass for interactive game objects.

- **Player & Enemy**  
  - `Player`: Holds player stats like `speed`, `HP`, `attackSpeed`, and methods like `move()`, `upgrade()`, `display()`.  
  - `Enemy`: Generic hostile entity with `attack()` and movement logic.  
  - `Boss`: Special subclass with `displayHealthBar()` and higher difficulty.

- **Weapons & Projectiles**  
  - `Sword`, `Gun`, `Bow`: Each weapon type encapsulates specific mechanics (e.g., cooldown, damage type).  
  - `Bullet`: Used for ranged attacks, supports interactions like `touchEnemy()`.

- **Weather Effects**  
  - `Weather`: Base class with `appear()` and `disappear()` methods.  
  - Derived types:
    - `Snow`: Slows all movement.
    - `Thunder`: Causes random area damage.
    - `Sun`: Causes gradual health loss.

- **Reward System**  
  - `Potion`: Restores health or boosts attributes.  
  - `Pet`: Subclasses include:
    - `Bird`: Deals ranged damage.
    - `Cat`: Uses touch-based attacks.
    - `Elf`: Provides healing/shield effects.

---

### 4.3 Sequence Diagram

The following diagram illustrates **dynamic interaction flow** between systems in typical gameplay.

![Sequence Diagram](docs/design/SequenceDiagram.png)

#### 🎮 Key Scenarios

- **Character Selection & Attacks**
  - Player selects a role via `chooseRole()`.
  - Depending on weapon type, performs `attack()`, `shootBullet()`, or `shootArrow()`.

- **Potion Use**
  - The player requests a health potion via `getPotion()` after checking HP.

- **Pet System**
  - Player selects a pet (`choosePet()`), which then follows and supports combat through healing or attack.

- **Boss & Enemy Battles**
  - All enemy types check player HP, perform `attack()`, and apply effects like `heavyAttack()`.

- **Weather Effects**
  - Weather system invokes `affect()` periodically, influencing both players and enemies in real time.

---

### 4.4 Alignment with Course Concepts

Our design process aligns closely with the **COMSM0166 Software Engineering for Games** curriculum:

- ✅ **Object-Oriented Modeling**  
  We followed key OOP principles to abstract behaviors (e.g., `attack()` shared across weapons), use inheritance (e.g., `Enemy` → `Boss`), and encourage polymorphism in systems like `Weather` and `Pet`.

- ✅ **UML Diagrams**  
  We applied two core UML techniques:
  - **Class Diagram**: For static structure and system breakdown  
  - **Sequence Diagram**: For modeling interaction logic across major gameplay actions

- ✅ **Modularity for Agile Teams**  
  By designing loosely coupled components, we enabled multiple developers to work independently on enemies, weapons, pets, and weather logic—ideal for our agile sprints.

- ✅ **Visual Documentation as Communication Tool**  
  These diagrams became essential references in GitHub PR discussions and sprint reviews, helping bridge understanding across technical and non-technical roles in the team.

---

### 4.5 Design Reflection

These early design models were crucial in guiding our team during implementation. They:

- Reduced ambiguity in code responsibilities  
- Provided a foundation for debugging and feature expansion  
- Made onboarding easier when assigning new tasks

As we moved from prototypes to full development, the visual clarity of our architecture helped us iterate faster and avoid major refactors. Looking forward, this structure supports the addition of new levels, enemies, or even multiplayer logic with minimal disruption.


## 5 Implementation

### 5.1 Basic Implement

The implementation of **Glitchwood** revolves around battling enemies, leveling up, and progressing through stages while striving for higher kill counts in endless mode. Players can easily control one of three selectable characters using a combination of keyboard and mouse: the keyboard handles movement, while the mouse controls attacks and attack direction. **The implementation relies primarily on event-related methods such as keyPressed and mouseClicked.**

Characters can engage in both melee and ranged combat, with damage types classified as either single-target or AoE.

The game features four distinct maps, each with procedurally generated obstacles of different styles. These obstacles block both movement and attacks (for both players and enemies). However, certain bosses possess the ability to phase through obstacles. **When a new map is generated, existing obstacles are cleared, and new obstacles are created based on the current wave.**

As for the game logic, enemies spawn outside obstacle zones and at a certain distance from the player’s location. As waves increase, the number of spawning enemies increases. Bosses appear at waves 5, 10, and 15, each bringing unique challenges. **To ensure enemies pursue the player effectively, we calculate the direct line between them and determine the optimal angle for movement along the shortest path.**

Regarding the pet and weather systems, after defeating the first boss, players can choose one of three pets, each granting a unique blessing—such as generating a shield, restoring health, or automatically attacking enemies. Additionally, the game introduces a dynamic weather system that changes every 30 seconds. **This is implemented using time-related functions provided by p5.js, along with random number generation to determine the type of weather effect.**

### 5.2 Code Architecture Overview

The code architecture of **Glitchwood** is modular and follows object-oriented principles. Key components like **Player**, **Enemies**, **Bullets**, **Pets**, and **Weather Effects** are encapsulated in separate classes. This modular design allows us to scale the game and add new features easily without disrupting existing functionalities.

1. **Main Game Loop**:
   - The core game logic is driven by a main loop where the game state is constantly updated, including player movements, collisions, enemy spawning, and state transitions (e.g., between gameplay, pet selection, and boss fights).
   - The loop also handles **event-driven interactions**, using methods like `keyPressed()` for player movement and `mouseClicked()` for attacks.
   
2. **Modular Classes**:
   - **Player Class**: Handles the player character’s attributes, movement, upgrades, and attack mechanisms. It includes both melee and ranged combat modes, as seen in the characters like `Mousegirl` and `Keyboardman`.
   - **Enemy Class**: A superclass for all enemy types, defining basic behaviors like movement, attack patterns, and interactions with obstacles. More complex enemies (e.g., **Bosses**) are subclasses with specialized behaviors.
   - **Bullet Class**: Manages the projectile logic, including hit detection and boundary handling. Specific projectiles like **EnemyBullets** and **WebProjectiles** are subclasses with additional features.
   - **Pet System**: After defeating a boss, players can choose a pet (e.g., shield, attack, healing), and the selected pet follows the player during gameplay, impacting the strategy with unique abilities.
   - **Weather Effects**: The dynamic weather system that alters gameplay every 30 seconds, affecting player and enemy movements (e.g., slowing down in snow or damaging in thunderstorms).

### 5.3 Key Features and Highlights

1. **Dynamic Map and Obstacle Generation**:
   The game generates unique maps with randomized obstacles that block movement and attacks. The **stack-based approach** allows obstacles to be dynamically added and removed as new waves of enemies are generated.

2. **Complex Collision Detection**:
   Collision detection in the game is handled meticulously to ensure a fair and responsive combat experience. **Attack hitboxes** and **enemy collisions** are calculated with precision. The inclusion of **"air walls"** prevents players from exiting the intended play area, using boundary logic.

3. **Pet System**:
   The pet system introduces an additional layer of complexity, allowing players to choose pets with distinct abilities. Each pet follows the player, interacts with the game environment, and impacts gameplay mechanics (e.g., shields, attack boosts, or healing). Ensuring that the pets don't disrupt gameplay balance while adding depth was a key challenge.

4. **Weather System**:
   The weather system influences gameplay significantly, providing varied environmental conditions that players must adapt to. Snow slows movement, lightning damages enemies and players, and sunlight can be both a benefit and a detriment. This system is implemented using **time-based functions** to control the intervals and transitions between different weather conditions.

### 5.4 Challenges Faced in Implementing Game Mechanics

1. **Integrating Story with Gameplay**:
   Blending the narrative into the gameplay without overwhelming players with text or cutscenes was a major challenge. For example:
   - **Background Art & Atmosphere**: Ensuring that the game’s art and atmosphere complemented the theme of being trapped inside a game was important. The visual elements had to balance the story's depth without interfering with gameplay.
   - **Character & Monster Design**: Ensuring that characters and monsters were both visually distinct and functioned well within the game's dynamic environment was tricky. For example, animating enemies to change direction dynamically depending on their movement added complexity, especially in fast-paced combat situations.

2. **Complex Game Mechanics**:
   - **Collision and Boundary Detection**: Fine-tuning the game’s **collision detection** for both enemies and players was complex. Implementing invisible "air walls" around the game world and ensuring that the characters' movements did not interfere with these boundaries was challenging. Moreover, handling **attack hitboxes** and making sure projectiles interacted appropriately with enemies was a critical part of the gameplay.
   - **Obstacle and Pet System Integration**: Dynamic obstacles presented the challenge of creating a flexible system that could spawn and destroy obstacles as waves progressed, while ensuring that the pet system didn't disrupt the balance of the game.

### 5.5 Optimizing Game Performance and Compatibility

**Performance optimization** was a key consideration, especially given the graphical and gameplay complexity. By using **modular coding practices** and optimizing resource-heavy components like animations and special effects, we ensured the game runs efficiently across different devices. However, performance bottlenecks were noted, especially in scenarios with complex weather effects and high enemy counts, which may require future refinements.

### 5.6 Conclusion of the Implementation Challenges

The development of **Glitchwood** involved tackling numerous technical and design challenges, from integrating the narrative into gameplay to optimizing performance. The modular architecture allowed us to develop features iteratively and improve the game based on continuous feedback. Moving forward, there are opportunities to refine the **AI behavior**, **enhance the pet system**, and optimize **performance** further. Each challenge we faced helped us develop a deeper understanding of how to balance creativity, performance, and usability in game development.


## 6 🔍 Evaluation

This section presents both qualitative and quantitative evaluations of our game, **Glitchwood**. We conducted structured user interviews and employed established metrics like **SUS** (System Usability Scale) and **NASA-TLX** (Task Load Index) to assess the game's usability, workload, and player experience across both difficulty modes.

### 6.1 Qualitative Evaluation

#### 🎨 Artistic Style & Interaction Design

- Players praised the **minimalist interface**, especially the clean layout of the character selection screen. The visual tutorial helped new players get started quickly.
- The game's **programmer-themed aesthetic**, including pixel art, code-like icons, and glitch effects, was frequently mentioned as unique and memorable.
- Dynamic elements like **weather effects**, **particle systems**, and **lighting gradients** added visual depth and made each playthrough feel distinctive.

#### ⚔️ Difficulty & Game Flow

- **L1 (Easy Mode)**: All test participants were able to complete the level. Most described the combat rhythm as smooth, upgrade pacing as intuitive, and boss mechanics as well-balanced.
- **L2 (Hard Mode)**: Introduced significantly higher challenge through increased enemy density, more aggressive boss behavior, and frequent random events (e.g., lightning storms). Players found it more stressful but also more rewarding.

#### 🧩 Story & Immersion

- The storyline—centered around a developer trapped in their own creation—resonated with players, especially those with technical backgrounds.
- Characters were described as symbolic yet relatable. Some players recommended **enhancing plot transitions** through more dialogue and scripted events.

#### 🗣️ Focus Group Q&A Summary

![Interview Responses](docs/game_idea/interview.png)

Below is a summary of improvement points derived from Q&A transcripts:

| Issue Area             | User Feedback                                                                 | Improvement Action                                                                 |
|------------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| **Boss Alerts**        | Skills lack audio/visual warnings                                             | Added visual overlays and sound cues during boss charge-up phases                 |
| **Performance Lag**    | Too many visual effects cause frame drops                                     | Implemented object pooling and reduced particle frequency                         |
| **Plot Transitions**   | Some cutscenes feel abrupt or disjointed                                      | Introduced smoother scene fade-ins and narrative pacing tweaks                    |
| **Tutorial Clarity**   | Visuals and text in the guide were scattered and unintuitive                  | Consolidated tutorial content and improved UI alignment                           |

---

### 6.2 Quantitative Evaluation

To validate the experience in **L1 (Easy Mode)** and **L2 (Hard Mode)**, we collected quantitative data using:

- 📊 **System Usability Scale (SUS)**: Assesses ease of use and interface clarity
- 🧠 **NASA-TLX**: Measures user workload across six dimensions: Mental, Physical, Temporal, Performance, Effort, and Frustration

#### 🧠 NASA-TLX Results

In **L1 Mode**, participants reported low mental and physical demand. The average **Mental Demand** was around **60**, compared to **80** in **L2 Mode**. Frustration scores also rose significantly in L2.

#### 🧪 SUS Analysis

Using the **Wilcoxon Signed Rank Test**, we compared SUS and NASA-TLX scores between L1 and L2. Results showed:

- A **statistically significant increase** in workload under L2
- Only a **minor difference** in usability scores, indicating UI remained consistently usable across modes

![Figure 1: L1 Evaluation](https://github.com/user-attachments/assets/925e05b2-e862-4e1b-9786-8f38dd1fac45)

> In **L1**, players found the game **easy to use**, with low demand in physical and temporal areas. Frustration levels were mild (20–30 range), aligning with our goal of onboarding new players gently.

![Figure 2: L2 Evaluation](https://github.com/user-attachments/assets/7263cf0b-1bda-4787-964c-b5155d597a63)

> In **L2**, difficulty led to higher **effort, frustration, and mental load**. Scores for items like "I found the system unnecessarily complex" or "I needed a lot of support" increased, reflecting a more intense experience.

#### 📌 Summary Comparison

| Metric               | L1 Easy Mode                        | L2 Hard Mode                           |
|----------------------|-------------------------------------|----------------------------------------|
| SUS Usability        | High ease-of-use, low complexity    | Slight drop in intuitiveness           |
| NASA Mental Load     | Avg: 60                             | Avg: 80                                |
| Effort & Frustration | Low                                 | High                                   |
| Time Pressure        | Mild decision-making pace           | Required rapid reflex and micro-decisions |

---

### 6.3 Code Test & Usability Interviews

To complement quantitative data, we hosted a web-based test environment via **GitHub Pages**, accessible on both desktop and mobile. We conducted interviews with:

- 👨‍🎓 CS Students
- 🎮 Experienced Gamers
- 💻 Developers

They were asked to test specific mechanics and UI elements. Key takeaways:

| Focus Area           | Key Observations                                               | Adjustments Made                                                               |
|----------------------|----------------------------------------------------------------|---------------------------------------------------------------------------------|
| Boss Combat Feedback | Visual and audio alerts were inconsistent                     | Integrated pre-attack sound cues and UI flashes                                |
| Pet System           | Some pet effects felt invisible or underwhelming              | Added visual trails, glowing icons, and passive activation indicators          |
| Weather Events       | Players missed environmental hazards due to lack of cues      | Introduced top-corner HUD icons for weather type + sound FX                    |
| Scene Transitions    | Battle-to-boss transitions felt jarring                       | Smoothed out fades, added ambient bridge effects                               |

---

### ✅ Conclusion

Our **evaluation process** helped shape a more responsive and accessible gameplay experience. Key insights include:

- L1 mode successfully onboards casual users, while L2 introduces tension and challenge
- Players appreciated the thematic depth and glitch-inspired visuals
- Data highlighted areas like **feedback clarity** and **pet mechanics** as prime targets for iteration
- SUS + NASA-TLX together provided a clear map of user experience stress points

This user-centered approach aligns closely with course goals on **evaluation methodology**, **usability engineering**, and **data-informed iteration**.

## 7 Process

Our team worked closely together throughout the project, ensuring clear communication, efficient collaboration, and a structured development process. This section outlines the team's roles and responsibilities, the tools we used, our Agile development methodology, and the lessons learned from our collaborative experience.

### 7.1 Team Roles and Division of Tasks

To ensure smooth collaboration and development, we clearly defined the roles and responsibilities of each team member. Below is the breakdown of tasks assigned to each member of the team:
| Name          | Role                                             | Responsibilities                                                                                                                                                                                                                                  |
|---------------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Chengjun Yi**   | Lead Developer and Debug Team Leader           | Responsible for overall code architecture, system performance tuning, and ensuring all modules are integrated smoothly. Managed debugging and system-level optimization.                                                                                          |
| **Qiutong Zhao**  | Video Director, Editor, and Coordination Engineer | Directed and edited the presentation video. Coordinated progress within the team and handled task allocation. Contributed to auxiliary logic code, such as bug tracking and fixing.                                            |
| **Heng Zhang**    | Core Development Engineer and Debug Team Member  | Implemented core game logic, including enemy generation, boss skills, collision detection, special effects, and dynamic weather systems. Worked on debugging and feature integration.                                                    |
| **Tong Yu**       | Art Design and Front-end UI Development Engineer | Designed the game's art and visual resources, and developed the front-end UI. Worked on animation effects and integrated visual design with gameplay. Conducted a comprehensive review and optimization of the report.                             |
| **Feihang Yan**   | Pet Systems Engineer and Debug Team Member       | Developed the pet system, including pet behavior modeling, interaction logic, state management, and optimization. Ensured seamless integration of the pet system with the overall game mechanics.                                           |
| **Xianhang Peng** | Front-end Development Engineer                   | Focused on the development of the game’s front-end components, such as the main menu, operation prompts, and score display. Optimized interaction logic and user experience.                                                             |

---

### 7.2 Tools and Collaborative Platforms

To ensure smooth collaboration and efficient development, we utilized the following tools:

#### Version Control and Collaborative Development:
- **GitHub**: Used for version control, ensuring that all code was hosted in a central repository. Each team member worked on their own branch, and code changes were reviewed through **pull requests** before being merged into the main branch. This process helped maintain code quality and minimize conflicts.

#### Task and Project Management:
- **JIRA**: Used for task management. We divided the project into smaller, manageable tasks, assigned deadlines, and tracked progress in real-time. This helped ensure that the team remained on track and that all tasks were completed on time.

#### Communication Tools:
- **WeChat**: Employed for real-time communication, especially when team members could not meet in person. The app facilitated quick communication, shared files, and updates on tasks.
- **Google Meet**: For team meetings and quick virtual check-ins.

#### Design and Visualization Tools:
- **Aseprite**: Used for pixel art creation, including character designs, environmental elements, and animations. This was crucial for maintaining a consistent and retro aesthetic in the game.
- **Figma**: Used to design visual assets like UI components and game environments. Figma allowed for collaborative design, enabling team members to suggest and implement design changes in real-time.
- **UMLEtino**: Used for generating class diagrams and sequence diagrams. This tool allowed us to quickly visualize system architecture and interactions, helping to communicate design decisions across the team.

#### Media and Presentation Tools:
- **Adobe Premiere Pro**: Used for video editing to create the game’s promotional video and demo footage.
- **Adobe Photoshop**: Used for image editing and refining game assets, such as character portraits and item icons.
- **OBS Studio**: Used for screen recording during testing phases to capture gameplay footage for feedback and improvement.

---

### 7.3 Agile Development Methodology and Iteration Process

We followed an **Agile development** approach throughout the project, with a focus on **iterative development** and **continuous feedback**. Our process included the following steps:

#### Sprint Planning and Execution:
- **Sprint Duration**: Each Sprint lasted two weeks, during which we focused on specific features or tasks.
- **Sprint Planning Meetings**: We held meetings at the start of each Sprint to discuss the tasks for the next two weeks, allocate responsibilities, and set deadlines.
- **Daily Stand-ups**: A quick meeting where each team member discussed their progress, any blockers they encountered, and their plans for the day.
- **Sprint Review**: At the end of each Sprint, we demonstrated the completed work, reviewed the progress made, and received feedback.
- **Sprint Retrospectives**: We held meetings at the end of each Sprint to reflect on the process, discuss what went well, and identify areas for improvement.

This iterative process allowed us to remain flexible, quickly adapt to changes, and continuously improve the project based on feedback from both team members and stakeholders.

---

### 7.4 Team Reflection and Continuous Improvement

During the project, we learned several important lessons about collaboration and teamwork. Below are some of the key takeaways:

#### 7.4.1 Reflection on Team Communication
We realized that **active and open communication** is essential for successful teamwork. While **WeChat** and **GitHub** were vital for day-to-day coordination and version control, **face-to-face meetings** proved invaluable for solving complex technical issues. In particular, our “**Game Jam**” meetings helped resolve integration problems and allowed us to brainstorm and find solutions quickly.

#### 7.4.2 Task Management and Workflow Optimization
Through the use of **JIRA** and **Kanban**, we were able to break down tasks into smaller, more manageable components and assign clear responsibilities. This structure allowed for better tracking of progress and ensured that tasks did not fall through the cracks.

#### 7.4.3 Challenges and Adjustments
One of the biggest challenges we faced was the integration of different game modules during the **MVP (Minimum Viable Product)** stage. The parallel development of features led to issues with connecting game states. We solved this problem by holding impromptu meetings to discuss solutions, which ultimately resulted in smoother integration and a better player experience.

We also learned the importance of **flexible planning**. Sometimes tasks took longer than expected, and some features had to be reworked. This required us to continuously re-evaluate our priorities and adjust timelines accordingly.

---

### 7.5 Conclusion

Our collaboration during the development of **Glitchwood** has been highly successful due to clear role definitions, effective use of collaboration tools, and an iterative Agile process. We’ve learned valuable lessons in communication, problem-solving, and teamwork that will be useful for future projects. The experience not only helped us improve the game but also allowed us to develop a deeper understanding of Agile development and its application in real-world projects.


## 8 Sustainability, Ethics, and Accessibility

### 8.1 Environmental Impact
In terms of environmental sustainability, the design of **Glitchwood** incorporates natural elements both in the game’s narrative and technical aspects. The dynamic weather system, which changes every 30 seconds, is inspired by nature and introduces various environmental challenges, such as rain, snow, and lightning, that the player must adapt to. This system not only enhances immersion but also subtly educates players about the unpredictability of environmental changes, helping them to reflect on resource management and the balance within ecosystems.

We have also optimized the game to ensure energy efficiency. This includes minimizing computational resources used for rendering visual effects and animations, which helps reduce the overall carbon footprint of the game. By using energy-efficient coding practices and optimizing graphical assets, the game reduces its environmental impact without sacrificing player experience. However, reflecting on the development process, we acknowledge that further steps could be taken to minimize the carbon impact of the servers used for hosting the game. In the future, we plan to explore more energy-efficient server solutions to further reduce our environmental footprint. **Reflection**: While we have taken steps to optimize energy use within the game, we have not yet fully addressed the impact of hosting and running the game on servers. In future projects, we should prioritize environmentally sustainable hosting options.

---

### 8.2 Social Impact
Social sustainability in **Glitchwood** is represented through the narrative and game design, which encourages reflection on issues like overwork and burnout that are prevalent in the tech industry. The game's central theme is a developer trapped within their own creation, metaphorically addressing the struggles that software developers and tech workers face, such as stress, long working hours, and the toll of constant problem-solving. By integrating these themes into the gameplay, players are invited to engage in a deeper dialogue about the challenges faced by those in the tech industry.

The game’s design also promotes social inclusivity and accessibility. We made sure that different difficulty levels (L1 and L2) are available, so players of all skill levels can enjoy the game. Additionally, by using a color palette that enhances readability and providing adjustable settings, we’ve worked to make **Glitchwood** accessible to people with various disabilities. Feedback from the community is actively integrated, ensuring that the game is continuously evolving to be more inclusive. **Reflection**: We recognize that while we have made efforts to improve accessibility, there is always room for growth. More accessibility features, such as audio cues for visually impaired players or further customizable color schemes, would greatly benefit a wider audience. This is an area where we can continue to refine the design.

---

### 8.3 Technical Impact
Technically, the game employs modular and efficient code, which not only ensures that the system remains maintainable but also promotes long-term sustainability. By structuring the code in a way that allows easy updates and additions, such as incorporating new weather effects or additional character abilities, we ensure that future content can be added without causing significant technical debt.

The decision to use P5.js, a lightweight JavaScript library, was made with performance optimization in mind, ensuring the game runs efficiently across a variety of devices. This choice also supports accessibility, as it makes the game playable on lower-spec hardware, reducing the need for players to have high-performance systems to enjoy the game. **Reflection**: While P5.js was a suitable choice for the scope and goals of the project, its limitations became apparent as we encountered performance bottlenecks in handling more complex game mechanics. In future projects, we might explore more robust frameworks or game engines to provide better performance for more intricate game designs. This would also allow us to implement additional technical features that could enhance gameplay and user experience, without compromising performance.


## 9 Conclusion

The development of **Glitchwood** has been an enriching and multifaceted journey that has not only enhanced our technical capabilities but also challenged our ability to integrate various game development aspects, such as narrative design, game mechanics, and sustainability considerations. As computer science students, this project allowed us to explore the intricate balance between creative design and technical development within the context of game development.

One of the core takeaways from this project is the importance of adopting an **agile development methodology**. Throughout the project, we followed agile principles, breaking the development into manageable sprints. This allowed our team to iterate quickly and refine the game based on continuous feedback from both stakeholders and players. A key part of our agile process was **refining user stories** and **acceptance criteria**, which helped ensure that every feature met the game’s core standards and aligned with user expectations. Moreover, heuristic evaluation was crucial in identifying usability issues early in the process, which helped in keeping the game accessible for both new players and those more experienced in roguelike games.

### 9.1 Key Challenges and Solutions

The most significant challenge we faced was **integrating the narrative with the game mechanics**. Balancing an immersive story with interactive gameplay demanded multiple iterations. For instance, we focused on ensuring the background art, music, and atmosphere were synchronized with the fast-paced combat mechanics to avoid overwhelming the player. Initially, we encountered technical issues with inconsistent frame rates when implementing dynamic animations based on enemy movement directions. To address this, we relied on performance testing and iterated our design to prioritize visual clarity while maintaining smooth gameplay performance.

Another challenge was the **implementation of complex game mechanics** such as collision detection, dynamic obstacles, and the constantly changing weather system. These elements required careful consideration in terms of both design and coding. Our approach was to utilize **modular coding practices**, which allowed us to compartmentalize different game mechanics, ensuring each could be updated or expanded in future iterations without disrupting the overall system. The pet system, for example, required a delicate balance between enhancing player experience and maintaining game balance. We used modular development to integrate this system seamlessly into the game without negatively affecting the core mechanics.

**Sustainability** was also a key focus throughout the development. We optimized the game’s performance by minimizing computational resources used for rendering visual effects and animations, aiming to reduce its environmental footprint. In addition, we ensured that the game was designed with sustainability in mind by applying efficient coding practices and making the game accessible even on lower-spec hardware. This aligns with the growing importance of sustainable game development practices, which we learned during the project.

---

### 9.2 Reflections and Future Work

Reflecting on the development process, one of the most valuable lessons we learned was the significance of **team collaboration** and clear communication. Working with such a diverse team, we quickly realized that regular meetings and continuous collaboration were essential to keeping everyone on the same page. As the project progressed, we adopted more effective communication methods, ensuring smoother coordination between team members. Tools like **JIRA** and **GitHub** allowed us to track our progress and manage tasks efficiently, but face-to-face discussions were crucial for solving more complex issues and brainstorming solutions.

Looking ahead, there are several areas for future improvement and development. **Narrative integration** remains an area that could be further refined. We aim to experiment with **adaptive narrative elements** that dynamically change based on player choices and progress. Additionally, the **AI for enemies and weather dynamics** can be enhanced to create a more responsive and reactive game environment. In terms of usability, more **user testing** will be conducted to ensure the game is accessible to a broader audience, especially those with different levels of experience with roguelike games.

Finally, optimizing the game’s performance, ensuring it runs smoothly on a wider range of devices, and continuing to enhance **sustainability** by reducing the environmental impact of server usage will remain central to our future work. These steps will ensure that **Glitchwood** not only remains an engaging experience for players but also a project that reflects responsible and sustainable game development.

In summary, the development of **Glitchwood** has allowed us to combine agile development, technical challenges, and ethical considerations into a cohesive and rewarding project. The lessons learned during this process, from game design and programming to team collaboration and sustainability practices, will undoubtedly benefit our future careers as developers. We have gained a deeper understanding of how to balance creativity with technical feasibility, and how to design games that are not only enjoyable but also socially and environmentally responsible.


## 10 Appendix

## 10.1 Contributions of Team Members

| Name          | Contribution                                                                                                                           | Weight |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------|--------|
| **Chengjun Yi**   | Led overall code integration and debugging, ensuring smooth interaction between all modules. Coordinated team activities and handled project management tasks. Contributed to video creation and participated in creative brainstorming sessions. | 1      |
| **Qiutong Zhao**  | Directed and edited the game’s presentation video. Led the narrative design and contributed to creative discussions. Managed team coordination and task allocation, while also assisting with bug tracking and fixing. | 1      |
| **Heng Zhang**    | Implemented core game mechanics such as enemy generation, boss skills, and dynamic weather systems. Took charge of boss skill design and debugging, and actively participated in creative discussions and video creation. | 1      |
| **Tong Yu**       | Designed the game’s visual art and front-end UI, ensuring that animation and design were well integrated with gameplay. Contributed to the storyline development and played a key role in optimizing the project report. Also participated in video creation. | 1      |
| **Feihang Yan**   | Developed the pet system, including its behavior modeling, interaction logic, and state management. Contributed creatively to pet design and participated in video creation. Also assisted with debugging and optimization. | 1      |
| **Xianhang Peng** | Focused on front-end development, including UI elements like the main menu and score display. Played a key role in map design and optimizing the game’s interaction logic. Contributed to video creation and participated in creative brainstorming. | 1      |


以下待删除：

## Project Report

### Introduction

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? 

### Requirements 

- 15% ~750 words
- Use case diagrams, user stories. Early stages design. Ideation process. How did you decide as a team what to develop? 

### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game. 

### Evaluation

- 15% ~750 words

- One qualitative evaluation (your choice) 

- One quantitative evaluation (of your choice) 

- Description of how code was tested. 

### Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools did you use. Did you have team roles? Reflection on how you worked together. 

### Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work. 

### Contribution Statement

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent. 

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

- **Documentation** of code (5%)

  - Is your repo clearly organised? 
  - Is code well commented throughout?
