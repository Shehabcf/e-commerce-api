# E-Commerce REST API

A complete e-commerce backend built with Node.js, Express.js, MongoDB, and Mongoose.

## Features
- Categories CRUD
- Products CRUD with filtering (category, price range, stock, search)
- Cart management
- Orders with checkout logic

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Shehabcf/ecommerce-api.git
   cd ecommerce-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env` and fill in values)
4. Seed the database:
   ```bash
   npm run seed
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
| Variable | Description | Example |
|---|---|---|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGO_URI | MongoDB connection string | mongodb://127.0.0.1:27017/ecommerce-db |

## API Endpoints

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/categories | Get all categories |
| GET | /api/categories/:id | Get category by ID |
| POST | /api/categories | Create category |
| PATCH | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get all products (supports filters) |
| GET | /api/products/:id | Get product by ID (populated category) |
| POST | /api/products | Create product |
| PATCH | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/cart | View cart |
| POST | /api/cart/items | Add item to cart |
| PATCH | /api/cart/items/:productId | Update item quantity |
| DELETE | /api/cart/items/:productId | Remove item |
| DELETE | /api/cart | Clear cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/orders | Create order (checkout) |
| GET | /api/orders | Get all orders |
| GET | /api/orders/:id | Get order by ID |
| PATCH | /api/orders/:id/status | Update order status |

## Project Structure
```
ecommerce-api/
├── config/        # Database connection setup
├── controllers/   # Business logic for each resource
├── db/            # Database-related utilities
├── middleware/    # Error handling, sanitization
├── models/        # Mongoose schemas
├── routes/        # Express route definitions
├── utils/         # AppError, asyncHandler helpers
├── postman/       # Exported Postman collection & environment
├── app.js         # Application entry point
├── seed.js        # Database seeding script
└── .env.example   # Environment variable template
```
