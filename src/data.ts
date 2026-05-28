import { Course, LeaderboardUser, ForumPost } from "./types";

export const COURSES: Course[] = [
  {
    id: "html",
    title: "HTML Essentials",
    description: "Learn the foundational structural blocks of the web, semantic elements, and accessible markup.",
    icon: "Code2",
    accentColor: "orange-500",
    duration: "2 hours",
    level: "Beginner",
    totalLessons: 2,
    lessons: [
      {
        id: "html-intro",
        title: "Introduction to HTML5",
        description: "Understand the core skeleton of raw web content and metadata tags.",
        difficulty: "Beginner",
        xpAward: 100,
        content: `### Welcome to CodeSpark HTML Essentials!
HTML (HyperText Markup Language) is the backbone of the browser. It standardizes how content exists on a screen. Every website, from simple lists to advanced multiplayer game portals, uses HTML.

#### Key Tags:
* \`<h1>\` to \`<h6>\` - Header titles, where \`<h1>\` is the primary title
* \`<p>\` - Paragraph structural block for body text
* \`<div>\` - Generic grouping container with block-level visual traits
* \`<span>\` - Generic inline-level style wrapper

Let's try writing a standard header title now!`,
        challenges: [
          {
            id: "html-h1-challenge",
            title: "First Cosmic Heading",
            difficulty: "Beginner",
            points: 50,
            instructions: "Create an `<h1>` tag that wraps the exact wording `Hello CodeSpark!` to complete your very first visual container element.",
            initialCode: "<!-- Write your HTML header below -->\n",
            solutionRegex: "<h1>Hello CodeSpark!</h1>",
            hint: "Type <h1>Hello CodeSpark!</h1> into the text field below."
          }
        ]
      },
      {
        id: "html-formatting",
        title: "Semantic Content Structuring",
        description: "Master clean visual layout using modern visual dividers, list items, and anchors.",
        difficulty: "Beginner",
        xpAward: 120,
        content: `### Semantic markup is the elite developer's secret weapon.
Using '<section>', '<article>', and '<nav>' tags over anonymous '<div>' tags improves:
1. Accessibility for visually-impaired readers
2. Search Engine Indexing (SEO)
3. Code stability and style clarity

Let's connect content using links! An anchor tag reads like:
\`<a href="https://code.spark">Learn More</a>\``,
        challenges: [
          {
            id: "html-anchor-challenge",
            title: "Neon Portal Anchor",
            difficulty: "Beginner",
            points: 60,
            instructions: "Create an anchor `<a>` tag with the `href` attribute set to `https://google.com` wrapping the text `Google`.",
            initialCode: "<!-- Create your link portal here -->\n",
            solutionRegex: "href=\"https://google\\.com\"[^>]*>Google</a>",
            hint: "Try typing: <a href=\"https://google.com\">Google</a>"
          }
        ]
      }
    ]
  },
  {
    id: "css",
    title: "Mastering CSS",
    description: "Unravel grid structures, flexboxes, premium shadow animations, and custom glowing neon colors.",
    icon: "Palette",
    accentColor: "cyan-400",
    duration: "3.5 hours",
    level: "Beginner",
    totalLessons: 2,
    lessons: [
      {
        id: "css-flexbox",
        title: "The Magic of Flexbox",
        description: "Align items correctly on any viewport with simple flex utility rules.",
        difficulty: "Beginner",
        xpAward: 120,
        content: `### Align elements like an absolute veteran!
Say goodbye to margin hacking. CSS Flexbox lets you distribute and align elements within a parent container dynamically.

#### Essential rules:
* \`display: flex;\` converts any element into a flexible block parent.
* \`justify-content: center;\` shifts item columns horizontally.
* \`align-items: center;\` aligns them vertically.
* \`gap: 16px;\` places equal breathing spacing down the grid rows.`,
        challenges: [
          {
            id: "css-flex-center",
            title: "Centering the Core Spark",
            difficulty: "Beginner",
            points: 60,
            instructions: "Add the flex rule to center children vertically and horizontally inside our core panel element: create a helper selector styled with display-flex, align-center, and justify-center.",
            initialCode: ".core-panel {\n  display: flex;\n  /* Add items alignment and content justification vertically and horizontally below */\n\n}",
            solutionRegex: "align-items:\\s*center;\\s*justify-content:\\s*center;",
            hint: "Inside the css class, specify: align-items: center; and justify-content: center;"
          }
        ]
      },
      {
        id: "css-animations",
        title: "Modern Glowing Neon Shadows",
        description: "Construct interactive visual transitions using custom neon shadow styling.",
        difficulty: "Intermediate",
        xpAward: 150,
        content: `### Give your UI an electric retro aura!
Using box-shadow overlays combined with CSS variables enables realistic depth effects.

Example:
\`box-shadow: 0 0 15px rgba(6,182,212,0.6);\``,
        challenges: [
          {
            id: "css-boxshadow",
            title: "Supercharging Cyber Glow",
            difficulty: "Intermediate",
            points: 80,
            instructions: "Complete the hover styling block for our neon button. Define `box-shadow` to have a size of `20px` with the color `rgba(168,85,247,0.7)` (a beautiful cyber-violet glow).",
            initialCode: ".neon-button:hover {\n  /* Add box-shadow property here */\n  transition: all 0.3s ease-in-out;\n}",
            solutionRegex: "box-shadow:\\s*0\\s+0\\s+20px\\s+rgba\\(168,\\s*85,\\s*247,\\s*0?\\.7\\)",
            hint: "Type: box-shadow: 0 0 20px rgba(168,85,247,0.7);"
          }
        ]
      }
    ]
  },
  {
    id: "javascript",
    title: "JavaScript Engine",
    description: "Write clean asynchronous logic, loops, functions, objects, and API dynamic retrievers.",
    icon: "Sparkles",
    accentColor: "yellow-400",
    duration: "5 hours",
    level: "Intermediate",
    totalLessons: 2,
    lessons: [
      {
        id: "js-variables",
        title: "Dynamic Variables & Calculation",
        description: "Store global configurations, count ticks, and write your first logic equations.",
        difficulty: "Beginner",
        xpAward: 100,
        content: `### JavaScript holds the core intelligence of the platform.
It drives mouse events, retrieves dynamic weather updates from cloud APIs, and handles player stats live.

#### Variable scopes:
* \`const\` - Immutable storage. High durability. Prefer this by default!
* \`let\` - Mutable space for dynamic counters, streaks, and scores.
* \`var\` - Legacy scope. Strictly avoid to protect safety bounds.`,
        challenges: [
          {
            id: "js-let-variable",
            title: "The Ultimate Cosmic Score",
            difficulty: "Beginner",
            points: 50,
            instructions: "Declare a constant integer variable named `answer` set to `42`. Write `const answer = 42;`.",
            initialCode: "// Let's set the answer to the universe below\n",
            solutionRegex: "const\\s+answer\\s*=\\s*42;",
            hint: "Type: const answer = 42;"
          }
        ]
      },
      {
        id: "js-arrows",
        title: "Arrow Functions & Shorthand",
        description: "Write concise, high-speed logical functions utilizing elegant ES6 styles.",
        difficulty: "Intermediate",
        xpAward: 130,
        content: `### Elevate your code cleanliness.
Arrow functions provide a clean shorthand to write functions:

\`const calculateMultiplier = (xp) => xp * 1.5;\``,
        challenges: [
          {
            id: "js-arrow-fn",
            title: "Multiplying Power Grid Ticks",
            difficulty: "Intermediate",
            points: 70,
            instructions: "Create an arrow function named `double` that receives a single argument `num` and returns that values doubled.",
            initialCode: "// Write your double arrow function here\n",
            solutionRegex: "const\\s+double\\s*=\\s*\\(?num\\)?\\s*=>\\s*num\\s*\\*\\s*2;",
            hint: "Type: const double = num => num * 2; or const double = (num) => { return num * 2; };"
          }
        ]
      }
    ]
  },
  {
    id: "react",
    title: "React Components",
    description: "Build reactive states, hooks, re-usable user interfaces, and custom animation hooks.",
    icon: "Layers",
    accentColor: "purple-400",
    duration: "6 hours",
    level: "Intermediate",
    totalLessons: 2,
    lessons: [
      {
        id: "react-usestate",
        title: "Dynamic State with useState",
        description: "Interact with simple click triggers and update components without page reloads.",
        difficulty: "Intermediate",
        xpAward: 150,
        content: `### Welcome to dynamic UI logic!
In traditional HTML, updating text requires searching the DOM. React shifts this entirely using **State**. When state changes, React redraws only the specific nodes that changed.

#### Hook Setup:
\`const [xp, setXp] = useState(0);\`

* \`xp\` is the current value.
* \`setXp\` is the trigger function used to set new values.`,
        challenges: [
          {
            id: "react-hook-challenge",
            title: "Igniting Spark State",
            difficulty: "Intermediate",
            points: 100,
            instructions: "Initialize a state variable named `spark` using the `React.useState` hook (or `useState`). Give it a default value of boolean `true`.",
            initialCode: "import React, { useState } from 'react';\n\nexport default function SparkCore() {\n  // Initialize spark state using useState set to true below\n\n}",
            solutionRegex: "const\\s*\\[spark,\\s*setSpark\\]\\s*=\\s*use(React\\.)?State\\(true\\);",
            hint: "Type: const [spark, setSpark] = useState(true);"
          }
        ]
      },
      {
        id: "react-props",
        title: "Passing Premium Props",
        description: "Construct scalable data-driven pipelines into sub-component nodes.",
        difficulty: "Intermediate",
        xpAward: 140,
        content: `### Deliver custom visual parameters.
Props are read-only variables passed from parent elements down to children. Keeps components modular!`,
        challenges: [
          {
            id: "react-props-challenge",
            title: "Deploying Cyber Banner Props",
            difficulty: "Intermediate",
            points: 90,
            instructions: "A component `CyberBanner` receives a prop named `title`. Return an <h2> container containing the dynamic `{props.title}`.",
            initialCode: "export default function CyberBanner(props) {\n  return (\n    // Return h2 element referencing props.title below\n\n  );\n}",
            solutionRegex: "<h2[^>]*>\\s*\\{\\s*props\\.title\\s*\\}\\s*</h2>",
            hint: "Return: <h2>{props.title}</h2>"
          }
        ]
      }
    ]
  },
  {
    id: "python",
    title: "Python Engine",
    description: "Indentation, algorithms, list comprehensions, data structures, and back-end scripting.",
    icon: "Terminal",
    accentColor: "emerald-400",
    duration: "4.5 hours",
    level: "Beginner",
    totalLessons: 2,
    lessons: [
      {
        id: "python-syntax",
        title: "Clean Indentation & Lists",
        description: "No semicolons! Learn the clean whitespace structure of Python engines.",
        difficulty: "Beginner",
        xpAward: 110,
        content: `### Python relies heavily on readable whitespace structures.
By dropping curly-bracket loops, Python lets developers see visual alignment effortlessly.

#### Loop logic:
\`\`\`python
for element in list:
    print(element)
\`\`\`
Let's initialize clean variables now!`,
        challenges: [
          {
            id: "python-initial-def",
            title: "Setting Python Streaks",
            difficulty: "Beginner",
            points: 60,
            instructions: "Create a Python list variable named `streaks` containing integers `3`, `5`, and `7`.",
            initialCode: "# Create streaks list below\n",
            solutionRegex: "streaks\\s*=\\s*\\[\\s*3,\\s*5,\\s*7\\s*\\]",
            hint: "Type: streaks = [3, 5, 7]"
          }
        ]
      },
      {
        id: "python-functions",
        title: "Defining Functions",
        description: "Reuse computational logic structures using python definitions.",
        difficulty: "Beginner",
        xpAward: 120,
        content: `### Leverage code reusability.
Functions are declared using the \`def\` keyword:

\`\`\`python
def greet(user):
    return "Hi " + user
\`\`\``,
        challenges: [
          {
            id: "py-double-func",
            title: "Double the Core Grid Generator",
            difficulty: "Beginner",
            points: 70,
            instructions: "Define a Python function named `double_val` that accepts one argument `x` and returns `x * 2`.",
            initialCode: "# Define double_val below\n",
            solutionRegex: "def\\s+double_val\\s*\\(\\s*x\\s*\\)\\s*:\\s*(return\\s+x\\s*\\*\\s*2|\\s+return\\s+x\\s*\\*\\s*2)",
            hint: "Type: def double_val(x):\n    return x * 2"
          }
        ]
      }
    ]
  },
  {
    id: "nodejs",
    title: "Node.js Engine",
    description: "Server architecture, file system access, routing, environment flags, and database connections.",
    icon: "Network",
    accentColor: "violet-400",
    duration: "5 hours",
    level: "Advanced",
    totalLessons: 1,
    lessons: [
      {
        id: "nodejs-express",
        title: "Express Core Server",
        description: "Expose your first server routes and deliver full backend services.",
        difficulty: "Advanced",
        xpAward: 180,
        content: `### Complete the production backend!
Node.js lets you run JavaScript directly inside server clusters. It's high speed, open, and integrates with databases.

#### Simple Express server skeleton:
\`\`\`javascript
const express = require('express');
const app = express();
app.listen(3000);
\`\`\``,
        challenges: [
          {
            id: "nodejs-port-check",
            title: "Express Core Port Setup",
            difficulty: "Advanced",
            points: 100,
            instructions: "Specify server environment variables: declare string continuous port named `PORT` with valuation `'3000'` in Javascript syntax.",
            initialCode: "const PORT = ''; // Configure custom port 3000 here\n",
            solutionRegex: "const\\s+PORT\\s*=\\s*['\"]3000['\"]",
            hint: "Change the initial code line to declare: const PORT = '3000';"
          }
        ]
      }
    ]
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    description: "Visual hierarchy, spacing rules, color palettes, wireframe structures, and typographic pairings.",
    icon: "Monitor",
    accentColor: "fuchsia-400",
    duration: "3 hours",
    level: "Intermediate",
    totalLessons: 1,
    lessons: [
      {
        id: "uiux-contrast",
        title: "Typography Hierarchy Rules",
        description: "Arrange layouts and size contrast to keep readers engaged and prevent fatigue.",
        difficulty: "Intermediate",
        xpAward: 120,
        content: `### High spacing density and visual hierarchy are crucial.
Premium interfaces, just like the Bento Grid, look superior because:
1. They maintain strong structural container outlines (e.g., '#30363d' on space-black '#0d1117').
2. They feature contrasting micro-badges with neon glow tints to guide the eye.
3. They separate elements using intentional, variable margins for visual rhythm.`,
        challenges: [
          {
            id: "uiux-contrast-check",
            title: "Elite Typography Title Styling",
            difficulty: "Intermediate",
            points: 80,
            instructions: "Create a modern tracking css variable: declare an active class selector containing typography properties tracking-wide and uppercase format.",
            initialCode: ".cyber-subtitle {\n  text-transform: uppercase;\n  /* Add letter-spacing tracking element in CSS. Try standard value 0.1em */\n\n}",
            solutionRegex: "letter-spacing:\\s*0?\\.1em",
            hint: "Specify inside the selector: letter-spacing: 0.1em;"
          }
        ]
      }
    ]
  }
];

