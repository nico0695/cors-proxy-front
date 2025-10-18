# Next.js Frontend Development Prompt

Use this prompt with your AI coding assistant (Claude, ChatGPT, etc.) to build a modern frontend for the Mock API Manager.

---

## Prompt Template

```
I need you to help me build a modern, production-ready frontend for a Mock API Manager using Next.js 14+.

# Context

I have a backend API server that manages mock endpoints for testing and development. The complete API documentation is available at API-DOCUMENTATION.md (attach the file).

The current implementation uses vanilla JavaScript (mock-manage.html), but I want to rebuild it with modern technologies for better developer experience, type safety, and advanced features.

# Requirements

## Tech Stack (MANDATORY)

- Next.js 14+ with App Router
- TypeScript (strict mode)
- shadcn/ui for UI components
- Tailwind CSS for styling
- TanStack Query (React Query) for server state
- React Hook Form for forms
- Zod for validation
- Lucide Icons for icons

## Core Features (Phase 1 - MVP)

### 1. Endpoints Management Dashboard
- Display all mock endpoints in a responsive grid/list
- Show key information: name, path, status code, enabled status, delay
- Real-time statistics (total, enabled, disabled, remaining slots)
- Visual indicators for status (badges with colors)
- Enable/disable toggle for each endpoint

### 2. Create Endpoint
- Modal or dedicated page with form
- Fields:
  - Name (required, text input)
  - Path (required, text input with validation)
  - Group ID (optional, text input or select)
  - Content Type (select: JSON, XML, plain text, HTML)
  - Status Code (select with common codes: 200, 201, 400, 404, 500, etc.)
  - Response Data (code editor with syntax highlighting)
  - Enabled (toggle, default: true)
  - Delay (number input, 0-10000ms, slider optional)
- Validation:
  - Path must start with /
  - Response data must be valid JSON if content type is application/json
  - All required fields
- Success feedback (toast notification)
- Auto-refresh list after creation

### 3. Edit Endpoint
- Pre-filled form with existing data
- Same validation as create
- Update button instead of create
- Optimistic UI updates

### 4. Delete Endpoint
- Confirmation dialog
- Success feedback
- Auto-refresh list after deletion

### 5. View Endpoint Details
- Expandable card or modal with full information
- Display all fields including timestamps
- Copy endpoint URL button (copies full URL: http://localhost:8080/api-mock/serve{path})
- "Test Endpoint" button that makes a real request and shows response
- Response preview formatted (JSON pretty-print, XML formatting, etc.)

### 6. Statistics Dashboard
- Cards showing:
  - Total endpoints
  - Enabled endpoints
  - Disabled endpoints
  - Remaining slots (50 max)
- Warning indicator when remaining slots ≤ 5
- Visual charts (optional but nice to have)

## Enhanced Features (Phase 2 - Nice to Have)

### 1. Search & Filtering
- Search bar for name/path
- Filter by:
  - Status (enabled/disabled)
  - Status code range
  - Group
  - Content type
- Clear filters button

### 2. Bulk Operations
- Checkbox selection for multiple endpoints
- Bulk enable/disable
- Bulk delete with confirmation
- Select all / deselect all

### 3. Import/Export
- Export all endpoints as JSON file
- Export selected endpoints
- Import from JSON file with validation
- Download button
- Drag-and-drop file upload

### 4. Grouping
- Group view (accordion or tabs by groupId)
- Group management (create, edit groups)
- Color coding by group
- Assign endpoints to groups

### 5. Testing Tools
- Test endpoint directly from UI (send request)
- Display response with timing
- cURL command generator
- Request history (last 10 requests per endpoint)

## UI/UX Requirements

### Design Principles
- Clean, modern, minimalist design
- Consistent spacing and typography
- Professional color scheme (use shadcn/ui defaults)
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations (framer-motion optional)

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Focus indicators
- Semantic HTML

### Performance
- Optimistic UI updates
- Debounced search input
- Virtual scrolling for large lists (>100 items)
- Loading skeletons
- Error boundaries

### User Feedback
- Toast notifications for success/error
- Loading states with spinners
- Confirmation dialogs for destructive actions
- Form validation errors inline

## Project Structure

```
app/
├── layout.tsx                  # Root layout with providers
├── page.tsx                    # Home/dashboard
├── endpoints/
│   ├── page.tsx                # Endpoints list
│   ├── new/
│   │   └── page.tsx            # Create endpoint
│   └── [id]/
│       ├── page.tsx            # Endpoint details
│       └── edit/
│           └── page.tsx        # Edit endpoint
│
components/
├── ui/                         # shadcn/ui components
├── endpoints/
│   ├── endpoint-card.tsx       # Single endpoint card
│   ├── endpoint-form.tsx       # Create/edit form
│   ├── endpoint-list.tsx       # List container
│   ├── endpoint-filters.tsx    # Search & filters
│   ├── endpoint-details.tsx    # Details view
│   └── endpoint-stats.tsx      # Statistics cards
├── shared/
│   ├── header.tsx              # App header
│   ├── sidebar.tsx             # Navigation sidebar
│   └── providers.tsx           # All providers
│
lib/
├── api.ts                      # API client functions
├── types.ts                    # TypeScript types
├── validations.ts              # Zod schemas
└── utils.ts                    # Utility functions

