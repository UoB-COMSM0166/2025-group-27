# 2025-group-27

2025 COMSM0166 group 27

# Game: Glitchwood

<div align="center">
  <img src="docs/assets/selected_images/poster/Glitchwood.png" alt="Group Photo" width="120%">
</div>

## Quick Start

- [**Play the Game Now!**](https://uob-comsm0166.github.io/2025-group-27/)  
  _Launch Glitchwood directly in your browser._

- [**Source Code Directory**](./docs)  
  _All development files and assets are located in the `/docs` folder._

- [**Watch the Demo Video**](https://www.youtube.com/watch?v=EkpubyUN88Y/)  
  _See Glitchwood in action with a narrated gameplay showcase._

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

- [**Kanban Board (Jira)**](https://1971026049.atlassian.net/jira/software/projects/KAN/boards/1)  
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
- [Project Report](#-project-report)
  - [Table of Contents](#table-of-contents)
  - [1 Introduction](#1-introduction)
    - [1.1 Overview](#11-overview)
    - [1.2 Inspiration](#12-inspiration)
    - [1.3 Innovation](#13-innovation)
    - [1.4 Vision](#14-vision)
  - [2 Ideation](#2-ideation)
    - [2.1 Game Idea 1: Survival Roguelike](#21-game-idea-1-survival-roguelike)
    - [2.2 Game Idea 2: Horror Puzzle RPG](#22-game-idea-2-horror-puzzle-rpg)
    - [2.3 Why We Chose Game Idea 1](#23-why-we-chose-game-idea-1)
  - [3 Requirements](#3-requirements)
    - [3.1 Stakeholder Identification: The Onion Model](#31-stakeholder-identification-the-onion-model)
    - [3.2 Requirements Analysis: Epics, User Stories, and Acceptance Criteria](#32-requirements-analysis-epics-user-stories-and-acceptance-criteria)
    - [3.3 Applying Requirements to Our Game](#33-applying-requirements-to-our-game)
    - [3.4 Use-Case Diagram and Use-Case Specification](#34-use-case-diagram-and-use-case-specification)
    - [3.5 Reflection and Conclusion](#35-reflection-and-conclusion)
  - [4 Design](#4-design)
    - [4.1 System Architecture Overview](#41-system-architecture-overview)
    - [4.2 Class Diagram](#42-class-diagram)
    - [4.3 Sequence Diagram](#43-sequence-diagram)
    - [4.4 Reflection and Conclusion](#44-reflection-and-conclusion)

  - [5 Implementation](#5-implementation)
    - [5.1 Basic Implementation](#51-basic-implementation)
    - [5.2 Code Architecture Overview](#52-code-architecture-overview)
    - [5.3 Key Features and Highlights](#53-key-features-and-highlights)
    - [5.4 Three Key Technical Challenges in Glitchwood's Development](#54-three-key-technical-challenges-in-glitchwoods-development)
    - [5.5 Reflection and Conclusion](#55-reflection-and-conclusion)
  - [6 Evaluation](#6-evaluation)
    - [6.1 Qualitative Evaluation](#61-qualitative-evaluation)
    - [6.2 Quantitative Evaluation](#62-quantitative-evaluation)
    - [6.3 Code Test \& Usability Interviews](#63-code-test--usability-interviews)
    - [6.4 Reflection and Conclusion](#64-reflection-and-conclusion)
  - [7 Process](#7-process)
    - [7.1 Team Roles and Division of Tasks](#71-team-roles-and-division-of-tasks)
    - [7.2 Tools and Collaborative Platforms](#72-tools-and-collaborative-platforms)
    - [7.3 Agile Development Methodology and Iteration Process](#73-agile-development-methodology-and-iteration-process)
    - [7.4 Team Reflection and Continuous Improvement](#74-team-reflection-and-continuous-improvement)
    - [7.5 Reflection and Conclusion](#75-reflection-and-conclusion)
  - [8 Sustainability, Ethics, and Accessibility](#8-sustainability-ethics-and-accessibility)
    - [8.1 Environmental Impact](#81-environmental-impact)
    - [8.2 Social Impact](#82-social-impact)
    - [8.3 Technical Impact](#83-technical-impact)
    - [8.4 Sustainability-Oriented Requirements](#84-sustainability-oriented-requirements)
  
  - [9 Conclusion](#9-conclusion)
    - [9.1 Lessons Learned from the Project](#91-lessons-learned-from-the-project)
    - [9.2 Overcoming Key Development Challenges](#92-overcoming-key-development-challenges)
    - [9.3 Insights from Collaboration and Testing](#93-insights-from-collaboration-and-testing)
    - [9.4 Future Directions for Glitchwood](#94-future-directions-for-glitchwood)
    - [9.5 Conclusion](#95-conclusion)
  - [10 Appendix](#10-appendix)
    - [10.1 Contributions of Team Members](#101-contributions-of-team-members)
    - [10.2 References](#102-references)

## 1. Introduction

### 1.1 Overview

**Glitchwood** is a browser-based 2D roguelike action RPG developed in **p5.js**, where players control a developer trapped inside their own buggy game world. They choose one of three characters—each with unique combat styles—and survive procedurally generated waves of enemies and dynamic environmental hazards.

Key features include:
- Real-time combat with manual aiming
- Procedural maps and evolving enemy waves
- A **dynamic weather system** that alters gameplay every 30 seconds
- A **pet system** for healing, shielding, or offensive support
- **Boss fights**, unlockable **Endless Mode**, and two difficulty levels

<div align="center">
  <img src="docs/introduction/char.gif" alt="Character Animation" width="580" height="350"/>
  <p><em>Figure 1. Character selection screen.</em></p>
</div>

<div align="center">
  <img src="docs/introduction/weather.gif" alt="Weather Animation" width="580" height="350"/>
  <p><em>Figure 2. Weather effects in gameplay.</em></p>
</div>

<div align="center">
  <img src="docs/introduction/pet.gif" alt="Pet Animation" width="580" height="350"/>
  <p><em>Figure 3. Pet selection screen.</em></p>
</div>

<div align="center">
  <img src="docs/introduction/boss.gif" alt="Boss Animation" width="580" height="350"/>
  <p><em>Figure 4. Boss battle screen.</em></p>
</div>

Beyond mechanics, **Glitchwood** is a metaphor: enemies represent bugs, pets symbolize debugging tools, and environmental chaos mirrors system instability.

---

### 1.2 Inspiration

We drew inspiration from modern roguelikes:

#### Vampire Survivors
Famous for its wave-based structure and randomized upgrades. We adopted:
- Endless wave progression
- Upgrade-based progression
But avoided:
- Auto-attacks; we prioritize manual control for skill-based combat

<div align="center">
  <img src="docs/introduction/Vampire_Survivors.jpg" alt="Vampire Survivors" width="580" height="360">
  <p><em>Figure 5. Vampire Survivors gameplay.</em></p>
</div>

#### 20 Minutes Till Dawn
Offered manual aiming and build diversity. We were inspired by:
- Responsive twin-stick shooting
- Thematic minimalism
- Quick decision-making

<div align="center">
  <img src="docs/introduction/20_Minutes_Till_Dawn.jpg" alt="20 Minutes Till Dawn" width="580" height="350">
  <p><em>Figure 6. 20 Minutes Till Dawn gameplay.</em></p>
</div>

While we borrowed structure from these titles, **Glitchwood’s core theme—"a developer trapped in their own broken system"—is entirely our own.**

---

### 1.3 Innovation

#### 1.3.1 Mechanical Innovation

**Character Selection and Specialization**

| Image | Name | Description |
|-------|------|-------------|
| <img src="docs/assets/selected_images/characters/intro/mousegirl_intro.gif" height="100px"> | **Mousegirl** | Ranged attacker with charged arrows. |
| <img src="docs/assets/selected_images/characters/intro/computerboy_intro.gif" height="100px"> | **Computerboy** | Bullet shooter with straightforward damage. |
| <img src="docs/assets/selected_images/characters/intro/keyboardman_intro.gif" height="100px"> | **Keyboardman** | Melee fighter with AoE damage. |

**Companion (Pet) System**

| Image | Name | Description |
|-------|------|-------------|
| <img src="docs/introduction/fox.gif" height="100px"> | **Blaze** | Auto-attacks enemies. |
| <img src="docs/introduction/cow.gif" height="100px"> | **Aegis** | Generates protective shield. |
| <img src="docs/introduction/fairy.gif" height="100px"> | **Aurora** | Slowly heals the player. |

**Dynamic Weather System**

| Image | Name | Description |
|-------|------|-------------|
| <img src="docs/introduction/flake.gif" height="100px"> | **Snow** | Slows all movement. |
| <img src="docs/introduction/lightning.gif" height="100px"> | **Lightning** | Strikes random areas. |
| <img src="docs/introduction/sun.gif" height="100px"> | **Sun** | Boosts attack speed. |

These mechanics work together to create **emergent gameplay**, requiring players to adapt constantly.

---

#### 1.3.2 Narrative Innovation

Instead of dialogue or cutscenes, **Glitchwood** tells its story through metaphor:
- **Bugs** = enemies
- **Weather** = unstable systems
- **Pets** = debugging tools
- **Bosses** = runtime crashes

This symbolic layer deepens the game experience without breaking immersion.

---

#### 1.3.3 Visual and Thematic Innovation

- **Pixel art** based on hardware motifs (keyboard, mouse, etc.)
- **UI** styled like terminals and dev tools
- **Visual glitches** simulate system corruption
- **Minimalist sound design** creates a sense of digital isolation

These choices reinforce the core narrative: fighting against systemic instability from inside the system itself.

---

### 1.4 Vision

Our vision had two parts:

#### Gameplay Vision
- Deliver high replayability and depth through **modular systems** (weather, pets, upgrades).
- Enable fast content expansion and balance tweaking via object-oriented design.

#### Technical Vision
- Maintain **performance and modularity** within the constraints of browser-based JavaScript.
- Use p5.js to create real-time responsiveness without engine overhead.

#### Long-Term Goals
We imagine Glitchwood evolving into:
- A **sandbox for metaphor-driven gameplay**
- A **teaching tool** for software design and debugging
- A base for **co-op modes**, modding support, or branching narratives

> Every system in Glitchwood—from mechanics to visuals—was crafted not just for playability, but for **meaning**.

[Back to Table of Contents](#table-of-contents)


## 2. Ideation

Before settling on **Glitchwood**, our team explored two original game concepts, each with early-stage prototypes. This allowed us to compare creative potential, technical feasibility in **p5.js**, and compatibility with Agile development.

---

### 2.1 Game Idea 1: Survival Roguelike *(Final Pick)*

This concept laid the foundation for Glitchwood:  
A wave-based survival game with procedurally generated content, manual combat, randomized upgrades, and symbolic game systems.

#### Core Gameplay Loop:
- Choose a character (ranged, melee, or gun-based)
- Survive enemy waves
- Gain XP and unlock upgrades
- Defeat bosses
- Pick a pet after each boss
- Survive or unlock **Endless Mode**

<div align="center">
  <img src="docs/game_idea/Survival_Shooting_Game(Rogue_like_Elements).png" alt="Mind map" width="820" height="570">
  <p><em>Figure 7. Mind map of Game Idea 1.</em></p>
</div>

#### Early Prototypes

**Character Selection**  
Each character had unique weapons and scaling attributes.

<div align="center">
  <img src="docs/game_idea/game1_who.gif" alt="Character Selection" width="580" height="350"/>
  <p><em>Figure 8. Early character selection prototype.</em></p>
</div>

**Pet Selection**  
Players choose between attack, shield, or healing support.

<div align="center">
  <img src="docs/game_idea/game1_select.gif" alt="Pet Selection" width="580" height="350"/>
  <p><em>Figure 9. Pet selection screen prototype.</em></p>
</div>

**Combat Flow**  
Manual aiming and real-time enemy pursuit.

<div align="center">
  <img src="docs/game_idea/game1_attack.gif" alt="Combat Preview" width="580" height="350"/>
  <p><em>Figure 10. Core combat gameplay.</em></p>
</div>

#### Strengths
- Highly **modular**: Easy to assign subsystems to different developers
- Well-suited to **Agile sprints** and early testing
- Compatible with **p5.js**
- Designed for **replayability**

---

### 2.2 Game Idea 2: Horror Puzzle RPG *(Rejected)*

A narrative-driven horror game, set in a frozen university lab where the player solves programming-themed puzzles across time loops.

#### Gameplay Concepts
- **Exploration and puzzle-solving** across a looping timeline
- **Narrative discovery** through environmental clues
- **Horror elements**: sudden disruptions, ghost chases
- **Code-based puzzles** and logic circuits

<div align="center">
  <img src="docs/game_idea/Horror_Puzzle_RPG_Game.png" alt="Mind map" width="820" height="570">
  <p><em>Figure 11. Mind map of Game Idea 2.</em></p>
</div>

#### Prototypes

**Intro Sequence**  
Narrative-based start using text overlays.

<div align="center">
  <img src="docs/game_idea/game2_start.gif" alt="Intro" width="580" height="350"/>
  <p><em>Figure 12. Story opening prototype.</em></p>
</div>

**Puzzle Interaction**  
In-world object puzzles and input systems.

<div align="center">
  <img src="docs/game_idea/game2_key.gif" alt="Puzzle Interaction" width="580" height="350"/>
  <p><em>Figure 13. Key-item puzzle prototype.</em></p>
</div>

**Monster Encounter**  
Chase scenes with loop resets on failure.

<div align="center">
  <img src="docs/game_idea/game2_ghost.gif" alt="Ghost Scene" width="580" height="350"/>
  <p><em>Figure 14. Horror-chase prototype.</em></p>
</div>

#### Limitations
- Complex scripting and branching logic
- Less modular: Harder to divide tasks
- Difficult to test iteratively
- Time-intensive for non-linear scene management

---

### 2.3 Why We Chose Game Idea 1

After comparing both concepts, we chose **Game Idea 1** due to:

#### 1. **Modular Design**
Its subsystems (combat, weather, pets, upgrades) could be developed in parallel, enabling individual ownership and faster iteration.

#### 2. **Agile-Friendly**
We could test combat, UI, and difficulty tuning from the first sprint onward—unlike the story-heavy RPG which required full scripting before meaningful playtests.

#### 3. **Better Fit for Tools**
**p5.js** is well-suited to real-time 2D action games. The horror RPG’s scene logic and looping systems would have been more difficult to manage in this environment.

#### 4. **Conceptual Flexibility**
We could embed deeper themes (developer burnout, system instability) through metaphor in a roguelike. The symbolic framing gave us narrative room without needing cinematic storytelling.

---

> In short, **Game Idea 1** offered greater creative freedom, clearer technical scope, and a better match for our development approach.

[Back to Table of Contents](#table-of-contents)

## 3. Requirements

To guide development, we adopted **agile requirement planning** using tools like **Epics**, **User Stories**, and **Acceptance Criteria**. These helped align team vision, stakeholder needs, and technical execution.

---

### 3.1 Stakeholder Identification – The Onion Model

We used the **Onion Model** to identify all stakeholders, from direct users to broader contextual influences.

<div align="center">
  <img src="docs/requirements/Onion_Model.png" alt="Onion Model of Stakeholders" width="820" height="530">
  <p><em>Figure 17. Stakeholder Onion Model for Glitchwood.</em></p>
</div>

#### Layers Explained:

- **Core**: The system itself (*Glitchwood*)
- **Inner Ring**: Primary users — players and testers
- **Middle Ring**: Instructors, design inspirations (e.g., *Vampire Survivors*)
- **Outer Ring**: Platform (GitHub Pages), public users, potential influencers

This mapping ensured we designed with both gameplay and academic context in mind.

---

### 3.2 Requirements Modeling

We derived formal requirements in three steps:

#### 1. Define Epics  
Grouped stakeholder needs into 5 major themes:
- Game progression & difficulty
- Upgrade balance
- UI/UX clarity
- Deployment & performance
- Symbolic/educational value

#### 2. Write User Stories  
Using the agile format:
> *As a [type of user], I want [feature], so that [benefit].*

Example:
> *As a casual player, I want an Easy Mode so that I can enjoy the game without being overwhelmed.*

#### 3. Set Acceptance Criteria  
Based on the **Given–When–Then** format:

> **Given** I’m playing the game  
> **When** 30 seconds pass  
> **Then** a new weather effect should trigger and alter gameplay conditions

---

### 3.3 Requirements in Practice

Each system was directly informed by stakeholder-centered requirements.

#### Players:
- Easy and Hard modes
- Tutorial overlay
- Clear upgrade UI
- Responsive controls

#### Developers:
- Modular weather, upgrade, and pet systems
- Git-based collaboration and code reviews
- Object-oriented architecture

#### Instructors:
- Use-case and UML diagrams
- Maintainable, readable codebase
- Demonstrated traceability between design and outcome

#### Platform:
- Browser-based p5.js game
- Optimized for lightweight deployment on GitHub Pages

<div align="center">
  <img src="docs/requirements/Stakeholder_Requirements.png" alt="Requirements Mapping" width="820" height="620">
  <p><em>Figure 18. Mapping user stories to epics and stakeholders.</em></p>
</div>

---

### 3.4 Use Case Diagram

We built a **Use Case Diagram** to visualize system interactions.

<div align="center">
  <img src="docs/requirements/use_case_diagram.png" alt="Use Case Diagram" width="1100" height="580">
  <p><em>Figure 19. Use case diagram for Glitchwood.</em></p>
</div>

#### Key Actors:
- **Player**: Starts the game, fights enemies, selects pets, upgrades, and enters endless mode
- **Developer**: Releases new content or bug fixes

#### Representative Use Case: “Complete Game Run”

| Step | Description |
|------|-------------|
| 1 | Player selects character and difficulty |
| 2 | Survives waves, upgrades character |
| 3 | Defeats boss → selects pet |
| 4 | Repeats until Wave 15 |
| 5 | Enters **Endless Mode** or finishes game |

**Special Cases**:  
- Weather triggers every 30 seconds  
- Bosses appear every 5 waves  
- Game ends on player death or wave completion

---

### 3.5 Reflection

Our structured requirements process helped us:

- Convert ideas into **concrete, testable goals**
- Support **parallel development** via modularity
- Align game mechanics with **stakeholder expectations**

By grounding all features in **user stories** and **acceptance criteria**, we ensured that Glitchwood evolved with clarity, cohesion, and purpose.

> Clear requirements didn’t limit creativity — they focused it.

[Back to Table of Contents](#table-of-contents)

## 4 Design

The design phase of our project involved early-stage modeling of key systems to establish a clear architecture, identify core entities, and plan interactions. We focused on three aspects: **system architecture**, **class diagram** (static structure), and **sequence diagram** (behavioral interaction).

### 4.1 System Architecture Overview

Glitchwood was developed using a modular, object-oriented architecture, allowing each core game component to function independently while contributing to a cohesive gameplay loop. This design not only supported parallel development but also ensured system flexibility during iteration and testing.

---

#### Core Architectural Principles

We structured the game around three main principles:

- **Encapsulation**: Each system or entity manages its own state and behavior.
- **Separation of Concerns**: Logic for combat, environment, UI, and game state is divided cleanly across modules.
- **Extensibility**: New content—such as enemies, weapons, weather types, or upgrades—can be introduced with minimal refactoring.

---

#### Major Subsystems

The architecture is organized into the following high-level subsystems:

1. **Entity System**  
   - Includes `Player`, `Enemy`, `Boss`, and `Pet` classes.
   - Each entity contains its own stats, animation logic, and interaction methods.
   - Common interfaces (e.g., `move()`, `attack()`, `display()`) support polymorphism and code reuse.

2. **Combat and Upgrade Engine**  
   - Handles weapon logic (`Sword`, `Bow`, `Gun`) and projectile behavior (`Bullet`, `Arrow`).
   - Upgrade effects are managed separately and injected into player actions at runtime.
   - Pets apply passive or triggered effects through independent update loops.

3. **Environment System**  
   - Manages map generation, collision boundaries, and obstacle behavior.
   - The **weather engine** triggers effects every 30 seconds, modifying global attributes like speed or damage.
   - Weather logic is fully decoupled from player and enemy code, using global modifiers.

4. **State Management and UI Flow**  
   - Central controller manages transitions between screens: title, gameplay, boss phase, pet selection, and score screen.
   - Game states are synchronized through a global `gameState` variable and modular `scene()` handlers.
   - UI elements (e.g., health bar, upgrade choices, weather indicators) are layered cleanly over the game canvas.

---

This structure enabled our team to develop and test features in isolation, minimizing integration issues. For example, the weather system was developed independently, then connected to the core game loop through shared global variables and timing hooks. Similarly, pets were designed as self-contained agents with their own AI routines.

By prioritizing modularity and responsibility isolation, we created a flexible codebase capable of supporting further features such as cooperative multiplayer, branching narrative modes, or new progression systems.

---

### 4.2 Class Diagram

To define the static structure of our system, we created a UML **class diagram** that models the core components and their relationships. This diagram guided our implementation of object-oriented principles such as inheritance, composition, and polymorphism.

The diagram below outlines how we organized key gameplay systems around modular, extensible classes.

<div align="center">
  <img src="docs/design/ClassDiagram.png" alt="Class Diagram" width="820" height="380">
  <p><em>Figure 20. UML class diagram of core gameplay systems.</em></p>
</div>

---

#### 1. Entity System: Player, Enemy, and Boss

- `Figures` is an abstract superclass for all visible, interactive units.
- `Player` extends `Figures`, adding attributes like `HP`, `speed`, `attackSpeed`, and methods such as `move()`, `upgrade()`, `display()`.
- `Enemy` is a parallel subclass with simplified behavior; `Boss` extends it with unique skills and health bars.

> **Design rationale**: Using shared base classes allows polymorphism in rendering, hit detection, and updates—reducing duplicated logic.

---

#### 2. Weapon and Projectile System

- `Sword`, `Gun`, and `Bow` represent distinct weapon behaviors and cooldown systems.
- All ranged weapons create `Bullet` or `Arrow` objects, which manage trajectory, collision, and on-hit effects.

> **Design rationale**: Weapon behavior is encapsulated per type, but all projectiles inherit from a shared template for consistency in timing and damage application.

---

#### 3. Environmental Effects: Weather System

- `Weather` is a base class with abstract methods like `appear()` and `disappear()`.
- Subclasses like `Snow`, `Thunder`, and `Sun` override these methods to implement unique effects:
  - `Snow`: Reduces movement speed
  - `Thunder`: Triggers random area damage
  - `Sun`: Increases attack speed

> **Design rationale**: The weather system uses polymorphic behavior to allow easy addition of new weather types without modifying core logic.

---

#### 4. Rewards and Support Systems

- `Potion` grants immediate attribute boosts.
- `Pet` is a superclass; subclasses like `Bird`, `Cat`, and `Elf` implement attack, shield, and healing behaviors respectively.

> **Design rationale**: By modeling pets as entities with their own logic cycles, we were able to treat them as semi-autonomous units, reducing code coupling with the player.

---

This object-oriented structure made our codebase both scalable and maintainable. It supported clean abstraction boundaries, easy debugging, and the addition of new content without major refactoring.

---

### 4.3 Sequence Diagram

To represent dynamic interactions during gameplay, we developed a **sequence diagram** outlining how key system components communicate during a typical session. This helped us identify dependencies, clarify input-response flows, and balance system update frequency.

---

<div align="center">
  <img src="docs/design/SequenceDiagram.png" alt="Sequence Diagram" width="820" height="800">
  <p><em>Figure 21. Sequence diagram illustrating core gameplay interactions.</em></p>
</div>

---

#### Overview of Flow

The diagram models a complete interaction loop—from character selection to combat and weather updates. It can be divided into four stages:

---

#### 1. Initialization and Character Selection

- Player interacts with the UI to invoke `chooseRole()`, setting internal player attributes.
- Selected character object is instantiated with role-specific stats and weapon behavior.

> This ensures all combat logic downstream is initialized based on selected parameters.

---

#### 2. Combat and Attack Handling

- The player invokes `attack()` using input events (`keyPressed`, `mouseClicked`).
- Depending on the weapon type:
  - `swordAttack()`, `shootBullet()`, or `shootArrow()` is called.
- Projectiles are instantiated and execute `move()` and `checkCollision()` every frame.

> This decouples player input from projectile logic, allowing each attack to behave autonomously.

---

#### 3. Enemy and Boss Logic

- Enemies and bosses poll `checkPlayerDistance()` each update cycle to determine action.
- If within range, `attack()` is triggered.
- Bosses may invoke advanced methods like `heavyAttack()` or `summon()`.

> This supports scalable enemy AI and varied challenge levels, with no logic duplication.

---

#### 4. Pets and Environmental Interaction

- Upon being unlocked, the pet object executes `follow()` each frame, using interpolation.
- Depending on pet type:
  - `healPlayer()`, `blockDamage()`, or `autoAttack()` is invoked periodically.
- Simultaneously, the global `WeatherSystem` monitors a 30-second timer and calls `triggerEffect()` when conditions change.

> These non-player systems enrich gameplay without disrupting the main loop.

---

This sequence model clarified the distinction between **frame-based passive updates** (e.g., movement, collision) and **event-driven interactions** (e.g., attacks, weather shifts). It also helped us schedule updates efficiently and avoid logic conflicts during overlapping events like weather change + boss skill.

---

### 4.4 Reflection and Conclusion

The design phase of Glitchwood was guided by core software engineering principles, with an emphasis on maintainability, modularity, and clarity. This section reflects on how object-oriented design (OOD) and UML modeling supported our development process.

---

#### Applying Object-Oriented Design in Practice

We made extensive use of OOD principles such as:

- **Encapsulation**: Each system (e.g., pets, projectiles, weather) managed its own state and update cycle, minimizing side effects.
- **Inheritance**: Shared behaviors—like `move()`, `display()`, `attack()`—were defined in abstract base classes (`Figures`, `Weather`) and reused across player, enemy, and pet systems.
- **Polymorphism**: Core methods like `attack()` or `triggerEffect()` had variant behaviors depending on object type, simplifying decision logic and enabling flexible expansion.
- **Composition**: Complex systems (like pets or projectile chains) were built by combining smaller, reusable components.

This allowed us to reduce coupling and support iterative changes without widespread code rewriting.

---

#### Role of UML Diagrams in Team Collaboration

The **class diagram** gave us a shared structural reference before implementation, clarifying object responsibilities and enabling consistent naming conventions across modules.

The **sequence diagram** helped us identify timing conflicts, passive vs. active logic, and the order in which game systems should be updated. This was especially useful when coordinating input, weather transitions, and boss mechanics.

Together, these diagrams functioned as communication tools—both within the dev team and when presenting system behavior to non-coders or during report writing.

---

#### Outcomes and Future Readiness

Thanks to our architectural planning, we were able to:

- Rapidly add new content (e.g., pets, weather types, bosses) with minimal refactoring
- Assign team members to distinct systems with limited overlap
- Implement smooth transitions between states (e.g., combat → pet selection → infinite mode)

This architecture lays a strong foundation for future extensions such as multiplayer support, branching narratives, or a level editor. The scalability we built in early has enabled Glitchwood to grow without compromising structural integrity.

> Ultimately, our design decisions ensured not only a functional game, but also a clean, extensible, and collaborative codebase—ready for the next stage of evolution.

[Back to Table of Contents](#table-of-contents)
## 4. Design

The design phase established Glitchwood’s architecture using UML diagrams and object-oriented principles. This guided scalable development and supported team collaboration.

---

### 4.1 System Architecture Overview

Glitchwood is organized into modular subsystems to support extensibility, performance, and parallel development.

#### Core Design Principles:
- **Encapsulation**: Each system manages its own state and logic
- **Separation of Concerns**: Combat, UI, environment, and state logic are independent
- **Extensibility**: New content (pets, weather, upgrades) can be added with minimal changes

#### Major Subsystems:
1. **Entity System**:  
   Includes `Player`, `Enemy`, `Boss`, and `Pet` classes  
2. **Combat & Upgrade Engine**:  
   Manages weapons, projectiles, and modular upgrade effects  
3. **Environment System**:  
   Procedural map generation and dynamic weather effects  
4. **State Manager & UI**:  
   Controls game scenes (start, wave, boss, pet selection) and UI overlays

> This architecture enabled separate teams to implement features independently without code conflicts.

---

### 4.2 Class Diagram

We used UML to define key classes and their relationships.

<div align="center">
  <img src="docs/design/ClassDiagram.png" alt="Class Diagram" width="820" height="380">
  <p><em>Figure 20. UML class diagram of core systems.</em></p>
</div>

#### Key Inheritance Patterns:
- `Figure` → Base class for `Player`, `Enemy`, `Boss`
- `Pet` → Superclass for `Healer`, `Attacker`, `Defender`
- `Weather` → Extended by `Snow`, `Thunder`, `Sun`
- `Weapon` → Specific logic for `Sword`, `Bow`, `Gun`

> Shared interfaces enabled polymorphism in update/render/attack methods, reducing redundancy and improving testability.

---

### 4.3 Sequence Diagram

To visualize runtime behavior, we created a sequence diagram for a full gameplay loop.

<div align="center">
  <img src="docs/design/SequenceDiagram.png" alt="Sequence Diagram" width="820" height="800">
  <p><em>Figure 21. Sequence diagram showing real-time system interactions.</em></p>
</div>

#### Phases:
1. **Initialization**: Character and difficulty selection
2. **Combat**: Player attacks → projectiles spawn → collision and damage checks
3. **Enemy AI**: Basic pursuit + boss-specific skills
4. **Pets**: Follow player and trigger actions independently
5. **Weather System**: Activates new effect every 30 seconds

> This helped us coordinate time-based systems like weather and pet effects with real-time combat and player input.

---

### 4.4 Reflection and Conclusion

Our design phase prioritized maintainability and future extensibility. Key takeaways:

#### Object-Oriented Benefits:
- **Encapsulation**: Pets, weather, and projectiles manage their own logic
- **Inheritance & Polymorphism**: Simplified code reuse across entity types
- **Composition**: Pets combine movement and AI behavior for reusable logic

#### Diagram Value:
- **Class Diagrams** clarified team roles and naming conventions
- **Sequence Diagrams** prevented logic conflicts between time-based and event-based systems

#### Result:
- Smooth integration of independent modules (pets, bosses, weather)
- Minimal coupling and high scalability
- Strong foundation for potential features like multiplayer or mod support

> Good design doesn't just support the present—it prepares for the future.

[Back to Table of Contents](#table-of-contents)

## 5. Implementation

Glitchwood’s implementation phase turned architectural plans into a real-time, responsive browser game. We focused on modular systems, player interaction, and scalable logic—all powered by p5.js.

---

### 5.1 Core Gameplay Loop

The game operates in a continuous loop via `draw()` in p5.js, combining real-time input, timed events, and modular systems.

#### Key Components:
- **Input Handling**:  
  - `WASD` keys for movement  
  - Mouse for aiming and attacking  
- **Combat Flow**:  
  - Each character uses a unique weapon (`Sword`, `Gun`, `Bow`)  
  - Projectiles manage their own motion, lifespan, and effects  
- **Procedural Map Generation**:  
  - Obstacles are randomly placed each wave  
  - Maps ensure safe zones around player spawn  
- **Enemy Spawning**:  
  - Spawn from edges  
  - Scale with wave count  
  - Bosses appear on waves 5, 10, and 15  

#### Independent Systems:
- **Pet AI**:  
  Follow and assist the player (heal, shield, or attack)
- **Weather Engine**:  
  Triggers new global effects every 30 seconds  
  (e.g., Snow slows movement; Thunder causes AoE damage)

> These systems are loosely coupled, making them easy to test and extend.

---

### 5.2 Code Structure

We applied OOP and event-driven design to separate logic cleanly.

#### Architecture Highlights:
- **Game States** (`start`, `wave`, `boss`, `selectPet`, `gameOver`)  
  Controlled via a central `gameState` variable
- **Modular Classes**:  
  - `Player`: Movement, weapon use, upgrades  
  - `Enemy` & `Boss`: Targeting logic, phase skills  
  - `Pet`: AI loop, collision handling  
  - `Weather`: Timed activation, unique effects  
  - `Projectile`: Self-managed collisions and effects

> Every object handles its own update and display functions, simplifying the main loop.

---

### 5.3 Key Features

#### 1. Procedural Map Generation

- New obstacle layouts every wave  
- Avoids player spawn zone  
- Forces adaptive positioning

#### 2. Collision Detection

- Centralized `checkCollision()` logic  
- Custom hitboxes for fast-moving projectiles  
- Air walls prevent off-screen movement

#### 3. Pet System

- Pets follow the player via `lerp()`  
- Action cooldowns and smart targeting  
- Modular classes for `Healer`, `Attacker`, `Defender`

#### 4. Weather Engine

- Timer triggers effect every 30 seconds  
- Polymorphic subclasses (`Snow`, `Thunder`, `Sun`)  
- Affects player and enemies equally

> These systems create dynamic, emergent gameplay where each run feels different.

---

### 5.4 Technical Challenges

#### 1. Collision Precision

**Problem**: Fast-moving projectiles and group enemies caused inconsistent collisions  
**Solution**: Custom hitboxes + centralized `checkCollision()` in all entities

#### 2. Pet Navigation with Dynamic Maps

**Problem**: Pets got stuck when new obstacles regenerated  
**Solution**: Recalculate target offset after map reset; smooth with `lerp()`  
<div align="center">
  <img src="docs/implementation/code2_image.png" alt="Pet AI Code" width="955" height="324">
  <p><em>Figure 22. Pet follow and attack logic.</em></p>
</div>

#### 3. Upgrade Interactions (Pierce + Split)

**Problem**: Stacked upgrade effects created nested condition chaos  
**Solution**: Move logic into the `Arrow` class; let each projectile decide behavior  
<div align="center">
  <img src="docs/implementation/code_image.png" alt="Arrow Logic" width="820" height="345">
  <p><em>Figure 23. Independent projectile logic for upgrades.</em></p>
</div>

> These refactors made systems modular, scalable, and easier to debug.

---

### 5.5 Reflection

#### Lessons Learned:
- **Modular systems are worth the setup**  
  Refactoring mid-project to isolate logic paid off in debugging and flexibility  
- **Encapsulation simplifies testing**  
  Pets, upgrades, and weather systems could be tested in isolation  
- **Performance must be monitored early**  
  Collision checks were a major bottleneck during high enemy density

#### Opportunities for Future Improvement:
- Use spatial partitioning for collision efficiency  
- Create a data-driven upgrade registry (e.g., JSON)  
- Implement a publish-subscribe system for event coordination

> Implementation was not just about building features—it was about building systems that could survive complexity.

[Back to Table of Contents](#table-of-contents)

## 6. Evaluation

We evaluated Glitchwood through both qualitative and quantitative methods to assess usability, workload, and gameplay clarity across difficulty modes.

---

### 6.1 Qualitative Testing

We conducted a **Think-Aloud Protocol** and **Post-Game Interviews** with players of different backgrounds.

#### Think-Aloud Observations (6 Players):

| Area           | Player Feedback                              | Action Taken                                   |
|----------------|-----------------------------------------------|------------------------------------------------|
| Pets           | Effects not clear                             | Added icons and particles for feedback         |
| Weather        | Sudden changes caused confusion               | Added HUD icons and ambient sounds             |
| Boss Attacks   | Lacked warning cues                           | Introduced pre-attack animations and flashes   |
| Pause Feature  | Not discoverable                              | Showed pause key (`P`) in UI and tutorial      |

> These changes improved game feedback, pacing, and clarity during stressful gameplay moments.

#### Post-Game Interview Themes (3 Players):

| Topic             | Key Takeaways                                                              |
|-------------------|-----------------------------------------------------------------------------|
| UI & Visuals      | “Clean and retro… readable even during chaos.”                             |
| Difficulty Design | “Hard mode is challenging but fair.”                                       |
| Narrative         | “Feels like being a dev stuck in their own broken system. Very thematic.”   |
| Upgrade Clarity   | “Easy to understand; boss attacks needed clearer signals (now improved).”  |

> Symbolic storytelling and strategic variety were positively received.

---

### 6.2 Quantitative Testing

We used two established tools:  
- **NASA-TLX**: Evaluates cognitive workload  
- **SUS (System Usability Scale)**: Measures usability (68 is average benchmark)

Each participant tested both **Easy (L1)** and **Hard (L2)** modes.

#### NASA-TLX Results: Workload Comparison

##### Individual Scores

<div align="center">
  <img src="docs/evaluation/NASA_easy.png" alt="NASA Easy" width="820" height="230">
  <p><em>Figure 25. NASA-TLX scores – Easy Mode.</em></p>
</div>

<div align="center">
  <img src="docs/evaluation/NASA_hard.png" alt="NASA Hard" width="820" height="230">
  <p><em>Figure 26. NASA-TLX scores – Hard Mode.</em></p>
</div>

##### Aggregated Comparison

<div align="center">
  <img src="docs/evaluation/NASA_bar.png" alt="NASA Bar" width="760" height="380">
  <p><em>Figure 27. Average workload across six dimensions (Easy vs Hard).</em></p>
</div>

<div align="center">
  <img src="docs/evaluation/NASA_radar.png" alt="NASA Radar" width="760" height="380">
  <p><em>Figure 28. Radar comparison of Easy and Hard Mode workload.</em></p>
</div>

> Hard mode increases mental demand and effort—just as designed—without excessive frustration.

---

#### SUS Results: Usability Scores

##### Easy Mode (L1)

<div align="center">
  <img src="docs/evaluation/SUS_easy.png" alt="SUS Easy Questions" width="760" height="230">
  <p><em>Figure 29. SUS answers – Easy Mode.</em></p>
</div>

<div align="center">
  <img src="docs/evaluation/SUS_easy_bar.png" alt="SUS Easy Bar" width="760" height="450">
  <p><em>Figure 30. Individual SUS scores – Easy Mode.</em></p>
</div>

**Average SUS Score**: **69.0** → Above benchmark (68)  
> Indicates solid usability for new players.

##### Hard Mode (L2)

<div align="center">
  <img src="docs/evaluation/SUS_hard.png" alt="SUS Hard Questions" width="760" height="230">
  <p><em>Figure 31. SUS answers – Hard Mode.</em></p>
</div>

<div align="center">
  <img src="docs/evaluation/SUS_hard_bar.png" alt="SUS Hard Bar" width="760" height="450">
  <p><em>Figure 32. Individual SUS scores – Hard Mode.</em></p>
</div>

**Average SUS Score**: **62.5** → Slightly below benchmark  
> Expected due to higher stress but still deemed fair and navigable.

---

### 6.3 Code & UX Testing Interviews

We recruited three types of testers:
- CS students
- Experienced gamers
- UX/HCI-aware developers

#### Feedback Highlights:

| Area            | Insight                                   | Fix Implemented                              |
|------------------|-------------------------------------------|----------------------------------------------|
| Boss Skills      | Surprise attacks felt unfair              | Added warning animations and audio cues      |
| Pet Visibility   | Unclear when pets acted                   | Particle trails and glow states added        |
| Weather Cues     | Missed changes                            | Top-corner icons + ambient weather sounds    |
| Scene Transitions| Felt abrupt                               | Added fade-in/out and audio bridges          |

> These changes strengthened the game’s visual language and player comprehension under pressure.

---

### 6.4 Reflection

#### Core Findings:
- **Challenge ≠ Confusion**: Hard mode was intense but still readable.
- **Feedback is King**: Players trusted the game more once cues were visible and timely.
- **Quantitative + Qualitative = Clarity**: SUS and NASA-TLX measured design quality; interviews explained why.

#### What Worked:
- Real-time feedback loops (weather, pets, damage)  
- Think-aloud sessions for usability edge cases  
- Testing both difficulty modes revealed design gaps early

> Testing was not just a checkpoint—it was a shaping force throughout our development.

[Back to Table of Contents](#table-of-contents)

## 7. Process

Our team of six collaborated using agile practices to manage complexity, synchronize development, and deliver a cohesive game. This chapter covers roles, workflows, tools, agile structure, and team reflection.

---

### 7.1 Roles and Division of Work

Each member focused on a distinct technical or design area, enabling parallel development and clearer ownership.

#### Technical Development

| Name             | Role                         | Key Contributions                                                                 |
|------------------|------------------------------|------------------------------------------------------------------------------------|
| **Chengjun Yi**  | Lead Developer               | Designed code architecture, optimized performance, led integration                 |
| **Heng Zhang**   | Core Gameplay Engineer       | Built boss logic, weather engine, collision and physics                           |
| **Feihang Yan**  | Pet System Engineer          | Created pet AI, support effects, pet-state syncing with player                    |

#### Visual & Frontend

| Name             | Role                         | Key Contributions                                                                 |
|------------------|------------------------------|------------------------------------------------------------------------------------|
| **Tong Yu**      | Art Director & UI Developer  | Designed all pixel art, animations, and interface transitions                      |
| **Xianhang Peng**| UI & Map Developer           | Built UI menus, health/status displays, and dynamic obstacle generation           |

#### Coordination & Testing

| Name             | Role                         | Key Contributions                                                                 |
|------------------|------------------------------|------------------------------------------------------------------------------------|
| **Qiutong Zhao** | Project Coordinator          | Planned sprints, led testing, edited demo video, handled documentation             |

> Dividing work this way minimized merge conflicts and allowed simultaneous progress on visuals, logic, and systems.

---

### 7.2 Tools and Platforms

We used industry-aligned tools to support communication, versioning, asset design, and project tracking.

#### Development

- **GitHub**: Branch-based development, PR reviews, GitHub Pages deployment  
- **p5.js**: Chosen for web delivery, simplicity, and modular coding in JavaScript

#### Design & Visuals

- **Aseprite**: Pixel art and sprite animation creation  
- **Figma**: UI mockups and interaction flows  
- **UMLEtino**: Used for Class & Sequence diagrams

#### Management

- **JIRA (Kanban)**: Task tracking with Sprint-based flow: `To Do → In Progress → Review → Done`  
- **WeChat + Google Meet**: Daily syncs and screen-share for debugging and visual alignment  
- **OBS + Premiere**: Gameplay recording and trailer editing

> These tools helped maintain transparency, reduce blockers, and support creative iteration across different roles.

---

### 7.3 Agile Development

We followed a weekly **sprint-based agile process**, customized to suit student constraints.

#### Weekly Cycle:

- **Monday**: Offline sprint kickoff  
- **Midweek**: Individual feature work  
- **Friday–Sunday**: Integration testing, bug triage, and sprint wrap-up

#### Task Structure:

- Stories broken into small, testable units (e.g., “Implement pet follow logic”, “Add boss warning flash”)
- Each PR mapped to a JIRA task  
- Sprint goals were outcome-focused: one visual system, one gameplay feature, and one UX refinement

<div align="center">
  <img src="docs/management/Glitchwood_Management.png" alt="Sprint & Kanban Overview" width="820" height="800">
  <p><em>Figure 33. Sprint timeline with team roles and feature deliveries.</em></p>
</div>

> This cycle ensured continuous progress and early bug exposure, especially for cross-feature interactions.

---

### 7.4 Team Reflection

Our collaboration improved over time, driven by lessons learned through practice and retrospectives.

#### Communication Improvements

- Moved from ad-hoc messaging to scheduled check-ins  
- Held real-time syncs during risky integrations (e.g., pet + map generation)

> **Lesson**: Synchronous debugging avoids misunderstandings and speeds resolution.

#### Task Refinement

- Switched from vague goals (“build weather”) to scoped deliverables (“Thunder deals area damage every 3s”)

> **Lesson**: Small, actionable tasks promote clarity and accountability.

#### Integration Days

- Held a full-team "jam session" near MVP to fix cross-system bugs and polish transitions

> **Lesson**: Sometimes, in-person teamwork solves what async coding can’t.

#### Adaptive Planning

- Re-scoped non-critical animations or UI polish during high-stress weeks  
- Focused on shipping playable systems before polish

> **Lesson**: Agility is about strategic trade-offs, not just faster coding.

---

### 7.5 Summary and Takeaways

Our process succeeded because we:

- Assigned clear roles to support parallelism  
- Planned in sprints with testable outcomes  
- Used structured feedback loops to evolve collaboration  
- Treated coordination as a system to be iterated, not assumed

> By the end, we weren’t just building Glitchwood—we were building a well-aligned, communicative team.

[Back to Table of Contents](#table-of-contents)

## 8. Sustainability, Ethics, and Accessibility

Glitchwood was built with sustainability, inclusivity, and ethical design in mind. From code to art to deployment, we treated these constraints not as limitations—but as design challenges.

---

### 8.1 Environmental Impact

We minimized resource usage by design:

- **Lightweight engine**: Built in p5.js (browser-native, no runtime overhead)
- **Optimized visuals**: Pixel art, capped animation frames, zero 3D assets
- **Energy-aware loops**: Frame logic throttled during idle or low-activity scenes

> Our game runs on old laptops and low-power devices, reducing carbon impact and expanding reach.

**Future Steps**:  
We plan to explore green hosting (e.g., Netlify on renewable energy) and power-aware analytics (e.g., FPS benchmarking by hardware profile).

---

### 8.2 Social Impact & Narrative Themes

Glitchwood is a metaphor: a developer trapped inside a malfunctioning system.

- **Enemies** = software bugs  
- **Weather** = environmental instability  
- **Pets** = debugging tools  
- **Bosses** = runtime failures or burnout events

By embedding these metaphors, we touched on:

- **Burnout & overwork**: The escalating chaos of waves reflects unsustainable pressure  
- **Mental health**: Players are rewarded for adaptability and support—not punishment  
- **Diversity of dev roles**: Three characters represent distinct archetypes of software workers

> Players felt “seen” by the metaphor, without any explicit story beats—validation that our symbolism worked.

---

### 8.3 Technical Sustainability

We wrote code for the long term:

- **Modular systems**: Pets, upgrades, weather types all run in isolated classes  
- **Extensible logic**: Adding new weather or bosses only requires subclassing, not rewrites  
- **Open-source compatible**: Game runs entirely on web standards (HTML + JS)

> Future developers can fork and expand Glitchwood without architectural debt.

This also enabled us to keep the bundle small (<5MB), making the game mobile-accessible and classroom-friendly.

---

### 8.4 Accessibility by Design

We aimed to support a wide audience:

- **Color contrast**: All core UI elements follow WCAG 2.0 AA contrast standards  
- **Simple controls**: Keyboard + mouse only; no complex combos  
- **Tutorial overlay**: Introduces movement, attack, and pet mechanics non-intrusively  
- **Pet and weather feedback**: Animations, icons, and sound cues help players understand cause/effect

> These features directly addressed think-aloud test feedback, especially from casual or neurodiverse players.

---

### 8.5 Sustainability-Driven Requirements

Drawing from the SusAF (Sustainability Awareness Framework), we structured several system goals around sustainability values:

| Sustainability Type | Stakeholder      | Requirement                                                                 |
|----------------------|------------------|------------------------------------------------------------------------------|
| Environmental        | Developer         | Avoid GPU-intensive visuals; use efficient loops                            |
| Technical            | Future Maintainer | Modularize weather/pet/upgrades into standalone classes                     |
| Social               | Casual Player     | Easy Mode must offer full content, not just a truncated experience          |
| Accessibility        | Vision-sensitive user | Reinforce gameplay effects with audio + icons                           |
| Deployment           | Tester            | Must run in browser on any OS without installation                         |

> These were treated as “non-functional requirements,” influencing design scope and code structure.

---

### Summary

By weaving sustainability and ethics into both game content and technical delivery, Glitchwood became more than playable—it became intentional.

- **Sustainability** guided how we deployed and optimized
- **Ethics** shaped our narrative and feedback systems
- **Accessibility** widened our user base and reduced frustration

> Glitchwood doesn’t just simulate glitches—it reflects how good systems survive under pressure.

[Back to Table of Contents](#table-of-contents)

## 9. Conclusion

Glitchwood began as a game—and evolved into a system that reflects the reality of software creation: uncertain, modular, fragile, and deeply human.

---

### 9.1 Lessons Learned

**1. Architecture Matters**  
Starting with clear UML diagrams and object-oriented boundaries saved us from chaos later. Every scalable feature—from pets to upgrades—was possible because we modularized early.

**2. Agile = Adaptation**  
We learned to plan in sprints, test often, fail fast, and adjust priorities without panic. When integration broke, we debugged together. When timelines slipped, we shipped smaller but smarter.

**3. Feedback Loops Drive Quality**  
Player comments directly shaped visuals, pacing, and even input mapping. SUS and NASA-TLX scores were helpful—but think-aloud reactions told us what needed fixing now.

> The best version of Glitchwood wasn’t on the whiteboard. It emerged through testing, listening, and rebuilding.

---

### 9.2 Overcoming Technical Challenges

**System Complexity**  
Interacting systems (e.g., pierce + split + pet + weather) quickly became hard to manage. We fixed this by isolating logic: projectiles handled their own upgrades; pets ran autonomous loops.

**Performance Bottlenecks**  
Enemy crowding caused lag. We capped spawn rates, used pooling, and added cooldown throttles to improve frame consistency.

**Upgrade Interaction**  
Hardcoded effects got messy fast. Moving to data-driven flags and class-based projectile behaviors restored sanity.

> These challenges taught us to treat every feature as its own system—with clear inputs, outputs, and ownership.

---

### 9.3 Collaboration Insights

We evolved from dividing tasks to owning features collectively. Our biggest upgrades came not from code—but from:

- User interviews (“I didn’t even see the weather change.”)
- Sprint retros (“Pets are breaking during map reset.”)
- PR reviews (“Why is this logic duplicated again?”)

By the final sprint, we weren’t just writing code—we were shipping systems with shared accountability and design integrity.

---

### 9.4 Future Directions

Glitchwood is architected to grow.

**Technical Possibilities**:
- Multiplayer: shared states, pet sync, co-op debugging
- Modding: JSON-based upgrade definitions or user-made pets
- Story: branching “developer burnout recovery” arcs or error log collectibles

**Educational Use**:
- Game-based learning about bugs, system design, or logic modeling
- Sandbox mode: teach physics, state machines, or enemy AI through play

> Glitchwood can become a platform—not just for players, but for learners and tinkerers.

---

### 9.5 Final Reflections

In building Glitchwood, we learned to:

- Work across disciplines and time zones
- Balance gameplay with metaphor
- Code systems that teach and scale

And most of all: to collaborate with intention.

> Every weather effect, every flicker, every pet—it’s all a metaphor. Not just for software bugs, but for building something together, under pressure, with care.

[Back to Table of Contents](#table-of-contents)

## 10 Appendix

### 10.1 Contributions of Team Members

To ensure fairness and transparency, we documented the contribution of each team member based on their primary responsibilities, key technical ownership, and collaborative impact. All members contributed equally to the final deliverable, with different areas of focus that complemented one another.

| Name              | Contribution Summary                                                                                                                                                                                             | Weight |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| **Chengjun Yi**   | Led core system integration and performance optimization. Defined overall architecture, managed module compatibility, and led debugging efforts during late-stage iterations.                                    | 1      |
| **Qiutong Zhao**  | Coordinated team progress, sprint planning, and task assignments. Directed and edited the demo video. Contributed to bug tracking and narrative-metaphor alignment in early system design.                      | 1      |
| **Heng Zhang**    | Implemented major gameplay features including weather effects, boss behaviors, and enemy spawning logic. Contributed heavily to system-level debugging and visual feedback integration.                          | 1      |
| **Tong Yu**       | Designed all character and environmental art. Implemented front-end UI components, transitions, and interaction prompts. Worked closely with logic developers to align visual assets with gameplay timing.       | 1      |
| **Feihang Yan**   | Designed and developed the pet system: AI behaviors, interaction logic, and effect management. Integrated pet features across maps and contributed to debugging and visual/audio feedback loops.                | 1      |
| **Xianhang Peng** | Developed the in-game UI layers (menus, stats, prompts) and score logic. Worked on map obstacle generation and gameplay-state transitions. Participated in testing and design feedback cycles.                  | 1      |

All members collaborated during testing, debugging, report writing, and integration sessions. Major integration phases were co-developed through real-time sync meetings or offline jam-style sessions to ensure compatibility across modules.

> We practiced full-stack ownership within domains, but worked as a fully integrated team.

---

### 10.2 References

Becker, C., Betz, S., Chitchyan, R., et al. (2015). Requirements: The key to sustainability. *IEEE Software*, 33(1), 56–65. https://doi.org/10.1109/MS.2015.158

Duboc, L., Betz, S., Penzenstadler, B., et al. (2019). Do we really know what we are building? Raising awareness of potential sustainability effects. *IEEE Int’l Requirements Engineering Conf.*, 6–16. https://doi.org/10.1109/RE.2019.00013

Fritsche, U., & Barth, A. (2016). Effective multithreading patterns for game engines. *Proceedings of ACM TVX*, 113–122. https://doi.org/10.1145/2925976.2925989

Hendrikx, M., Meijer, S., Van Der Velden, J., & Iosup, A. (2013). Procedural content generation for games: A survey. *ACM TOMM*, 9(1), 1–22. https://doi.org/10.1145/2422956.2422957

Hilty, L. M., & Aebischer, B. (2015). ICT for sustainability: An emerging research field. In *ICT Innovations for Sustainability* (pp. 3–36). Springer. https://doi.org/10.1007/978-3-319-09228-7_1

Leimus, J., & Steele, J. (2014). Behavioral modeling of mobile game interactions using UML state machines. *IEEE VS-GAMES*, 45–52.

Maratou, V., Chatzidaki, E., & Xenos, M. (2014). Enhance learning on software project management through role-play in virtual worlds. *Interactive Learning Environments*, 24(4), 897–915. https://doi.org/10.1080/10494820.2014.937345

Piraveenan, M. (2019). Applications of game theory in project management: A structured review. *Mathematics*, 7(9), 858. https://doi.org/10.3390/math7090858

Smith, A., & Johnson, B. (2020). Architectural patterns for scalable multiplayer games. *IEEE Transactions on Games*, 12(3), 225–237. https://doi.org/10.1109/TG.2020.2987654

Vodák, J. (2024). *2D rogue-like game with procedural elements* (Master’s thesis). Retrieved from https://theses.cz/id/s86g0y/

Wu, B., & Wang, A. I. (2012). A guideline for game development-based learning: A literature review. *International Journal of Learning*, 2012(1), Article 103710. https://onlinelibrary.wiley.com/doi/full/10.1155/2012/103710

> These references informed our approach to game architecture, sustainability modeling, evaluation methodology, and educational game design principles.

---

### 10.3 Goodbye from the Team

Thank you for reviewing our journey. Glitchwood was not just a game—it was a shared learning experience in design, coding, collaboration, and reflection.

<div align="center">
  <img src="docs/report/bye.gif" alt="Byebye" width="580"  height="330">
</div>

[Back to Table of Contents](#table-of-contents)