# Coding Style Guide

This guide outlines the coding conventions and best practices for the TEMBA project. Following these standards ensures our codebase is clean, consistent, and easy to maintain.

Our philosophy is to **automate as much as possible**. This guide is enforced by ESLint and Prettier.

## Core Tooling

1.  **Prettier**: An opinionated code formatter that enforces a consistent style. All code will be automatically formatted on save and before commits.
2.  **ESLint**: A static analysis tool that finds and fixes problems in JavaScript/TypeScript code. It helps prevent bugs and ensures best practices.
3.  **Tailwind CSS Plugin**: The official Prettier plugin for Tailwind CSS automatically sorts class names according to the recommended order.

## General Conventions

- **Language**: All code, comments, and documentation must be in English.
- **File Naming**: Use `kebab-case` for all files except for React components.
- **Component Naming**: React component files and the components themselves must use `PascalCase` (e.g., `FinancialSummaryCard.tsx`).

## TypeScript

- **Use Strict Mode**: TypeScript's `strict` mode should always be enabled in `tsconfig.json`.
- **Type Everything**: Avoid the `any` type whenever possible. Define clear interfaces or types for props, API responses, and state.
- **Interfaces over Types**: For defining the shape of objects (like component props or API data), prefer `interface` over `type`.

```typescript
// Good
interface UserProfileProps {
  userId: string;
  userName: string;
}

// Avoid
type UserProfileProps = {
  userId: string;
euserName: string;
}
```

## React & Next.js
- Functional Components:
All components must be functional components using React Hooks.

- Component Structure:
Keep your components organized in the following order:
  1. Type/Interface definitions
  2. Component function
  3. useState, useReducer hooks
  4. Other hooks (useEffect, useCallback, etc.)
  5. Helper functions
  6. eturn statement (JSX)
- File Structure: Group related components, hooks, and utilities into feature-based folders within the /app or /components directory.

## Tailwind CSS
- Use theme Values: Always try to use values defined in your tailwind.config.js theme before using arbitrary values.
- Conditional Classes: Use a utility like clsx or tailwind-merge to conditionally apply classes. This makes the code cleaner and prevents style conflicts.
- Don't Overuse @apply: Reserve the @apply directive for small, genuinely reusable component-like classes (e.g., .btn-primary). Avoid using it for general layout.

```
// Good - clean and readable
import clsx from 'clsx';

function StatusPill({ isSuccess }) {
  const pillClasses = clsx(
    'rounded-full',
    'px-2',
    'py-1',
    {
      'bg-green-100 text-green-800': isSuccess,
      'bg-red-100 text-red-800': !isSuccess,
    }
  );

  return <div className={pillClasses}>Status</div>;
}
```

## Accessibility (A11y)
- Semantic HTML: Use HTML5 elements according to their intended purpose (<nav>, <main>, <button>).
- ARIA Roles: Use ARIA attributes when semantic HTML is not sufficient, but always prefer semantic HTML first.
- Labels: All form inputs (<input>, <textarea>, <select>) must have a corresponding <label>.

```
***

### **How to Set Up ESLint and Prettier**

You are correct that Vercel can run your `lint` script, but it only works if the rules are configured in your project first. Let's set it up properly.

Open your terminal in the project's root directory and follow these steps.

**Step 1: Install Dependencies**
This command installs ESLint, Prettier, and all the necessary configuration packages and plugins for TypeScript and Tailwind CSS.

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-tailwindcss eslint-config-next
```

## Step 2: Create ESLint Configuration File
Create a new file named .eslintrc.json in the root of your project and add this content. This sets up the recommended rules for Next.js, Prettier, and TypeScript.

```JSON
{
  "extends": [
    "next/core-web-vitals",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

## Step 3: Create Prettier Configuration File
Create a new file named prettier.config.js in the root of your project. This tells Prettier to use the Tailwind CSS plugin to automatically sort your classes.

```JavaScript

module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
};
```
## Step 4: Update Your package.json
Add the following scripts to your package.json file. This allows you to run the tools from the command line.

```JSON

"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "format": "prettier --write ."
},
```
Now you can run `npm run format` to format your entire project and `npm run lint:fix` to automatically fix any linting issues. I also highly recommend installing the Prettier and ESLint extensions for VS Code to get real-time feedback and format-on-save.