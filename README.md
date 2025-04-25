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

<div align="center">
  <img src="docs/assets/selected_images/member/Group27.png" alt="Group Photo" width="75%">
</div>

<div align="center">

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>GitHub</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Chengjun Yi</td>
      <td><a href="mailto:lw24658@bristol.ac.uk">lw24658@bristol.ac.uk</a></td>
      <td><a href="https://github.com/realYDIAN">realYDIAN</a></td>
    </tr>
    <tr>
      <td>Qiutong Zhao</td>
      <td><a href="mailto:fa24741@bristol.ac.uk">fa24741@bristol.ac.uk</a></td>
      <td><a href="https://github.com/AQIU20">AQIU20</a></td>
    </tr>
    <tr>
      <td>Heng Zhang</td>
      <td><a href="mailto:gg24694@bristol.ac.uk">gg24694@bristol.ac.uk</a></td>
      <td><a href="https://github.com/chrisheng456">chrisheng456</a></td>
    </tr>
    <tr>
      <td>Tong Yu</td>
      <td><a href="mailto:mp24824@bristol.ac.uk">mp24824@bristol.ac.uk</a></td>
      <td><a href="https://github.com/CelesteYt">CelesteYt</a></td>
    </tr>
    <tr>
      <td>Feihang Yan</td>
      <td><a href="mailto:vj24070@bristol.ac.uk">vj24070@bristol.ac.uk</a></td>
      <td><a href="https://github.com/Feihang027">Feihang027</a></td>
    </tr>
    <tr>
      <td>Xianhang Peng</td>
      <td><a href="mailto:ge24600@bristol.ac.uk">ge24600@bristol.ac.uk</a></td>
      <td><a href="https://github.com/capybara131">capybara131</a></td>
    </tr>
  </tbody>
</table>

</div>

# Kanban Board

