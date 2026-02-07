# YOcreator
AI Voice + Avatar + Video Studio
Cloud GPU Rendering + Web + Desktop + Mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/solutionspma/yocreator.git
   cd yocreator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys (see .env.example for details)
   ```

4. **Start development servers**
   ```bash
   # Start both web and backend servers
   pnpm dev
   
   # Or start them individually:
   pnpm dev:web      # Web app on http://localhost:3000
   pnpm dev:node     # Backend API on http://localhost:5001
   pnpm dev:desktop  # Desktop app with Electron
   ```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - How to deploy to production
- [Save State](./SAVE_STATE.md) - Current project status

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Three.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Desktop**: Electron
- **Mobile**: Capacitor
- **Database**: Supabase
- **AI/ML**: PyTorch, Transformers, Diffusers