export const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "SarahDev", xp: 9420, avatar: "👩‍💻", badge: "Aura Master" },
  { rank: 2, name: "PyKing_99", xp: 8210, avatar: "🐍", badge: "Logic Titan" },
  { rank: 3, name: "AlexSparkler", xp: 7490, avatar: "⚡", badge: "Loop Wizard" },
  { rank: 4, name: "ByteCommander", xp: 6200, avatar: "🤖", badge: "Kernel General" },
  { rank: 5, name: "NovaDesign", xp: 5110, avatar: "🎨", badge: "Contrast Elite" },
];

export const FORUM_POSTS: ForumPost[] = [
  {
    id: "p1",
    author: "Alice_JS",
    avatar: "🎒",
    role: "Expert React",
    title: "How to perfectly bundle Tailwind CSS in Node.js",
    tag: "CSS Essentials",
    content: "When constructing our CodeSpark projects, always use @import 'tailwindcss' directly within the central stylesheet block. No separate configuration sheets are required!",
    likes: 42,
    comments: 8,
    time: "3 hours ago"
  },
  {
    id: "p2",
    author: "SparkyCodeRunner",
    avatar: "🚀",
    role: "Core Mentor",
    title: "Mastering Asynchronous Generators for WebSockets",
    tag: "Intermediate JS",
    content: "When compiling React counters, the state can sometimes process out of order if multiple event cycles loop. Always specify local functional updates like count => count + 1 to prevent missing frames!",
    likes: 89,
    comments: 15,
    time: "2 days ago"
  },
  {
    id: "p3",
    author: "UI_Guru",
    avatar: "👨‍🎨",
    role: "Visual Creator",
    title: "The Golden Aspect Ratio for Bento Box Cards",
    tag: "UI/UX Design",
    content: "A beautiful dashboard balances columns evenly. Using grid-cols-4 layout with responsive col-span declarations creates absolute eye comfort and clean spacing rhythm.",
    likes: 56,
    comments: 11,
    time: "1 day ago"
  }
];

export const SHOP_ITEMS = [
  {
    id: "badge-neon-king",
    title: "Cyber Neon Aura Indicator",
    description: "Equip a spectacular purple glowing outline around your user avatar badge across the whole system.",
    avatar: "👑",
    cost: 150,
    type: "badge"
  },
  {
    id: "cert-premium",
    title: "High-contrast Crypto-verified PDF Certificate",
    description: "Get pristine print-ready high resolution certificates signed by Sparky AI, verifying your complete course curriculum.",
    avatar: "📜",
    cost: 300,
    type: "certificate"
  },
  {
    id: "theme-ambient",
    title: "Premium Hype Sound Bundle",
    description: "Unlock beautiful vintage 8-bit sound effects that trigger with sparkling stars on every successful code solution.",
    avatar: "🎹",
    cost: 100,
    type: "audio"
  }
];
