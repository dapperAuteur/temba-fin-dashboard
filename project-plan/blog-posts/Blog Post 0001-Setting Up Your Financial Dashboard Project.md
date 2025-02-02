# Blog Post 1: Setting Up Your Financial Dashboard Project

Welcome to the first step in building your very own **Financial Dashboard Tool**! This project will help users understand their finances, avoid mistakes, and take charge of their financial future. We'll start by setting up the foundation: creating the project, installing essential tools, and connecting to a database. Let's dive in!

---

## **What You’ll Learn in This Post**

By the end of this post, you will:
1. Create a **Next.js** app with TypeScript.
2. Set up a connection to **MongoDB** for storing data.
3. Test your connection using cURL commands.
4. Understand why these technologies were chosen.

---

## **Step 1: Setting Up the Project**

Let’s begin by creating the Next.js project.

### **Why Next.js and TypeScript?**
- **Strengths**:
  - Next.js makes it easy to build fast, server-rendered React apps.
  - TypeScript ensures your code is type-safe, reducing bugs.
- **Weaknesses**:
  - Learning TypeScript can feel overwhelming at first, but the benefits far outweigh the initial challenge.

### **Create the Project**

Run the following commands to set up your project:

```bash
npx create-next-app@latest financial-dashboard --typescript
cd financial-dashboard
npm install
```

This creates a new Next.js project with TypeScript support. You’ll see a folder called `financial-dashboard`. Open it in your favorite code editor.

---

## **Step 2: Connecting to MongoDB**

Now we’ll connect our app to MongoDB, where all your financial data will be stored.

### **Why MongoDB?**
- **Strengths**:
  - Flexible, document-based database.
  - Perfect for handling financial data like transactions and accounts.
- **Weaknesses**:
  - Requires some setup for local development or cloud hosting (we’ll walk you through it!).

### **Install MongoDB Library**

Run the following command to install the MongoDB library:

```bash
npm install mongodb dotenv
```

### **Create a MongoDB Database**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2. Set up a cluster and create a database called `financial_dashboard`.
3. Copy your connection string (it will look something like this):
   
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/financial_dashboard
   ```

### **Add Environment Variables**

Create a `.env.local` file in the root of your project and add:

```plaintext
MONGODB_URI=<your-connection-string>
```

Replace `<your-connection-string>` with the connection string you copied earlier.

### **Set Up Database Connection**

Create a new file `lib/mongodb.ts`:

```typescript
import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
```

This file establishes a connection to MongoDB that we can use throughout the app.

---

## **Step 3: Create a Test API Route**

Let’s create an API route to test our MongoDB connection.

### **Create the Route**

In the `pages/api` folder, create a new file `test-db.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const collections = await db.listCollections().toArray();

    res.status(200).json({ message: "Connected to MongoDB", collections });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ message: "Failed to connect to MongoDB" });
  }
}
```

---

## **Step 4: Test Your Connection**

Now, let’s make sure everything is working.

### **Start the Development Server**

Run:

```bash
npm run dev
```

Your app should be running at `http://localhost:3000`.

### **Use cURL to Test the API**

Run this command in your terminal:

```bash
curl http://localhost:3000/api/test-db
```

#### **Expected Output on Success**:

```json
{
  "message": "Connected to MongoDB",
  "collections": []
}
```

If you see this message, congratulations! You’ve connected your app to MongoDB.

#### **What If It Fails?**
- Double-check your `.env.local` file.
- Ensure MongoDB is running and accessible.
- Look at the logs in your terminal for errors.

---

## **Step 5: Add Tests**

Let’s add a simple test to ensure the MongoDB connection works.

### **Install Jest**

Run:

```bash
npm install jest @types/jest ts-jest --save-dev
```

### **Set Up Jest Config**

Add a `jest.config.js` file:

```javascript
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
};
```

### **Write a Test**

Create a file `__tests__/mongodb.test.ts`:

```typescript
import clientPromise from '@/lib/mongodb';

test('Connects to MongoDB', async () => {
  const client = await clientPromise;
  expect(client).toBeDefined();
});
```

### **Run the Test**

Run:

```bash
npm test
```

You should see:

```plaintext
PASS  __tests__/mongodb.test.ts
✔ Connects to MongoDB
```

---

## **Recap and Next Steps**

### **What You Did**:
1. Set up a Next.js project with TypeScript.
2. Connected to MongoDB using `lib/mongodb.ts`.
3. Created a test API route and verified it with cURL.
4. Wrote a test to ensure the database connection works.

### **What’s Next?**
In the next post, we’ll add user authentication so users can log in and start managing their finances. Stay tuned!

---

Thank you for building with us! Share your progress and present your code to hiring managers with confidence. You’re building something amazing.

