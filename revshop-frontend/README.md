<<<<<<< HEAD
# RevshopFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
=======
# 🚀 RevShop – Full-Stack Enterprise E-Commerce Ecosystem

**RevShop** is a high-performance, dual-portal e-commerce platform built with a **Decoupled 3-Tier Architecture**. It features a reactive **Angular 18** frontend and a robust **Spring Boot 3** REST API, providing a seamless marketplace experience for both **Buyers** and **Sellers**.

By moving away from a monolithic console structure, this version leverages **Stateless Authentication (JWT)** and **Reactive State Management (Signals)** to ensure enterprise-grade scalability and security.

---

## 🛠️ Modern Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | **Angular 18 (Signals)**, TypeScript, SCSS, Angular Material, RxJS |
| **Backend** | **Spring Boot 3**, Spring Security, Spring Data JPA |
| **Database** | **MySQL** (ACID Compliant) |
| **Security** | **JWT (JSON Web Tokens)**, BCrypt Password Hashing, Role-Based Access Control (RBAC) |
| **Build Tools** | Maven, NPM |

---

## 🏗️ Architectural Excellence

RevShop follows a **Separation of Concerns (SoC)** model, allowing the frontend and backend to scale independently.

### **1. Presentation Layer (Angular 18)**

* **Standalone Components**: Modular and lightweight UI structure.
* **Signals**: Modern reactive state management for high-performance UI updates.
* **HTTP Interceptors**: Centralized JWT injection and global error handling.
* **Router Guards**: Securing dashboards based on user roles (`BUYER` vs `SELLER`).

### **2. Business Logic Layer (Spring Boot 3)**

* **RESTful API**: Stateless endpoints for multi-client support.
* **Global Exception Handling**: Centralized `@RestControllerAdvice` for consistent API error responses.
* **DTO Pattern**: Decoupling database entities from the API response for enhanced security.

### **3. Persistence Layer (PostgreSQL & JPA)**

* **Hibernate ORM**: Simplified database interactions and automated schema management.
* **Normalised ERD**: Optimized for **3rd Normal Form (3NF)** to ensure data integrity.

---

## 📌 Key Feature Enhancements

### 🛍️ Buyer Portal

* **Reactive Search**: Instant product filtering using RxJS `debounceTime`.
* **Stateless Checkout**: Secure order placement via JWT-authorized sessions.
* **Order History**: Real-time tracking of transaction status and order items.

### 🏪 Seller Dashboard

* **Inventory Intelligence**: Automated low-stock alerts and threshold management.
* **Business Analytics**: High-level overview of revenue and order volume.
* **Product Management**: Full CRUD operations with image URL support and category mapping.

### Features

Buyer Features 

| **Feature** | **API Endpoint** | Desc |
| --- | --- | --- |
| **Authentication** | `POST /api/auth/login` & `register` | Handles register, Login and generates stateless **JWT tokens** for session management. |
| **Product Discovery** | `GET /api/products` & `products/{id}` | Retrieves the  specific item details for the Buyer portal. |
| **Search & Filter** | `GET /api/products/search` & `/category/{c}` | Provides full product catalog . |
| **Shopping Cart** | `GET`, `POST`, `PUT`, `DELETE /api/cart` | Manages persistent user carts, allowing for item addition, quantity updates, and removal. |
| **Favorites** | `GET`, `POST`, `DELETE /api/favorites` | Enables buyers to manage a personalized wishlist of products stored in **PostgreSQL**. |
| **Checkout** | `POST /api/orders/checkout` | Processes the cart order, generate record, update inventory |
| **Order History** | `GET /api/orders` | Fetches a historical list of all completed and pending transactions for the authenticated user. |
| **Notifications** | `GET` & `PUT /api/notifications` | Manages user alerts, such as order confirmations for Buyers or low-stock warnings for Sellers. |
| **Reviews** | `POST /api/reviews` & `GET /api/reviews/{id}` | Facilitates social proof by allowing buyers to submit and view product ratings and comments. |
|  |  |  |

Seller Features 

| **Requirement** | **Implementation Detail** |
| --- | --- |
| **View Buyer Info** | Displayed in the `customer` column (`o.buyerName`). |
| **Order Details** | Shown via `productName`, `quantity`, and `totalAmount`. |
| **Notifications** | Can be handled via `MatSnackBar` or a badge in the sidebar. |
| **Low Stock Alerts** | Managed in the `SellerDashboard` via threshold signals. |

Testing

| **Test Level** | **Scope** | **Status** |
| --- | --- | --- |
| **Unit Testing** | Service logic for price calculation and threshold checks. | ✅ Passed |
| **Integration Testing** | API connectivity between Angular and Spring Boot NotificationController. | ✅ Passed |
| **UAT (Buyer)** | Successful flow from "Add to Cart" to "Order Confirmation." | ✅ Passed |
| **UAT (Seller)** | Verification of "Low Stock Alert" when quantity falls below threshold. | ✅ Passed |
| **Security Testing** | Verified `roleGuard` prevents Buyers from accessing Seller Dashboard. | ✅ Passed |


## 🔄 Core Workflow: Order & Inventory

1. **Transaction Trigger**: Buyer submits a checkout request via the Angular UI.
2. **Security Check**: Spring Security validates the **JWT** and checks for the `BUYER` role.
3. **Atomic Operation**: The Service layer uses a `@Transactional` block to create an order and decrement inventory simultaneously.
4. **Notification**: If stock falls below the `stock_threshold`, the `NotificationService` triggers a real-time alert for the Seller.

---

<img width="622" height="1004" alt="ERD" src="https://github.com/user-attachments/assets/5182ea4d-5006-4c00-a91a-b520f691218e" />




## 🚦 How to Run the Ecosystem

### **Backend Setup**

1. Update `application.properties` with your **PostgreSQL** credentials.
2. Run `mvn spring-boot:run`.

### **Frontend Setup**

1. Navigate to the frontend directory.
2. Install dependencies: `npm install`.
3. Start the dev server: `ng serve`.

---

## 👨‍💻 Author

**Abhishek Satish Lawhale** *Java Full Stack Developer* Specializing in **Spring Boot**, **Angular 18**, and **Enterprise System Design**.
>>>>>>> 4fd59128a8cd37daba4d0a62ebbbed14a2297acc
