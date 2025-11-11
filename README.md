<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!-- PROJECT LOGO -->

<br />

<div align="center">

  <h3 align="center">EvoSkillTree / WikiMap</h3>

  <p align="center">
    An interactive knowledge visualization tool that creates dynamic skill trees from Wikipedia articles, enhanced with AI-generated summaries and questions
    <br />
    <a href="https://github.com/PraneethO/ssh25"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/PraneethO/ssh25">View Demo</a>
    &middot;
    <a href="https://github.com/PraneethO/ssh25/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/PraneethO/ssh25/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>

</div>

<!-- TABLE OF CONTENTS -->

<details>

  <summary>Table of Contents</summary>

  <ol>

    <li>

      <a href="#about-the-project">About The Project</a>

      <ul>

        <li><a href="#built-with">Built With</a></li>

      </ul>

    </li>

    <li>

      <a href="#getting-started">Getting Started</a>

      <ul>

        <li><a href="#prerequisites">Prerequisites</a></li>

        <li><a href="#installation">Installation</a></li>

      </ul>

    </li>

    <li><a href="#usage">Usage</a></li>

    <li><a href="#features">Features</a></li>

    <li><a href="#project-structure">Project Structure</a></li>

    <li><a href="#known-issues">Known Issues</a></li>

    <li><a href="#roadmap">Roadmap</a></li>

    <li><a href="#contributing">Contributing</a></li>

    <li><a href="#contact">Contact</a></li>

    <li><a href="#acknowledgments">Acknowledgments</a></li>

  </ol>

</details>

<!-- ABOUT THE PROJECT -->

## About The Project

EvoSkillTree (also known as WikiMap) is an interactive web application that transforms learning into a visual, explorable experience. The project creates dynamic knowledge trees where each node represents a topic, and unlocking a node reveals related concepts from Wikipedia, creating an ever-expanding web of knowledge.

### How It Works

1. **Start with Any Topic**: Enter any Wikipedia topic (e.g., "geography", "calisthenics", "physics") to begin your knowledge journey
2. **Interactive Skill Tree**: Click on nodes to unlock them and reveal their connections
3. **Wikipedia Integration**: Each unlocked node automatically fetches related Wikipedia articles to discover new branches
4. **AI-Enhanced Learning**: Uses Ollama (local LLM) to generate concise summaries (~300 words) and study questions for each topic
5. **Physics-Based Layout**: Nodes automatically arrange themselves using a force-directed layout algorithm, creating an organic, visually appealing tree structure
6. **Dynamic Expansion**: As you explore, the tree grows organically, revealing new paths and connections between topics

### Original Concept

Originally designed as a calisthenics skill progression tool, the application has evolved into a general-purpose knowledge visualization system. The project includes a comprehensive `skill_info.json` file with detailed calisthenics exercises, progressions, and tutorials, demonstrating the original use case.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![p5.js][p5.js]][p5-url] - Creative coding and visualization framework
- [![JavaScript][JavaScript]][JavaScript-url] - Core programming language
- [![Express][Express.js]][Express-url] - Backend API server (optional)
- [![Ollama][Ollama]][Ollama-url] - Local LLM for AI-generated content
- [Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API) - Content source

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This section will guide you through setting up EvoSkillTree locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** and **npm** (for the optional Express server)
  ```sh
  npm install npm@latest -g
  ```
- **Ollama** - Required for AI-generated summaries and questions
  ```sh
  # Install Ollama from https://ollama.ai
  # Then pull the llama3.2 model:
  ollama pull llama3.2
  ```

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/PraneethO/ssh25.git
   cd ssh25
   ```

2. Install npm packages (for the optional Express API server)

   ```sh
   npm install
   ```

3. Start Ollama (if not already running)

   ```sh
   # Ollama should be running on localhost:11434
   # The application will connect to it automatically
   ```

4. (Optional) Start the Express API server

   ```sh
   node api.js
   ```

   Note: The main application connects directly to Ollama, so this server may not be necessary.

5. Open `index.html` in a web browser
   ```sh
   # Simply open index.html in your preferred browser
   # Or use a local server:
   python -m http.server 8000
   # Then navigate to http://localhost:8000
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Starting Your Knowledge Tree

1. **Launch the Application**: Open `index.html` in your web browser
2. **Enter a Topic**: Type any Wikipedia topic in the search box (e.g., "geography", "quantum physics", "calisthenics")
3. **Click "Go"**: This creates the root node of your knowledge tree

