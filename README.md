# Mock API Manager - Frontend

A modern Next.js frontend for managing and testing mock API endpoints. Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Dashboard Overview**: View statistics about your mock endpoints
- **Endpoint Management**: List, create, update, and delete mock endpoints
- **Real-time Updates**: Powered by TanStack Query for optimistic updates
- **Type-Safe**: Full TypeScript support with strict mode
- **Modern UI**: Clean, responsive design using shadcn/ui components
- **Dark Mode Ready**: Built-in dark mode support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn
- Backend API server running (default: http://localhost:8080)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The API URL is configured in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Update this if your backend API is running on a different port or URL.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home/dashboard page
│   └── globals.css        # Global styles with Tailwind
│
├── components/
│   ├── ui/                # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── endpoints/         # Endpoint-specific components
│   │   ├── endpoint-stats.tsx
│   │   ├── endpoint-card.tsx
│   │   └── endpoint-list.tsx
│   └── shared/            # Shared components
│       └── providers.tsx  # React Query provider
│
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client functions
│   ├── types.ts          # TypeScript type definitions
│   ├── validations.ts    # Zod validation schemas
│   └── utils.ts          # Utility functions
│
└── hooks/                 # Custom React hooks
    └── use-endpoints.ts   # React Query hooks for endpoints
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the backend API at the URL specified in `NEXT_PUBLIC_API_URL`. Make sure your backend server is running before starting the frontend.

### API Endpoints Used

- `GET /api-mock/endpoints` - Get all endpoints
- `GET /api-mock/endpoints/:id` - Get single endpoint
- `POST /api-mock/endpoints` - Create endpoint
- `PATCH /api-mock/endpoints/:id` - Update endpoint
- `DELETE /api-mock/endpoints/:id` - Delete endpoint
- `GET /api-mock/stats` - Get statistics

## Development

### Adding New Components

To add shadcn/ui components:

```bash
npx shadcn-ui@latest add [component-name]
```

For example:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
```

### Type Safety

All API responses are typed using TypeScript interfaces defined in `src/lib/types.ts`. Forms are validated using Zod schemas in `src/lib/validations.ts`.

## Next Steps

The basic structure is now in place. You can extend it with:

1. **Create/Edit Forms**: Add modal or page for creating and editing endpoints
2. **Search & Filtering**: Add search bar and filters for endpoints
3. **Bulk Operations**: Enable selecting multiple endpoints for bulk actions
4. **Import/Export**: Add JSON import/export functionality
5. **Testing Tools**: Add endpoint testing with request/response preview
6. **Dark Mode Toggle**: Add theme switcher component

## Troubleshooting

### API Connection Issues

If you see "Failed to load endpoints" error:
1. Make sure the backend API is running
2. Verify the `NEXT_PUBLIC_API_URL` in `.env.local` is correct
3. Check that there are no CORS issues

### Build Errors

If you encounter TypeScript errors:
1. Run `npm install` to ensure all dependencies are installed
2. Delete `.next` folder and rebuild: `rm -rf .next && npm run build`

## License

MIT