- 📋 [**Kanban Board (Jira)**](https://1971026049.atlassian.net/jira/software/projects/KAN/boards/1)  
  _Follow our team’s agile workflow and development progress._

<div align="center">
  <img src="docs/kanban/kanban1.png" alt="Boss Animation" width="580" height="350"/>
  <p><em>Project progress presentation</em></p>
  
</div>
<div align="center">
  <img src="docs/kanban/kanban2.png" alt="Boss Animation" width="580" height="350"/>
  <p><em>Completed tasks demonstration</em></p>
</div>

# Project Report

## Table of Contents



## 1 Introduction

### 1.1 Overview

**Glitchwood** is a **2D roguelike action RPG** developed using P5.js. Players choose from **three uniquely designed characters**—each with distinct combat styles and upgrade preferences—to battle through procedurally generated stages filled with enemies, traps, and unpredictable challenges.

<div align="center">
  <img src="docs/introduction/char.gif" alt="Character Animation" width="580" height="350"/>
  <p><em>Character selection screen.</em></p>
</div>

<div align="center">
  <img src="docs/introduction/boss.gif" alt="Boss Animation" width="580" height="350"/>
  <p><em>Boss battle screen.</em></p>
</div>

The game emphasizes **randomness and replayability**, introducing features like dynamic **weather effects**, **support pets**, **enemy variants**, and **environmental obstacles**. As players progress through increasingly difficult waves, they earn upgrades and eventually unlock an **Endless Mode** to test their endurance.

<div align="center">
  <img src="docs/introduction/pet.gif" alt="Pet Animation" width="580" height="350"/>
  <p><em>Pet selection screen.</em></p>
</div>

<div align="center">
  <img src="docs/introduction/weather.gif" alt="Weather Animation" width="580" height="350"/>
  <p><em>Weather effects screen.</em></p>
</div>

Designed for both **newcomers and roguelike veterans**, Glitchwood includes a built-in tutorial, intuitive controls, and two difficulty levels. Its gameplay is tied to a deeper theme—**a developer lost inside their own creation**, fighting to escape.

---

### 1.2 Inspiration

### 1.2 Inspiration

Our game design was inspired by two modern roguelike hits:

🕹️ **Vampire Survivors**
- Auto-attack gameplay and wave-based enemy spawning  
- Highly addictive loop with evolving upgrades  
- Simple visuals and controls allow for fast iteration  
- ❗ Limitation: Lack of manual input can reduce player agency  
- ✅ Takeaway: We adopted **wave-based survival**, **upgrade choices**, and **enemy escalation**
  
<div align="center">
  <img src="docs/introduction/Vampire_Survivors.jpg" alt="Vampire Survivors" width="580" height="360">
  <p><em>Reference image from the game Vampire Survivors.</em></p>
</div>

🎯 **20 Minutes Till Dawn**
- Twin-stick shooter with precise aiming and movement  
- Strong emphasis on build variety and moment-to-moment action  
- Effective minimalism in both UI and art direction  
- ❗ Limitation: Somewhat short progression loop, less narrative  
- ✅ Takeaway: We embraced **manual aiming**, **responsive controls**, and **fast-paced combat**

<div align="center">
  <img src="docs/introduction/20_Minutes_Till_Dawn.jpg" alt="20 Minutes Till Dawn" width="580" height="350">
  <p><em>Reference image from the game 20 Minutes Till Dawn.</em></p>
</div>

---

Unlike those titles, **Glitchwood** takes a more **symbolic approach**. Here, the player is a developer trapped in their own game, confronting metaphorical bugs, runtime failures, and digital entropy. Every mechanic—from **dynamic weather** to **pets as debugging tools**—echoes real-world challenges in software development.

Working within **P5.js**, we designed modular systems that allow:
- Rapid iteration and extensibility  
- Distinct character behaviors and upgrade paths  
- Thematic consistency between gameplay and metaphor  

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


#### Weather

| Image | Name | Description |
|:-----:|:----:|:-----------|
| <img src="docs/introduction/flake.gif" height="100px"> | **Snow** | Slows the movement speed of both characters and enemies. |
| <img src="docs/introduction/lightning.gif" height="100px"> | **Lightning** | Deals damage to characters and enemies within its range. |
| <img src="docs/introduction/sun.gif" height="100px"> | **Sun** | Causes gradual health loss over time for both players and enemies. |

#### Pets

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

<div align="center">
  <img src="docs/game_idea/Survival_Shooting_Game(Rogue_like_Elements).png" alt="Survival Shooting Game" width="820" height="570">
  <p><em>Creative mind map for the Survival Roguelike game.</em></p>
</div>

**Core Concept**  
A wave-based roguelike where players control one of several programmer-themed characters navigating glitchy environments filled with enemies, hazards, and random upgrades. Players adapt to ever-changing weather, pet abilities, and environmental effects while progressing toward high scores or survival.

**Key Mechanics**
- **Distinct characters** with different combat styles and upgrade preferences
- **Dynamic weather system** (e.g., lightning, snow, sunlight) affecting all characters and enemies
- **Wave-based enemy spawning**, with bosses and random rewards scaling over time
- **Pets with combat effects** (attack, heal, shield), acquired after boss battles
- **Endless mode** and increasing difficulty to encourage replayability
  
<div align="center">
  <img src="docs/game_idea/game1_who.gif" alt="Start Animation" width="580" height="350"/>
  <p><em>Creative character selection screen for the Survival Roguelike game.</em></p>
</div>

<div align="center">
  <img src="docs/game_idea/game1_select.gif" alt="Start Animation" width="580" height="350"/>
  <p><em>Creative pet selection screen for the Survival Roguelike game.</em></p>
</div>

<div align="center">
  <img src="docs/game_idea/game1_attack.gif" alt="Start Animation" width="580" height="350"/>
  <p><em>Creative combat effects screen for the Survival Roguelike game.</em></p>
</div>

**Design Strengths**
- Straightforward system to prototype with paper diagrams and early demos
- Modular enough to design separate upgrade logic, pet effects, and environmental systems
- Compatible with course tools: P5.js, class/use case diagrams, agile iterations

**Paper Prototype Demo**

<div align="center">
  <a href="https://www.youtube.com/watch?v=LU3oWswBsX0" target="_blank">
    <img src="https://img.youtube.com/vi/LU3oWswBsX0/0.jpg" alt="Prototype_Game_Idea_1" width="540" height="400">
  </a>
    <p><em>Early-stage gameplay exploration through paper prototyping.</em></p>
</div>

  ---
  
### 2.2 Game Idea 2: Horror Puzzle RPG

<div align="center">
  <img src="docs/game_idea/Horror_Puzzle_RPG_Game.png" alt="Horror Puzzle RPG Game" width=820" height="570">
  <p><em>Creative mind map for the Horror Puzzle RPG Game.</em></p>
</div>

**Core Concept**  
A time-loop puzzle RPG set in a frozen university lab. Players explore, solve programming-themed puzzles, and uncover hidden experiments to escape a mysterious temporal trap.

**Key Mechanics**
- Environmental puzzles (logic, object-based, memory)
- Repeated time loops revealing more story and areas
- Supernatural horror events and evolving world state
- Multiple endings based on player decisions

<div align="center">
  <img src="docs/game_idea/game2_start.gif" alt="Start Animation" width="580" height="350"/>
  <p><em>Story introduction screen for the Horror Puzzle RPG game.</em></p>
</div>

<div align="center">
  <img src="docs/game_idea/game2_key.gif" alt="Start Animation" width="580" height="350"/>
  <p><em>Item-search and puzzle-solving screen for the Horror Puzzle RPG game.</em></p>
</div>

<div align="center">
  <img src="docs/game_idea/game2_ghost.gif" alt="Start Animation" width="580" height="350"/>
  <p><em>Monster-following gameplay screen for the Horror Puzzle RPG game.</em></p>
</div>

**Design Limitations**
- Requires extensive narrative scripting and state control
- Harder to modularize for team collaboration
- Fewer opportunities for randomness or iterative balance tuning
- Less suited for fast prototyping and testing in P5.js

**Paper Prototype Demo**

<div align="center">
  <a href="https://www.youtube.com/watch?v=HQiOb3xbiVc" target="_blank">
    <img src="https://img.youtube.com/vi/HQiOb3xbiVc/0.jpg" alt="Prototype_Game_Idea_2" width="540" height="380">
  </a>
  <p><em>Walkthrough of story-driven puzzle concepts via paper prototype.</em></p>
</div>

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

<div align="center">
  <img src="docs/requirements/Onion_Model.png" alt="Onion Model of Stakeholders" width="820" height="530">
  <p><em>Onion model for stakeholder analysis.</em></p>
</div>

- **Level 1: System** – *Glitchwood* itself, the game we built.
- **Level 2: Containing System** –  
  - **Testers** who provided feedback and helped us find bugs.  
  - **Players** who care about fun, challenge, and gameplay experience.
- **Level 3: Wider Environment** –  
  - **Instructors** who assessed our work and expected us to apply course knowledge.  
  - **Design inspirations**, including mechanics and themes from other games that influenced our direction.
- **Level 4: External Environment** –  
  - **Game Platform** (GitHub), used for hosting and sharing the game.  
  - **Influencers**, like bloggers or classmates, who may share or comment on the game.  
  - **Competitors**, both student projects and similar games in the market.  
  - **Public**, meaning anyone who might play or hear about the game.

This layered structure helped us consider technical goals, user needs, and broader context throughout development.

---

### 3.2 Epics, User Stories, and Acceptance Criteria

Once stakeholders were defined, we translated their needs into high-level **Epics**, which represent core goals or features. These were then broken down into more detailed **User Stories**, written in the standard format:

> *As a [user], I want [goal], so that [reason].*

To validate each user story, we defined **Acceptance Criteria** using the "Given-When-Then" format, which ensures each requirement is testable and concrete. This helped align our expectations across design and development phases.

The following diagram summarizes the epics, stories, and acceptance criteria across five key stakeholder groups:

<div align="center">
  <img src="docs/requirements/Stakeholder_Requirements.png" alt="Stakeholder Requirements" width="820" height="620">
  <p><em>Stakeholder needs analysis using Epics, User Stories, and Acceptance Criteria.</em></p>
</div>

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

<div align="center">
  <img src="docs/design/ClassDiagram.png" alt="Class Diagram" width="820" height="380">
  <p><em>Class diagram design.</em></p>
</div>

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

<div align="center">
  <img src="docs/design/SequenceDiagram.png" alt="Sequence Diagram" width="820" height="800">
  <p><em>Sequence diagram design.</em></p>
</div>

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

<div align="center">
  <img src="docs/evaluation/interview.png" alt="Interview Responses" width="820" height="1300">
</div>

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

<div align="center">
  <img src="https://github.com/user-attachments/assets/925e05b2-e862-4e1b-9786-8f38dd1fac45" alt="Figure 1: L1 Evaluation" width="820" height="620">
</div>

  > In **L1**, players found the game **easy to use**, with low demand in physical and temporal areas. Frustration levels were mild (20–30 range), aligning with our goal of onboarding new players gently.

<div align="center">
  <img src="https://github.com/user-attachments/assets/7263cf0b-1bda-4787-964c-b5155d597a63" alt="Figure 2: L2 Evaluation" width="820" height="620">
</div>

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
| **Tong Yu**       | Art Design and Front-end UI Development Engineer | Designed the game's art and visual resources, and developed the front-end UI. Worked on animation effects and integrated visual design with gameplay. Conducted a comprehensive review.                             |
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

<div align="center">
  <img src="docs/management/Glitchwood_Management.png" alt="Sequence Diagram" width="820" height="800">
  <p><em> Glitchwood development timeline and team workflow overview.</em></p>
</div>

#### 🗓 Weekly Planning & Review

- Every **Monday**, we held an **offline in-person meeting** to:
  - Review previous progress
  - Plan the weekly development focus
  - Assign tasks based on availability and skill
  - Update our shared Kanban board on GitHub

- Every **weekend**, we held **online meetings** (via Discord/Zoom) where each member:
  - Reported on their individual task completion
  - Flagged blockers or difficulties
  - Synchronized with others on integration points

#### 🌀 Sprint-Based Iteration

- We divided our semester into **bi-weekly Sprints**.
- Each Sprint included:
  - A development focus (e.g., core combat, weather, pets, evaluation integration)
  - A testing goal (e.g., L1 user test, L2 feedback)
  - Mid-sprint check-ins and end-of-sprint reviews

#### 📌 Task Management

- Tasks were tracked using a **GitHub Kanban board**, where columns represented different stages of development: `Backlog`, `In Progress`, `Review`, and `Completed`.
- Each team member was responsible for updating their task status and assigning issues via pull requests.

#### 🔁 Retrospectives & Adaptation

- After each sprint, we reflected on what went well, what needed improvement, and how to better support each other.
- This helped us continuously adjust our process—for example:
  - Shifting from daily stand-ups to weekly async updates
  - Clarifying coding conventions and review standards
  - Rebalancing workload based on exam schedules

By combining clear weekly structure with flexible sprint goals, we stayed coordinated while allowing room for creativity and iteration. This lightweight but disciplined process helped our team deliver a polished and thematically rich final product.

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

The development of *Glitchwood* has been a complex and rewarding journey that challenged our skills in game design, implementation, testing, and ethical responsibility. This section reflects on the full project lifecycle, key technical challenges, our team’s learning outcomes, and how we see the game evolving in the future.

---

### 9.1 What This Project Taught Us

As computer science students, this project allowed us to explore the intersection of creative design and technical development. We followed an **agile development methodology**, organizing work into sprints and refining features through stakeholder feedback and structured evaluations.

A key lesson was the importance of **early architectural planning**—our use of class diagrams and modular structure helped avoid large-scale refactoring later. Additionally, using tools like GitHub, JIRA, and collaborative testing methods helped the team stay aligned throughout the process. Integrating gameplay, narrative, and accessibility pushed us to consider broader user needs while staying technically grounded.

---

### 9.2 Overcoming Key Development Challenges

**Integrating narrative with gameplay** was a major challenge. We iterated extensively to ensure that story elements complemented mechanics rather than disrupting flow. Performance issues with dynamic animations were resolved by simplifying visual logic and testing framerate impact.

Implementing **modular yet interconnected game systems**—such as collision detection, pet abilities, and weather effects—required careful system design. The pet system, in particular, had to feel impactful without overpowering the gameplay. We used encapsulated modules and events to keep these features manageable and testable.

We also prioritized **sustainable performance**, reducing graphical overhead and ensuring the game ran well even on lower-spec devices. These choices reflect our growing awareness of environmentally responsible software design.

---

### 9.3 Takeaways from Collaboration and Testing

Team collaboration proved to be both a challenge and a breakthrough point. Initially, coordination issues and asynchronous work led to delays. Over time, regular check-ins and a shared understanding of user stories helped unify our approach.

Through **heuristic evaluations** and both **qualitative and quantitative testing**, we identified usability issues we hadn’t anticipated—such as vague tutorials or weak feedback for in-game events. These insights led to concrete improvements, from clearer visual cues to simplified onboarding sequences.

We also came to value the balance between **technical feasibility and user experience**, and how small details—like animation timing or interface clarity—can significantly impact gameplay satisfaction.

---

### 9.4 Evolving *Glitchwood*: What Comes Next

Looking forward, we see several directions for future development:

- Introduce **dynamic storylines** influenced by player choices
- Enhance **AI behavior** and real-time environmental responsiveness
- Conduct **broader usability testing** for diverse user profiles
- Continue **performance optimization** and expand hardware compatibility
- Minimize runtime and hosting resource usage for **sustainable deployment**

With these improvements, *Glitchwood* can grow into an even richer, more inclusive game—both technically polished and ethically aligned.

---

In summary, *Glitchwood* has been more than just a game project—it has been an opportunity to apply software engineering principles in a real-world, creative context. We leave this experience with stronger technical skills, deeper design awareness, and a clearer sense of how to build thoughtful, impactful digital experiences.


## 10 Appendix

## 10.1 Contributions of Team Members

| Name          | Contribution                                                                                                                           | Weight |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------|--------|
| **Chengjun Yi**   | Led overall code integration and debugging, ensuring smooth interaction between all modules. Coordinated team activities and handled project management tasks. Contributed to video creation and participated in creative brainstorming sessions. | 1      |
| **Qiutong Zhao**  | Directed and edited the game’s presentation video. Led the narrative design and contributed to creative discussions. Managed team coordination and task allocation, while also assisting with bug tracking and fixing. | 1      |
| **Heng Zhang**    | Implemented core game mechanics such as enemy generation, boss skills, and dynamic weather systems. Took charge of boss skill design and debugging, and actively participated in creative discussions and video creation. | 1      |
| **Tong Yu**       | Designed the game’s visual art and front-end UI, ensuring that animation and design were well integrated with gameplay. Contributed to the storyline development and played a key role in optimizing the project report. | 1      |
| **Feihang Yan**   | Developed the pet system, including its behavior modeling, interaction logic, and state management. Contributed creatively to pet design and participated in video creation. Also assisted with debugging and optimization. | 1      |
| **Xianhang Peng** | Focused on front-end development, including UI elements like the main menu and score display. Played a key role in map design and optimizing the game’s interaction logic. Contributed to video creation and participated in creative brainstorming. | 1      |