hooks/
├── use-endpoints.ts            # React Query hooks
└── use-toast.ts                # Toast notifications
```

## API Integration

Base URL: `http://localhost:8080`

Endpoints to integrate:
- `GET /api-mock/endpoints` - Get all endpoints
- `GET /api-mock/endpoints/:id` - Get single endpoint
- `POST /api-mock/endpoints` - Create endpoint
- `PATCH /api-mock/endpoints/:id` - Update endpoint
- `DELETE /api-mock/endpoints/:id` - Delete endpoint
- `GET /api-mock/stats` - Get statistics

Use TanStack Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

## TypeScript Types

Use these types (from API-DOCUMENTATION.md):

```typescript
interface MockEndpoint {
  id: string;
  name: string;
  path: string;
  groupId?: string;
  responseData: unknown;
  contentType: string;
  statusCode: number;
  enabled: boolean;
  delayMs: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateMockEndpointDto {
  name: string;
  path: string;
  groupId?: string;
  responseData: unknown;
  contentType?: string;
  statusCode?: number;
  enabled?: boolean;
  delayMs?: number;
}

interface UpdateMockEndpointDto {
  name?: string;
  path?: string;
  groupId?: string;
  responseData?: unknown;
  contentType?: string;
  statusCode?: number;
  enabled?: boolean;
  delayMs?: number;
}
```

## Validation Rules

Use Zod for form validation:

```typescript
const createEndpointSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  path: z.string().min(1, 'Path is required').regex(/^\//, 'Path must start with /'),
  groupId: z.string().optional(),
  responseData: z.string().min(1, 'Response data is required'),
  contentType: z.enum(['application/json', 'application/xml', 'text/plain', 'text/html']),
  statusCode: z.number().int().min(100).max(599),
  enabled: z.boolean().default(true),
  delayMs: z.number().int().min(0).max(10000).default(0),
});
```

Custom validation:
- If contentType is 'application/json', validate that responseData is valid JSON
- Path must be unique (check against existing endpoints)
- Maximum 50 endpoints limit (check before allowing create)

## Installation & Setup

1. Initialize Next.js project:
```bash
npx create-next-app@latest mock-api-manager --typescript --tailwind --app
cd mock-api-manager
```

2. Install dependencies:
```bash
# UI Components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select textarea dialog toast switch badge

# State Management & Forms
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers

# Code Editor
npm install @monaco-editor/react

# Icons
npm install lucide-react

# Utilities
npm install date-fns clsx tailwind-merge
```

3. Set up environment variables:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Step-by-Step Implementation

### Step 1: Setup & Configuration
1. Initialize project with Next.js
2. Install all dependencies
3. Set up shadcn/ui
4. Configure TanStack Query provider
5. Set up environment variables

### Step 2: Core Structure
1. Create folder structure
2. Set up API client (lib/api.ts)
3. Define TypeScript types (lib/types.ts)
4. Create Zod schemas (lib/validations.ts)

### Step 3: API Integration
1. Create React Query hooks (hooks/use-endpoints.ts)
2. Implement all CRUD operations
3. Add error handling
4. Test API connections

### Step 4: UI Components (shadcn/ui)
1. Set up base UI components
2. Create endpoint card component
3. Create endpoint list component
4. Create stats cards component

### Step 5: Main Features
1. Endpoints list page with real data
2. Create endpoint modal/page with form
3. Edit endpoint functionality
4. Delete with confirmation
5. Enable/disable toggle

### Step 6: Enhanced Features (Phase 2)
1. Search and filtering
2. Bulk operations
3. Import/export
4. Testing tools
5. Grouping

### Step 7: Polish
1. Add loading states
2. Add error boundaries
3. Implement dark mode
4. Add animations
5. Optimize performance
6. Test accessibility

## Code Examples to Start

