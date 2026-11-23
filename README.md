# Web115 Final Project

# The Unicorn Bond: Ravaryn's Quest

Interactive browser-based adventure story. Solo final project.

The Unicorn Bond: Ravaryn's Quest
Interactive browser-based elf fantasy adventure. Solo final project.

Team Members and Roles
Name	Role	Responsibilities
Robyn Farley	Sole Developer & Author	Story concept and branching design, Mermaid flowchart, HTML structure, CSS styling, all JavaScript (classes, state, event listeners, validation, endings), image assets, and full documentation.

Note: This project was completed independently after the assigned partner did not participate.

Application Overview
Story Premise
You play as Ravaryn Nightwillow, warrior-princess of the Silverleaf elves. A creeping Shadowblight is destroying her homeland. The only hope is to form a spirit-bond with a unicorn whose magical gifts can push the blight back.

Gameplay Rules & Navigation

Start by choosing one of three hunting realms:
Elheim (Elderwood Veil) — highest difficulty, rarest unicorns, strongest gifts
Drakenhold (Ashen Peaks) — medium difficulty, more unicorns, solid gifts
Bastoria (Verdant Shores) — easiest path, most unicorns, moderate gifts
Each realm has an initial exploration followed by a “second season” of deeper challenges.
During the second season you must type one priority word: ease, difficulty, or gift. The input is validated with a regular expression.
Choices increase a Bond Progress score and Affinity. An inventory list and journey log update dynamically as you progress.
Progress saves automatically using localStorage (JSON) and a cookie that remembers the last realm.
Keyboard shortcuts: press 1, 2, or 3 for the main choices, Enter to submit text input, and S to force a save.
Hover over the story image to see a short tooltip hint.
Endings

Best — Bonds with the strongest unicorn (highest Spell Knowledge, Ingenuity, Stamina, and Potential). Requires Elheim + “gift” priority + high bond score.
Middle — Successful bond with a gifted unicorn. Most solid paths reach this ending.
Bad — No bond forms. Triggered by low bond score or overly cautious choices.
Secret — After a successful bond, typing the ancient word “alicorn” or “nightwillow” (discovered via a lore fragment) levels the unicorn’s gifts further.


Story Flowchart
```mermaid
flowchart TD
    A[Start: Ravaryn Nightwillow] --> B{Choose Realm}
    B -->|Elheim| C[Enter Elheim]
    B -->|Drakenhold| D[Enter Drakenhold]
    B -->|Bastoria| E[Enter Bastoria]
    C --> F[Elheim Second Season]
    D --> G[Drakenhold Second Season]
    E --> H[Bastoria Second Season]
    F --> I[Priority Input: ease / difficulty / gift]
    G --> I
    H --> I
    I --> J{Validate & Record Priority}
    J -->|Valid| K[Priority Result + Unicorn Appears]
    J -->|Invalid| I
    K --> L{Attempt Bond}
    L -->|High score + Elheim + gift| M[Best Ending]
    L -->|Solid score| N[Middle Ending]
    L -->|Low score| O[Bad Ending]
    N -->|Clue found + secret word| P[Secret Ending]
    M --> Q[Return to Start]
    N --> Q
    O --> Q
    P --> Q
    C -->|Turn back| A
    D -->|Turn back| A
    E -->|Turn back| A
    



How to Run
Clone or download this repository.
Open index.html in any modern browser (or serve the folder with a local server).
File structure:
index.html (root)
css/styles.css
js/script.js
images/ (map.jpg, elheim.jpg, drakenhold.jpg, bastoria.jpg, unicorn.jpg, ravaryn.jpg)
Image paths in JavaScript are relative to the HTML file (e.g. images/map.jpg), so they resolve correctly.
Features Implemented
HTML: title, three paragraphs with ids, buttons with ids, changing story image
CSS: styled layout, buttons, image sizing, responsive design
JavaScript: element references, reusable functions, conditionals, loops, dynamic DOM creation, three classes (Player, Unicorn, Realm), JSON save/load, try-catch error handling, cookies, event listeners (click, keydown, mouseenter/mouseleave), text input with regex validation, setTimeout/setInterval, inventory and journal updates, state flags, and score tracking
All assets are local. No external libraries are required.