### Exploring the Tree

1. **Select a Node**: Click on any node to view its AI-generated summary in the sidebar
2. **Unlock Nodes**: Click the "Expand" button to unlock a locked node
   - This fetches related Wikipedia articles
   - Generates an AI summary and study questions
   - Creates new child nodes from Wikipedia links
3. **Navigate**: The tree automatically arranges itself as you explore
4. **Visual Feedback**:
   - Locked nodes appear gray
   - Unlocked nodes appear blue
   - Selected nodes have a green outline

### Features in Action

- **AI Summaries**: Each unlocked node displays a ~300-word summary generated by Ollama
- **Study Questions**: The application generates 10 questions about each topic (visible in console)
- **Dynamic Layout**: Nodes automatically reposition to avoid overlaps and maintain optimal spacing
- **Branching Logic**: Each node can have multiple children, creating complex knowledge graphs

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- 🌳 **Dynamic Knowledge Trees**: Automatically generated from Wikipedia articles
- 🤖 **AI-Powered Summaries**: Local LLM integration for topic summaries
- 📚 **Wikipedia Integration**: Real-time fetching of related articles
- 🎨 **Interactive Visualization**: Physics-based node layout with smooth animations
- 🔓 **Progressive Unlocking**: Locked/unlocked node system for structured learning
- 📝 **Study Questions**: AI-generated questions for each topic
- 🎯 **Flexible Topics**: Works with any Wikipedia article
- 💪 **Calisthenics Mode**: Includes comprehensive calisthenics skill database

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Structure

```
ssh25/
├── index.html          # Main HTML file
├── sketch.js           # p5.js application logic
├── api.js              # Express server (optional)
├── style.css           # Basic styling
├── skill_info.json     # Calisthenics skill database
├── package.json        # Node.js dependencies
├── jsconfig.json       # JavaScript configuration
├── libraries/          # p5.js libraries
│   ├── p5.min.js
│   └── p5.sound.min.js
├── fonts/              # Raleway font family
└── assets/             # Images and icons
    ├── favicon.png
    ├── picicon.png
    └── creator_photo.jpeg
```

### Key Files

- **`sketch.js`**: Contains all the main application logic, including:

  - Node management and tree structure
  - Wikipedia API integration
  - Ollama API calls for AI content
  - Physics-based layout algorithm
  - User interaction handlers

- **`skill_info.json`**: Comprehensive database of calisthenics exercises with:
  - Prerequisites
  - Step-by-step instructions
  - Progressions
  - Video tutorial links
  - Warm-up routines

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Known Issues

⚠️ **Missing .gitignore**: This project was created when I was younger and I forgot to include a `.gitignore` file. As a result, `node_modules/` and other build artifacts may be tracked in the repository. Consider adding a `.gitignore` file to exclude:

- `node_modules/`
- `.DS_Store`
- `*.log`
- Environment files

Other known issues:

- The photo upload feature appears to be a placeholder and is not fully implemented
- The Express API server (`api.js`) may be redundant as the application connects directly to Ollama
- Some console.log statements remain from development

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Add proper `.gitignore` file
- [ ] Implement photo upload functionality for note extraction
- [ ] Add export/import functionality for knowledge trees
- [ ] Improve error handling for Wikipedia API failures
- [ ] Add node search and filtering capabilities
- [ ] Implement save/load functionality for user progress
- [ ] Add keyboard shortcuts for navigation
- [ ] Improve mobile responsiveness
- [ ] Add dark/light theme toggle
- [ ] Implement node notes/annotations feature

See the [open issues](https://github.com/PraneethO/ssh25/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Praneeth O - potthi@berkeley.edu

Project Link: [https://github.com/PraneethO/ssh25](https://github.com/PraneethO/ssh25)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [p5.js](https://p5js.org/) - Amazing creative coding framework
- [Ollama](https://ollama.ai/) - Local LLM platform
- [Wikipedia](https://www.wikipedia.org/) - Knowledge source
- [Raleway Font Family](https://fonts.google.com/specimen/Raleway) - Typography

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[p5.js]: https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5.js&logoColor=white
[p5-url]: https://p5js.org/
[JavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://www.javascript.com/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Ollama]: https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white
[Ollama-url]: https://ollama.ai/
