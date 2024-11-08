# An example expressJS application
This repo is for per scholas training, containing all the nodeJS with expressJS codes

# How to run
npm install && npm run dev

.env file:
> PORT=3000
> MONGOOSE_URI=your connection string
### scripts
- npm run dev
  > start development process
- npm run seed
  > run db/seed.js to seed database

## API Endpoints

#### Users API

| HTTP Method | Endpoint | Description
| ---- | ---- | ---- 
| GET | /api/v2/users?page=1&size=10 | Get a list of users |
| GET | /api/v2/users/:id | Get user by id
| DELETE | /api/v2/users/:id | Delete user by id
| PATCH | /api/v2/users/:id | Update user by id
| POST | /api/v2/users | Create a new user

#### Products API

| HTTP Method | Endpoint | Description
| ---- | ---- | ---- 
| GET | /api/products?page=1&size=10 | Get a list of products |
| GET | /api/products/:id | Get product by id
| DELETE | /api/products/:id | Delete product by id
| PATCH | /api/products/:id | Update product by id
| POST | /api/products | Create a new product

### Orders API

| HTTP Method | Endpoint | Description
| ---- | ---- | ---- 
| GET | /api/orders?page=1&size=10 | Get a list of orders |
| GET | /api/orders/:id | Get order by id
| PATCH | /api/orders/:id | Update order by id
| POST | /api/orders | Create a new order