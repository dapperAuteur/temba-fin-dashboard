# Detailed Plan: Financial Dashboard Snapshot App (Plan 1)

### **Phase 1: Authentication**

**Tasks:**
1. Set up Next.js project and install dependencies.
2. Configure MongoDB connection.
3. Implement authentication with NextAuth.js.
4. Create User schema and secure API routes.

**Steps:**
1. Initialize Next.js project:
   ```bash
   npx create-next-app@latest financial-dashboard --typescript
   cd financial-dashboard
   npm install
   ```
2. Install necessary dependencies:
   ```bash
   npm install next-auth @types/next-auth mongodb @types/mongodb dotenv
   ```
3. Set up MongoDB:
   - Create a MongoDB database and collection for users.
   - Add a `.env` file with:
     ```env
     MONGODB_URI=<your_mongodb_uri>
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=<generate_a_secret>
     ```
4. Configure `lib/mongodb.ts`:
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
5. Set up NextAuth in `pages/api/auth/[...nextauth].ts`:
   ```typescript
   import NextAuth from 'next-auth';
   import CredentialsProvider from 'next-auth/providers/credentials';
   import clientPromise from '../../../lib/mongodb';

   export default NextAuth({
     providers: [
       CredentialsProvider({
         name: 'Credentials',
         credentials: {
           email: { label: 'Email', type: 'text' },
           password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials) {
           const client = await clientPromise;
           const db = client.db();
           const user = await db.collection('users').findOne({ email: credentials?.email });
           if (user && user.password === credentials?.password) {
             return { id: user._id.toString(), email: user.email };
           }
           return null;
         },
       }),
     ],
     secret: process.env.NEXTAUTH_SECRET,
     callbacks: {
       async session({ session, token }) {
         if (token) {
           session.user._id = token.sub;
         }
         return session;
       },
     },
   });
   ```
6. Protect pages:
   ```typescript
   import { getSession } from 'next-auth/react';

   export async function getServerSideProps(context: any) {
     const session = await getSession(context);
     if (!session) {
       return { redirect: { destination: '/api/auth/signin', permanent: false } };
     }
     return { props: { session } };
   }
   ```
7. Test authentication.

---

### **Phase 2: Account Management**

**Tasks:**
1. Define Account schema.
2. Create API routes for CRUD operations.
3. Build UI for adding and viewing accounts.

**Steps:**
1. Define schema in `models/Account.ts`:
   ```typescript
   import { Schema, model, models, Types } from 'mongoose';

   const AccountSchema = new Schema({
     name: { type: String, required: true },
     type: { type: String, required: true },
     balance: { type: Number, required: true },
     userId: { type: Types.ObjectId, required: true },
   });

   export default models.Account || model('Account', AccountSchema);
   ```
2. Create API routes in `pages/api/accounts/`:
   - Add account:
     ```typescript
     import type { NextApiRequest, NextApiResponse } from 'next';
     import dbConnect from '../../../lib/mongodb';
     import Account from '../../../models/Account';

     export default async (req: NextApiRequest, res: NextApiResponse) => {
       if (req.method === 'POST') {
         await dbConnect();
         const account = await Account.create(req.body);
         res.status(201).json(account);
       } else {
         res.status(405).end();
       }
     };
     ```
   - Fetch accounts:
     ```typescript
     import type { NextApiRequest, NextApiResponse } from 'next';
     import dbConnect from '../../../lib/mongodb';
     import Account from '../../../models/Account';

     export default async (req: NextApiRequest, res: NextApiResponse) => {
       if (req.method === 'GET') {
         await dbConnect();
         const accounts = await Account.find({ userId: req.query.userId });
         res.status(200).json(accounts);
       } else {
         res.status(405).end();
       }
     };
     ```
3. Create UI for adding/viewing accounts:
   - Add a form for account creation.
   - Display accounts in a table on the landing page.

---

### **Phase 3: Transaction Management**

**Tasks:**
1. Define Transaction schema.
2. Implement API routes.
3. Link transactions to accounts and update balances.
4. Build UI for adding/viewing transactions.

**Steps:**
1. Define schema in `models/Transaction.ts`:
   ```typescript
   import { Schema, model, models, Types } from 'mongoose';

   const TransactionSchema = new Schema({
     accountId: { type: Types.ObjectId, required: true },
     value: { type: Number, required: true },
     type: { type: String, required: true },
     date: { type: Date, required: true },
     vendor: { type: String },
     tags: { type: [String] },
   });

   export default models.Transaction || model('Transaction', TransactionSchema);
   ```
2. Create API routes in `pages/api/transactions/`:
   - Add transaction and update account balance.
   - Fetch transactions for an account.
3. Update account balance logic in `add transaction` API.
4. Build UI for transaction management.

---

### **Phase 4: Credit Card Optimization**

**Tasks:**
1. Implement interest calculation logic.
2. Provide optimal payment suggestions.
3. Integrate with the account page.

**Steps:**
1. Add interest calculation logic based on daily balance.
2. Build a component showing estimated payoff dates and optimal payment suggestions.

---

### **Phase 5: Vendor Insights**

**Tasks:**
1. Track spending per vendor.
2. Display vendor details.

**Steps:**
1. Add vendor analytics to the transaction schema and API routes.
2. Create a dedicated vendor page.

---

### **Phase 6: Reminders and Projections**

**Tasks:**
1. Set up notifications for upcoming payments.
2. Add projection logic for savings and investments.

**Steps:**
1. Use `node-cron` or similar library for reminders.
2. Add logic to calculate future balances and display projections.

