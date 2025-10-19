export interface JsonTemplate {
  id: string;
  name: string;
  description: string;
  statusCode?: number;
  category: "status-code" | "common-object";
  template: unknown;
}

export const statusCodeTemplates: JsonTemplate[] = [
  {
    id: "success-200",
    name: "Success (200)",
    description: "Standard success response",
    statusCode: 200,
    category: "status-code",
    template: {
      success: true,
      data: {},
      message: "Request successful",
    },
  },
  {
    id: "created-201",
    name: "Created (201)",
    description: "Resource created successfully",
    statusCode: 201,
    category: "status-code",
    template: {
      success: true,
      id: "generated-id",
      message: "Resource created successfully",
    },
  },
  {
    id: "no-content-204",
    name: "No Content (204)",
    description: "Success with no content",
    statusCode: 204,
    category: "status-code",
    template: {},
  },
  {
    id: "bad-request-400",
    name: "Bad Request (400)",
    description: "Invalid request parameters",
    statusCode: 400,
    category: "status-code",
    template: {
      error: "Bad Request",
      message: "Invalid request parameters",
      details: [],
    },
  },
  {
    id: "unauthorized-401",
    name: "Unauthorized (401)",
    description: "Authentication required",
    statusCode: 401,
    category: "status-code",
    template: {
      error: "Unauthorized",
      message: "Authentication required",
    },
  },
  {
    id: "forbidden-403",
    name: "Forbidden (403)",
    description: "Access denied",
    statusCode: 403,
    category: "status-code",
    template: {
      error: "Forbidden",
      message: "You do not have permission to access this resource",
    },
  },
  {
    id: "not-found-404",
    name: "Not Found (404)",
    description: "Resource not found",
    statusCode: 404,
    category: "status-code",
    template: {
      error: "Not Found",
      message: "The requested resource was not found",
    },
  },
  {
    id: "conflict-409",
    name: "Conflict (409)",
    description: "Resource conflict",
    statusCode: 409,
    category: "status-code",
    template: {
      error: "Conflict",
      message: "Resource already exists",
    },
  },
  {
    id: "validation-422",
    name: "Validation Error (422)",
    description: "Validation failed",
    statusCode: 422,
    category: "status-code",
    template: {
      error: "Validation Error",
      message: "Validation failed",
      errors: [
        {
          field: "email",
          message: "Invalid email format",
        },
      ],
    },
  },
  {
    id: "server-error-500",
    name: "Server Error (500)",
    description: "Internal server error",
    statusCode: 500,
    category: "status-code",
    template: {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    },
  },
  {
    id: "service-unavailable-503",
    name: "Service Unavailable (503)",
    description: "Service temporarily unavailable",
    statusCode: 503,
    category: "status-code",
    template: {
      error: "Service Unavailable",
      message: "Service is temporarily unavailable. Please try again later.",
    },
  },
];

