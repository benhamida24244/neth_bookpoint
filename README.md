# Neth BookPoint

Neth BookPoint is a modern, responsive, and feature-rich e-commerce platform for selling books. Built with Vue.js, Pinia, and Tailwind CSS, this project provides a solid foundation for a real-world online bookstore. It includes a customer-facing storefront and a comprehensive dashboard for managing products, orders, and customers.

## Project Purpose

The main goal of this project is to offer a clean, well-structured, and easily customizable template for developers to launch their own e-commerce websites. It's designed to be production-ready after connecting it to a backend API.

## System Requirements

To run this project, you will need the following:

- **Node.js**: Version 18.x or higher
- **NPM**: Version 9.x or higher (or any other package manager like Yarn or pnpm)

## Installation and Setup

Follow these steps to get the project up and running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/neth-bookpoint.git
    cd neth-bookpoint
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Connecting to a Real API

This project is designed to be backend-agnostic. To connect it to your own API, you will need to modify the Pinia stores located in the `src/stores` directory.

Each store contains `fetch` actions (e.g., `fetchBooks`, `fetchAuthors`) with `TODO` comments indicating where to add your API calls.

**Example: Connecting the Books Store**

1.  Open `src/stores/Books.js`.
2.  Locate the `fetchBooks` action.
3.  Replace the `TODO` section with your API call:

    ```javascript
    async fetchBooks() {
      this.isLoading = true;
      try {
        const response = await fetch('https://api.yourdomain.com/books');
        const data = await response.json();
        this.books = data;
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        this.isLoading = false;
      }
    }
    ```

## Project Structure

### Components

The project's components are organized by feature in the `src/components` directory. Here are some of the most important ones:

-   **`@/components/Book/`**: Components related to displaying books, such as `bookItem` and `bookList`.
-   **`@/components/Author/`**: Components for displaying author information.
-   **`@/components/Dashboard/`**: A collection of components that make up the admin dashboard, including charts, tables, and modals.
-   **`@/components/Layout/`**: The main layout components, such as `DashboardLayout` and `DefaultLayout`.

### Stores

Pinia is used for state management. The stores are located in `src/stores` and are separated by domain.

-   **`Books.js`**: Manages the state for books.
-   **`Authors.js`**: Manages the state for authors.
-   **`Categories.js`**: Manages the state for book categories.
-   **`Cart.js`**: Manages the shopping cart.
-   **`Users.js`**: Manages user authentication and data.
-   **`Dashboard.js`**: Manages the data for the admin dashboard.

## Developer Tips

-   **Styling**: The project uses Tailwind CSS for styling. You can customize the theme by editing the `tailwind.config.js` file.
-   **Internationalization (i18n)**: The application supports multiple languages using `vue-i18n`. You can add new languages by creating a new JSON file in the `src/locales` directory.
-   **Linting and Formatting**: The project is configured with ESLint and Prettier to ensure code quality and consistency. You can run the linter with `npm run lint`.
-   **Production Build**: To create a production-ready build, run `npm run build`. The optimized files will be generated in the `dist` directory.
-   **Component-Based Architecture**: The project follows a component-based architecture, making it easy to reuse and maintain the code. When adding new features, try to break them down into smaller, reusable components.

---

This README provides a comprehensive guide to get you started with the Neth BookPoint project. Happy coding!
