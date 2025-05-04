# 🚀 Tenderino

> Making Procurement Less Tender, More Tender-ific!

## What's This All About?

Hey there! 👋 Tenderino is our attempt to revolutionize how the Albanian-American Development Foundation (AADF) handles their procurement processes. Think of it as a digital superhero that swoops in to save the day when tenders get messy. We're talking about transforming those paper-heavy, email-chain-laden procurement workflows into something smooth, transparent, and dare we say... enjoyable?

## 🏗️ Project Structure

We're using a Turborepo monorepo setup because, well, we like to keep things organized! Here's what's under the hood:

```
tenderino/
├── apps/
│   ├── web/          # Next.js frontend (the pretty face of our app)
│   └── provider/     # Django backend (the brains behind the operation)
├── packages/         # Shared packages (because sharing is caring)
└── ...config files
```

### The Tech Stack (AKA Our Digital Toolbox)

#### Frontend (`apps/web`)
- **Next.js 15** - Because we like our React with a side of server-side rendering
- **TypeScript** - For when we want to be extra careful with our code
- **Tailwind CSS** - Making things pretty without the CSS headache
- **LiveKit** - Real-time collaboration? Yes, please!
- **tldraw** - For when you need to draw things out (literally)
- **Recharts** - Making data look beautiful
- **OpenAI Integration** - Because AI is cool, and we're not afraid to use it

#### Backend (`apps/provider`)
- **Django** - The Python framework that's been around the block
- **Django REST Framework** - Making APIs is our jam
- **PostgreSQL** - Our trusty database companion
- **Docker** - Because containers are the new black

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- Python 3.11+
- Docker and Docker Compose
- Bun (our package manager of choice)

### Installation

1. Clone the repo (you know the drill):
```bash
git clone https://github.com/your-org/tenderino.git
cd tenderino
```

2. Install dependencies:
```bash
bun install
```

3. Set up your environment:
```bash
cp apps/web/.env.example apps/web/.env
cp apps/provider/.env.example apps/provider/.env
```

4. Start the development servers:
```bash
# Start everything
bun run dev

# Or start specific apps
bun run dev --filter=web
bun run dev --filter=provider
```

## 🛠️ Development

### Available Scripts

- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps
- `bun run lint` - Lint all apps
- `bun run test` - Run tests across all apps

### Code Style

We use Biome for linting and formatting. It's like Prettier and ESLint had a baby, and it's awesome. Just run:

```bash
bun run lint
```

## 🧪 Testing

We take testing seriously (but not too seriously). Run the test suite with:

```bash
bun run test
```

## 🚢 Deployment

We're using a combination of:
- Vercel for the frontend
- Docker containers for the backend
- GitHub Actions for CI/CD

Check out our deployment guides in the `docs` folder for more details.

## 🤝 Contributing

Found a bug? Want to add a feature? We'd love your help! Here's how:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The AADF team for their vision and support
- All the open-source projects that make this possible
- Coffee, lots of coffee ☕

## 📞 Need Help?

- Open an issue
- Check our [documentation](docs)

---

Made with ❤️ by zennit

*P.S. If you're reading this, you're awesome! Thanks for checking out our project!*