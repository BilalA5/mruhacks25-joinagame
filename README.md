# Haris Bilal Shayan Ayan
# joinAGame 🏓🤾🎾

A hackathon project for **MRU Hacks 2025** that helps people **host and join local games** of niche sports like **Pickleball, Table Tennis, and Handball**.

---

## 🚀 Features
- **Host & Join Games:** Create or join nearby sessions.
- **Interactive Map:** Visualize game spots and events.
- **Simple Frontend:** Built with **Vite + React**.
- **Backend Setup:** Includes starter scripts and instructions.
- **Cross-Platform Scripts:** Start project on Windows (`.bat`) or Mac/Linux (`.sh`).

---

## 📂 Project Structure
```
mruhacks25-joinagame/
├── my-app/ # Main React frontend
├── package.json # Project dependencies
├── package-lock.json
├── DEPENDENCIES_LIST.txt # Quick reference for required packages
├── SETUP_INSTRUCTIONS.txt # Setup steps for local dev
├── start-project.bat # Windows startup
├── start-project.sh # Mac/Linux startup
├── README.md
└── LICENSE
```

---

## ⚙️ Installation

### Prerequisites

#### Install Node.js (Choose your platform)

**Windows:**
```bash
# Download from https://nodejs.org/ or use Chocolatey
choco install nodejs
```

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
# Using apt
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using snap
sudo snap install node --classic
```

**Linux (CentOS/RHEL):**
```bash
# Using yum
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### Install Git
```bash
# Windows (Chocolatey)
choco install git

# macOS (Homebrew)
brew install git

# Linux
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/RHEL
```

#### Verify Installation
```bash
node --version  # Should show v16.0.0 or higher
npm --version   # Should show 8.0.0 or higher
git --version   # Should show git version
```

### Quick Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/BilalA5/mruhacks25-joinagame.git
   cd mruhacks25-joinagame
   ```

2. **Install Major Dependencies**

   **Root Level:**
   ```bash
   # Install Vite globally (development server)
   npm install -g vite
   
   # Install root dependencies
   npm install
   ```

   **Frontend Dependencies:**
   ```bash
   cd my-app
   
   # Core React dependencies
   npm install react react-dom
   npm install react-router-dom
   
   # Development dependencies
   npm install @vitejs/plugin-react
   npm install vite
   
   # UI and Animation libraries
   npm install three
   npm install leaflet
   npm install react-leaflet
   
   # Install all frontend dependencies
   npm install
   ```

   **Backend Dependencies:**
   ```bash
   cd backend
   
   # Core Express.js dependencies
   npm install express
   npm install cors
   npm install nodemon
   
   # Install all backend dependencies
   npm install
   ```

3. **Run the project**
   
   **Terminal 1 - Backend:**
   ```bash
   cd my-app/backend
   npm start
   ```
   Backend will run on: `http://localhost:3001`
   
   **Terminal 2 - Frontend:**
   ```bash
   cd my-app
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173/`

### Or use the included scripts:

**Windows:** `start-project.bat`

**Mac/Linux:** `bash start-project.sh`

---

## 🎮 How to Use

1. **Visit:** `http://localhost:5173/`
2. **Choose Sport:** Click Pickleball 🏓, Handball 🤾, or Table Tennis 🏓
3. **Create Profile:** Enter your name and phone number
4. **Host or Join:** 
   - **Host:** Create a new game with location and details
   - **Join:** Browse and join existing games
5. **Play:** Connect with local players and have fun!

---

## 📦 Tech Stack
- **Frontend:** Vite + React + Three.js
- **Backend:** Node/Express
- **Styling:** CSS with Aceternity UI components
- **Maps:** Leaflet.js integration
- **Scripts:** Bash & Batch
- **Hosting:** Local dev server for now

---

## 🛠️ Features in Detail

### Interactive Elements
- **3D Ballpit Effect:** Courtesy of React Bits
- **Animated Backgrounds:** Sparkles and gradient animations
- **Wobble Cards:** Interactive sport selection cards
- **Real-time Updates:** Live game synchronization

### Game Management
- **Map Integration:** Click-to-select game locations
- **User Profiles:** Simple registration with validation
- **Game Discovery:** Browse available games by sport
- **Responsive Design:** Works on all devices

---

## 📝 Setup Notes
See `SETUP_INSTRUCTIONS.txt` for additional environment and port configuration.

For detailed troubleshooting, check the comprehensive setup guide in the project files.

---

## 📜 License
MIT License – feel free to use and modify for learning or personal projects.

---

## 👥 Contributors
- **Bilal Ahmed** 
- **Ayan Warriach** 
- **Haris Naveed** 
- **Shayan Shaikh**

---

**Built with ❤️ for the sports community**

*Connect. Compete. Have fun.*
