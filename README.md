# CORS Bridge - Frontend

A modern Next.js frontend for managing and testing both Mock API endpoints and HTTP Proxy endpoints. Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Mock API Endpoints
- **Custom Responses**: Create mock API responses with configurable data
- **Flexible Configuration**: Set custom status codes, delays, and content types
- **Response Data**: Support for JSON, XML, plain text, and HTML responses
- **Statistics Dashboard**: Track total, enabled, and disabled endpoints

### HTTP Proxy Endpoints
- **Three Operational Modes**:
  - **Direct Proxy**: One-off requests without configuration (`?url=` parameter)
  - **Static Mode**: Pre-configured upstream servers with fixed baseUrl
  - **Dynamic Mode**: Runtime URL specification via `?url=` parameter
- **Optional Caching**: 5-minute TTL caching for improved performance
- **CORS Bypass**: Proxy requests to bypass CORS restrictions
- **Advanced Controls**: Configurable delays and status code overrides

### General Features
- **Real-time Updates**: Powered by TanStack Query for optimistic updates
- **Type-Safe**: Full TypeScript support with strict mode
- **Modern UI**: Clean, responsive design using shadcn/ui components
- **Dark Mode**: Built-in dark mode support with theme toggle
- **Dual Navigation**: Seamless switching between Mock APIs and HTTP Proxy

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
│   ├── page.tsx           # Mock APIs page (home)
│   ├── proxy/             # HTTP Proxy page
│   │   └── page.tsx
│   └── globals.css        # Global styles with Tailwind
│
├── components/
│   ├── ui/                # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── endpoints/         # Mock endpoint components
│   │   ├── endpoint-stats.tsx
│   │   ├── endpoint-card.tsx
│   │   ├── endpoint-list.tsx
│   │   ├── create-endpoint-dialog.tsx
│   │   └── endpoint-details-dialog.tsx
│   ├── proxy/             # HTTP proxy components
│   │   ├── proxy-stats.tsx
│   │   ├── proxy-card.tsx
│   │   ├── proxy-list.tsx
│   │   ├── create-proxy-dialog.tsx
│   │   ├── edit-proxy-dialog.tsx
│   │   └── proxy-details-dialog.tsx
│   └── shared/            # Shared components
│       ├── providers.tsx  # React Query provider
│       └── header.tsx     # App header with navigation
│
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client functions
│   ├── types.ts          # TypeScript type definitions
│   ├── validations.ts    # Zod validation schemas
│   └── utils.ts          # Utility functions
│
└── hooks/                 # Custom React hooks
    ├── use-endpoints.ts   # React Query hooks for mock endpoints
    └── use-proxy-endpoints.ts  # React Query hooks for proxy endpoints
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the backend API at the URL specified in `NEXT_PUBLIC_API_URL`. Make sure your backend server is running before starting the frontend.

### Mock API Endpoints

- `GET /api-mock/endpoints` - Get all mock endpoints
- `GET /api-mock/endpoints/:id` - Get single mock endpoint
- `POST /api-mock/endpoints` - Create mock endpoint
- `PATCH /api-mock/endpoints/:id` - Update mock endpoint
- `DELETE /api-mock/endpoints/:id` - Delete mock endpoint
- `GET /api-mock/stats` - Get mock endpoint statistics

### HTTP Proxy Endpoints

- `GET /api-proxy/endpoints` - Get all proxy endpoints
- `GET /api-proxy/endpoints/:id` - Get single proxy endpoint
- `POST /api-proxy/endpoints` - Create proxy endpoint
- `PATCH /api-proxy/endpoints/:id` - Update proxy endpoint
- `DELETE /api-proxy/endpoints/:id` - Delete proxy endpoint
- `GET /api-proxy/stats` - Get proxy endpoint statistics
- `GET /api-proxy/serve/{path}` - Proxy request to configured upstream
- `GET /api-proxy/serve?url=...` - Direct proxy mode (no configuration needed)

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

## HTTP Proxy Modes

The proxy feature supports three operational modes:

### 1. Direct Proxy Mode
```bash
GET /api-proxy/serve?url=https://api.example.com/data
```
- No endpoint configuration needed
- Perfect for one-off requests and testing
- Bypasses CORS restrictions immediately

### 2. Static Mode
```bash
# Create endpoint with fixed baseUrl
Endpoint: { path: "/users", baseUrl: "https://api.example.com" }

# Make request
GET /api-proxy/serve/users
# Proxies to: https://api.example.com
```
- Pre-configured upstream server
- Optional 5-minute response caching
- Configurable delays and status overrides

### 3. Dynamic Mode
```bash
# Create endpoint without baseUrl
Endpoint: { path: "/flexible", baseUrl: null }

# Make request with runtime URL
GET /api-proxy/serve/flexible?url=https://api.example.com
```
- No fixed upstream server
- Accepts URL via `?url=` parameter
- Inherits endpoint settings (delay, status override, cache)

## Next Steps

You can extend the application with:

1. **Search & Filtering**: Add search bar and filters for endpoints
2. **Bulk Operations**: Enable selecting multiple endpoints for bulk actions
3. **Import/Export**: Add JSON import/export functionality for endpoints
4. **Request History**: Track and display request history for proxy endpoints
5. **Analytics**: Add usage analytics and request metrics
6. **Authentication**: Implement user authentication and authorization

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