export const commonObjectTemplates: JsonTemplate[] = [
  // Users list (200)
  {
    id: "users-list-200",
    name: "Users List (200)",
    description: "List of users with mocked data (15 rows)",
    statusCode: 200,
    category: "common-object",
    template: {
      success: true,
      data: [
        { id: "user-001", name: "Alice Johnson", email: "alice@example.com", createdAt: "2024-01-05T10:15:00.000Z" },
        { id: "user-002", name: "Bob Smith", email: "bob@example.com", createdAt: "2024-02-12T09:42:00.000Z" },
        { id: "user-003", name: "Carol Williams", email: "carol@example.com", createdAt: "2024-03-20T14:30:00.000Z" },
        { id: "user-004", name: "David Brown", email: "david@example.com", createdAt: "2024-04-02T08:00:00.000Z" },
        { id: "user-005", name: "Eva Davis", email: "eva@example.com", createdAt: "2024-04-15T12:10:00.000Z" },
        { id: "user-006", name: "Frank Miller", email: "frank@example.com", createdAt: "2024-05-01T16:55:00.000Z" },
        { id: "user-007", name: "Grace Wilson", email: "grace@example.com", createdAt: "2024-05-21T11:20:00.000Z" },
        { id: "user-008", name: "Henry Moore", email: "henry@example.com", createdAt: "2024-06-10T13:47:00.000Z" },
        { id: "user-009", name: "Ivy Taylor", email: "ivy@example.com", createdAt: "2024-07-07T07:35:00.000Z" },
        { id: "user-010", name: "Jack Anderson", email: "jack@example.com", createdAt: "2024-08-18T19:25:00.000Z" },
        { id: "user-011", name: "Karen Thomas", email: "karen@example.com", createdAt: "2024-09-03T06:12:00.000Z" },
        { id: "user-012", name: "Liam Jackson", email: "liam@example.com", createdAt: "2024-09-24T21:10:00.000Z" },
        { id: "user-013", name: "Mia White", email: "mia@example.com", createdAt: "2024-10-05T15:45:00.000Z" },
        { id: "user-014", name: "Noah Harris", email: "noah@example.com", createdAt: "2024-10-12T10:05:00.000Z" },
        { id: "user-015", name: "Olivia Martin", email: "olivia@example.com", createdAt: "2024-10-18T18:40:00.000Z" }
      ],
    },
  },

  // Products list (200)
  {
    id: "products-list-200",
    name: "Products List (200)",
    description: "List of products with mocked data (12 rows)",
    statusCode: 200,
    category: "common-object",
    template: {
      success: true,
      data: [
        { id: "prod-001", name: "Wireless Mouse", price: 24.99, currency: "USD", inStock: true, category: "Accessories", createdAt: "2024-02-01T10:00:00.000Z" },
        { id: "prod-002", name: "Mechanical Keyboard", price: 79.99, currency: "USD", inStock: true, category: "Accessories", createdAt: "2024-02-10T11:30:00.000Z" },
        { id: "prod-003", name: "27in Monitor", price: 199.99, currency: "USD", inStock: false, category: "Displays", createdAt: "2024-02-15T09:20:00.000Z" },
        { id: "prod-004", name: "USB-C Hub", price: 39.99, currency: "USD", inStock: true, category: "Adapters", createdAt: "2024-03-01T14:45:00.000Z" },
        { id: "prod-005", name: "Noise Cancelling Headphones", price: 149.0, currency: "USD", inStock: true, category: "Audio", createdAt: "2024-03-12T08:10:00.000Z" },
        { id: "prod-006", name: "Webcam 1080p", price: 49.99, currency: "USD", inStock: true, category: "Cameras", createdAt: "2024-03-25T16:25:00.000Z" },
        { id: "prod-007", name: "Laptop Stand", price: 29.99, currency: "USD", inStock: true, category: "Accessories", createdAt: "2024-04-05T12:00:00.000Z" },
        { id: "prod-008", name: "Portable SSD 1TB", price: 109.99, currency: "USD", inStock: true, category: "Storage", createdAt: "2024-04-20T07:50:00.000Z" },
        { id: "prod-009", name: "Smartphone Charger 30W", price: 19.99, currency: "USD", inStock: true, category: "Power", createdAt: "2024-05-02T18:33:00.000Z" },
        { id: "prod-010", name: "Bluetooth Speaker", price: 59.99, currency: "USD", inStock: false, category: "Audio", createdAt: "2024-05-14T21:05:00.000Z" },
        { id: "prod-011", name: "Action Camera", price: 219.99, currency: "USD", inStock: true, category: "Cameras", createdAt: "2024-05-30T10:40:00.000Z" },
        { id: "prod-012", name: "Gaming Chair", price: 179.99, currency: "USD", inStock: true, category: "Furniture", createdAt: "2024-06-08T13:15:00.000Z" }
      ],
    },
  },

  // Orders list (200)
  {
    id: "orders-list-200",
    name: "Orders List (200)",
    description: "List of orders with mocked data (14 rows)",
    statusCode: 200,
    category: "common-object",
    template: {
      success: true,
      data: [
        { id: "order-001", userId: "user-001", total: 129.98, currency: "USD", status: "delivered", createdAt: "2024-06-01T09:00:00.000Z" },
        { id: "order-002", userId: "user-002", total: 49.99, currency: "USD", status: "shipped", createdAt: "2024-06-03T11:10:00.000Z" },
        { id: "order-003", userId: "user-003", total: 19.99, currency: "USD", status: "processing", createdAt: "2024-06-05T15:45:00.000Z" },
        { id: "order-004", userId: "user-004", total: 219.99, currency: "USD", status: "delivered", createdAt: "2024-06-08T08:25:00.000Z" },
        { id: "order-005", userId: "user-005", total: 59.99, currency: "USD", status: "cancelled", createdAt: "2024-06-10T13:50:00.000Z" },
        { id: "order-006", userId: "user-006", total: 89.99, currency: "USD", status: "pending", createdAt: "2024-06-12T17:05:00.000Z" },
        { id: "order-007", userId: "user-007", total: 39.99, currency: "USD", status: "processing", createdAt: "2024-06-15T10:30:00.000Z" },
        { id: "order-008", userId: "user-008", total: 279.99, currency: "USD", status: "shipped", createdAt: "2024-06-18T19:40:00.000Z" },
        { id: "order-009", userId: "user-009", total: 24.99, currency: "USD", status: "delivered", createdAt: "2024-06-20T07:55:00.000Z" },
        { id: "order-010", userId: "user-010", total: 149.0, currency: "USD", status: "processing", createdAt: "2024-06-22T12:12:00.000Z" },
        { id: "order-011", userId: "user-011", total: 79.99, currency: "USD", status: "delivered", createdAt: "2024-06-25T16:18:00.000Z" },
        { id: "order-012", userId: "user-012", total: 39.99, currency: "USD", status: "pending", createdAt: "2024-06-28T09:35:00.000Z" },
        { id: "order-013", userId: "user-013", total: 199.99, currency: "USD", status: "shipped", createdAt: "2024-07-01T14:00:00.000Z" },
        { id: "order-014", userId: "user-014", total: 59.99, currency: "USD", status: "delivered", createdAt: "2024-07-04T20:45:00.000Z" }
      ],
    },
  },

  // Posts list (200)
  {
    id: "posts-list-200",
    name: "Posts List (200)",
    description: "List of posts with mocked data (12 rows)",
    statusCode: 200,
    category: "common-object",
    template: {
      success: true,
      data: [
        { id: "post-001", title: "Getting Started with TypeScript", authorId: "user-001", publishedAt: "2024-05-01T10:00:00.000Z" },
        { id: "post-002", title: "Advanced React Patterns", authorId: "user-002", publishedAt: "2024-05-03T12:30:00.000Z" },
        { id: "post-003", title: "State Management in 2024", authorId: "user-003", publishedAt: "2024-05-06T09:15:00.000Z" },
        { id: "post-004", title: "Web Performance Tips", authorId: "user-004", publishedAt: "2024-05-09T15:45:00.000Z" },
        { id: "post-005", title: "Testing Strategies", authorId: "user-005", publishedAt: "2024-05-12T08:05:00.000Z" },
        { id: "post-006", title: "Design Systems 101", authorId: "user-006", publishedAt: "2024-05-16T14:20:00.000Z" },
        { id: "post-007", title: "API Security Basics", authorId: "user-007", publishedAt: "2024-05-20T11:10:00.000Z" },
        { id: "post-008", title: "GraphQL vs REST", authorId: "user-008", publishedAt: "2024-05-25T17:35:00.000Z" },
        { id: "post-009", title: "Serverless Best Practices", authorId: "user-009", publishedAt: "2024-05-28T07:50:00.000Z" },
        { id: "post-010", title: "Caching Strategies", authorId: "user-010", publishedAt: "2024-06-02T13:05:00.000Z" },
        { id: "post-011", title: "Monorepos at Scale", authorId: "user-011", publishedAt: "2024-06-05T19:22:00.000Z" },
        { id: "post-012", title: "CI/CD Pipelines", authorId: "user-012", publishedAt: "2024-06-09T10:40:00.000Z" }
      ],
    },
  },

  // Comments list (200)
  {
    id: "comments-list-200",
    name: "Comments List (200)",
    description: "List of comments with mocked data (20 rows)",
    statusCode: 200,
    category: "common-object",
    template: {
      success: true,
      data: [
        { id: "comment-001", postId: "post-001", author: "Alice Johnson", content: "Great article!", createdAt: "2024-06-01T09:10:00.000Z" },
        { id: "comment-002", postId: "post-001", author: "Bob Smith", content: "Very helpful, thanks.", createdAt: "2024-06-01T09:15:00.000Z" },
        { id: "comment-003", postId: "post-002", author: "Carol Williams", content: "I prefer hooks for this.", createdAt: "2024-06-02T12:00:00.000Z" },
        { id: "comment-004", postId: "post-003", author: "David Brown", content: "Can you cover Zustand?", createdAt: "2024-06-03T14:25:00.000Z" },
        { id: "comment-005", postId: "post-004", author: "Eva Davis", content: "Performance tips are gold.", createdAt: "2024-06-04T08:40:00.000Z" },
        { id: "comment-006", postId: "post-005", author: "Frank Miller", content: "How about E2E tests?", createdAt: "2024-06-05T16:05:00.000Z" },
        { id: "comment-007", postId: "post-006", author: "Grace Wilson", content: "Nice intro to design systems.", createdAt: "2024-06-06T11:30:00.000Z" },
        { id: "comment-008", postId: "post-007", author: "Henry Moore", content: "Security is underrated.", createdAt: "2024-06-07T13:55:00.000Z" },
        { id: "comment-009", postId: "post-008", author: "Ivy Taylor", content: "Team GraphQL here.", createdAt: "2024-06-08T07:20:00.000Z" },
        { id: "comment-010", postId: "post-009", author: "Jack Anderson", content: "Serverless saved us.", createdAt: "2024-06-09T19:00:00.000Z" },
        { id: "comment-011", postId: "post-010", author: "Karen Thomas", content: "Cache invalidation is hard.", createdAt: "2024-06-10T06:42:00.000Z" },
        { id: "comment-012", postId: "post-011", author: "Liam Jackson", content: "Monorepos are tricky.", createdAt: "2024-06-11T21:15:00.000Z" },
        { id: "comment-013", postId: "post-012", author: "Mia White", content: "Great CI tips!", createdAt: "2024-06-12T15:33:00.000Z" },
        { id: "comment-014", postId: "post-002", author: "Noah Harris", content: "Can you share code?", createdAt: "2024-06-13T09:05:00.000Z" },
        { id: "comment-015", postId: "post-003", author: "Olivia Martin", content: "Loved the examples.", createdAt: "2024-06-14T18:45:00.000Z" },
        { id: "comment-016", postId: "post-004", author: "Paul Young", content: "More on Web Vitals?", createdAt: "2024-06-15T10:10:00.000Z" },
        { id: "comment-017", postId: "post-005", author: "Quinn Lee", content: "What about mutation tests?", createdAt: "2024-06-16T12:20:00.000Z" },
        { id: "comment-018", postId: "post-006", author: "Rose Kim", content: "Love the design tokens part.", createdAt: "2024-06-17T08:55:00.000Z" },
        { id: "comment-019", postId: "post-007", author: "Sam Green", content: "JWT tips were useful.", createdAt: "2024-06-18T20:05:00.000Z" },
        { id: "comment-020", postId: "post-008", author: "Tina Chen", content: "REST is still king.", createdAt: "2024-06-19T14:30:00.000Z" }
      ],
    },
  }
];

export const allTemplates = [...statusCodeTemplates, ...commonObjectTemplates];

export function getTemplatesByCategory(category: "status-code" | "common-object") {
  return allTemplates.filter((t) => t.category === category);
}

export function getTemplateById(id: string) {
  return allTemplates.find((t) => t.id === id);
}