### API Client (lib/api.ts)
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  getEndpoints: async () => {
    const res = await fetch(\`\${API_BASE}/api-mock/endpoints\`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },
  // ... more methods
};
```

### React Query Hook (hooks/use-endpoints.ts)
```typescript
export const useEndpoints = () => {
  return useQuery({
    queryKey: ['endpoints'],
    queryFn: api.getEndpoints,
  });
};
```

### Component Example (components/endpoints/endpoint-card.tsx)
```typescript
export function EndpointCard({ endpoint }: { endpoint: MockEndpoint }) {
  const updateMutation = useUpdateEndpoint();

  const toggleEnabled = () => {
    updateMutation.mutate({
      id: endpoint.id,
      data: { enabled: !endpoint.enabled }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{endpoint.name}</CardTitle>
        <Badge>{endpoint.statusCode}</Badge>
      </CardHeader>
      <CardContent>
        <code>{endpoint.path}</code>
        <Switch checked={endpoint.enabled} onCheckedChange={toggleEnabled} />
      </CardContent>
    </Card>
  );
}
```

## Success Criteria

The frontend is complete when:
- ✅ All CRUD operations work correctly
- ✅ Form validation prevents invalid data
- ✅ UI is responsive on all screen sizes
- ✅ Dark mode works properly
- ✅ Loading states are smooth
- ✅ Error handling is user-friendly
- ✅ Statistics update in real-time
- ✅ Code is type-safe (no TypeScript errors)
- ✅ Components are reusable and well-organized
- ✅ Performance is optimized (no unnecessary re-renders)

## Questions to Answer

1. Should we use a modal or a separate page for create/edit forms?
2. Do you want virtualized scrolling for large lists?
3. Should we implement real-time updates (WebSocket) or just polling?
4. Do you need multi-language support (i18n)?
5. Should we add user authentication?
6. Do you want to deploy this (Vercel, Netlify)?

## Expected Deliverables

1. Fully functional Next.js application
2. All components properly typed with TypeScript
3. Responsive design that works on mobile, tablet, and desktop
4. README with setup instructions
5. Environment variables documentation
6. Comments explaining complex logic

## Additional Notes

- Follow Next.js 14+ best practices (use Server Components where possible)
- Use "use client" directive only when necessary
- Implement proper error boundaries
- Add loading.tsx and error.tsx files
- Use Suspense for streaming
- Optimize images with next/image
- Follow accessibility guidelines (WCAG 2.1)
- Write clean, maintainable code with clear comments

# Start Here

Please begin by:
1. Confirming you understand the requirements
2. Setting up the initial Next.js project structure
3. Installing all required dependencies
4. Creating the API client and types
5. Building the first component (endpoint list)

Let me know if you need any clarification on any requirement!
```

---

## How to Use This Prompt

### Option 1: With Claude or ChatGPT

1. **Copy the entire prompt** from the template above
2. **Attach the API-DOCUMENTATION.md file** to your conversation
3. **Paste the prompt** and start the conversation
4. **Ask follow-up questions** as needed:
   - "Can you create the folder structure first?"
   - "Show me the complete endpoint card component"
   - "Help me set up TanStack Query"
   - "Create the validation schemas"

### Option 2: Break it into Steps

**Session 1: Setup**
```
Using the API-DOCUMENTATION.md, help me set up a Next.js 14+ project with TypeScript, shadcn/ui, and TanStack Query. Create the initial folder structure and install all dependencies.
```

**Session 2: API Integration**
```
Create the API client (lib/api.ts) and React Query hooks (hooks/use-endpoints.ts) for all CRUD operations. Use TypeScript types from API-DOCUMENTATION.md.
```

**Session 3: Components**
```
Build the endpoint card, list, and stats components using shadcn/ui. Make them responsive and accessible.
```

**Session 4: Forms**
```
Create the endpoint form component with React Hook Form and Zod validation. Support both create and edit modes.
```

**Session 5: Polish**
```
Add search, filtering, bulk operations, and error handling. Implement loading states and dark mode.
```

### Option 3: Specific Feature Requests

```
From API-DOCUMENTATION.md, create a Next.js component that:
1. Displays all endpoints in a responsive grid
2. Shows statistics cards at the top
3. Has a search bar and filters
4. Uses shadcn/ui components
5. Integrates with TanStack Query for data fetching
```

---

## Tips for Best Results

1. **Be Specific:** Reference exact sections of API-DOCUMENTATION.md
2. **Iterate:** Build incrementally, test each feature
3. **Ask for Explanations:** Don't just copy code, understand it
4. **Request Alternatives:** "Show me 2 different ways to implement this"
5. **Test Thoroughly:** Ask for edge cases and error scenarios
6. **Optimize Later:** Get it working first, then optimize

---

## Example Follow-up Questions

- "How do I handle optimistic updates with TanStack Query?"
- "Show me how to implement the toggle switch with shadcn/ui"
- "What's the best way to validate JSON in the response data field?"
- "How can I add keyboard shortcuts for common actions?"
- "Create a custom hook for bulk operations"
- "Show me how to implement the export to JSON feature"
- "Help me set up dark mode with next-themes"
- "How do I test these components with Vitest and Testing Library?"

---

## Customization Options

Modify the prompt to suit your needs:

- **Different UI Library:** Replace shadcn/ui with Material-UI, Ant Design, etc.
- **Different State:** Replace TanStack Query with SWR or RTK Query
- **Add Features:** Real-time updates, authentication, analytics
- **Change Layout:** Add sidebar navigation, tabbed interface
- **Different Framework:** Adapt for Vue.js, Svelte, Angular

---

## Success Checklist

After implementation, verify:

- [ ] All API endpoints are integrated correctly
- [ ] CRUD operations work as expected
- [ ] Form validation prevents bad data
- [ ] UI matches design requirements
- [ ] Responsive on all screen sizes
- [ ] Dark mode toggles correctly
- [ ] Loading states show during requests
- [ ] Error messages are user-friendly
- [ ] Toast notifications appear for actions
- [ ] Statistics update after changes
- [ ] Code is properly typed (no TS errors)
- [ ] Components are reusable
- [ ] Performance is acceptable
- [ ] Accessibility standards met

---

Good luck building your Next.js frontend! 🚀
