# AADF Project

A modern web application built with Next.js and Django, featuring a microservices architecture.

## Project Structure

The project is organized into two main directories:

### Apps
- `web/`: Next.js frontend application
- `provider/`: Django backend application

### Packages
- `shared/`: Shared utilities and components
- `icons/`: Icon library
- `ui/`: UI components library

## Frontend (Web)

The frontend is built with Next.js 15 and includes modern features like:
- TypeScript support
- React Query for data fetching
- LiveKit for real-time features
- tldraw for drawing capabilities
- Sentry for error tracking
- Theme support with next-themes
- DnD Kit for drag-and-drop functionality

### Getting Started with Frontend

```bash
cd apps/web
npm install
npm run dev
```

The development server will start at `http://localhost:3000`

## Backend (Provider)

The backend is a Django application with multiple services:
- Accounts management
- Tender management
- Media handling
- Application processing

### Getting Started with Backend

```bash
cd apps/provider
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Docker Support

The backend includes Docker support for easy deployment:

```bash
cd apps/provider
docker-compose up
```

## Development

### Type Checking
- Frontend: `npm run type-check` in the web directory
- Backend: Uses mypy for type checking

### Linting
- Frontend: Uses Biome for linting
- Backend: Uses black and isort for code formatting

## Environment Setup

### Frontend Environment Variables
Create a `.env.local` file in the `apps/web` directory with necessary environment variables.

### Backend Environment Variables
Create a `.env` file in the `apps/provider` directory with necessary environment variables.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT