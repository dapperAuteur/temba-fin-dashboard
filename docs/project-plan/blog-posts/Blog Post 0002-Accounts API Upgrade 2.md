Blog Post: Improving the Accounts API in the Financial Dashboard
Hey fellow developers! Today, I'm going to walk you through some changes we made to the Accounts API in the Financial Dashboard project. These changes make the code cleaner, safer, and easier to use. Let's break it down step by step.

What Changed?
1. Added Authentication and Ownership Checks
We added two helper functions in auth.js:

isAuthenticated: Checks if the user is logged in.
isOwner: Checks if the user owns the account they're trying to access.
These functions are now used in all the CRUD routes (POST, GET, PATCH, DELETE) to ensure only logged-in users can access their own accounts.

2. Refactored the Accounts API Routes
We updated the route.js file to:

Use the new helper functions.
Make sure users can only see, update, or delete their own accounts.
Add better error handling for cases like missing fields, duplicate account names, or unauthorized access.
3. Updated the Account Model
We modified the Account.ts file to include:

A userId field to link accounts to specific users.
A tags field for optional tagging of accounts.
Why These Changes Are Better
1. Safer Code
Before: Anyone could access any account, even if they didn't own it. 😱
After: Only the account owner can access or modify their accounts. 🔒
2. Cleaner Code
Before: Authentication and ownership checks were repeated in every route. 🔄
After: We moved these checks into helper functions (auth.js), so the code is shorter and easier to maintain. 🧹
3. Better Error Handling
Before: Errors were vague and didn't tell users what went wrong. 🤷‍♂️
After: Errors are specific and helpful, like "Unauthorized: User not logged in" or "Forbidden: You don't own this account." 🛑
4. More Features
Before: Accounts couldn't be tagged or linked to users. 🚫
After: Accounts can now have tags and are linked to specific users. 🏷️
Weaknesses of the Original Code
1. No Authentication
Problem: Anyone could access any account, even if they didn't own it. This is a big security risk. 🚨
Fix: Added authentication to ensure only logged-in users can access their accounts. 🔐
2. No Ownership Checks
Problem: Users could modify or delete accounts they didn't own. 😬
Fix: Added ownership checks to ensure users can only modify their own accounts. ✅
3. Repeated Code
Problem: Authentication and ownership checks were repeated in every route, making the code harder to maintain. 🔄
Fix: Moved these checks into helper functions, so the code is cleaner and easier to update. 🧼
4. Limited Features
Problem: Accounts couldn't be tagged or linked to users, limiting functionality. 🚫
Fix: Added userId and tags fields to the Account model, making it more flexible. 🏷️
How to Test the Changes
We also added curl commands to test the API. Here's how you can use them:

Create a New Account:

curl -X POST http://localhost:3000/api/accounts \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_AUTH_TOKEN" \
-d '{
  "formData": {
    "name": "Checking Account",
    "type": "Checking",
    "balance": 1000.00
  }
}'

Copy

Execute

Get All Accounts:

curl -X GET http://localhost:3000/api/accounts \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_AUTH_TOKEN"

Copy

Execute

Get a Specific Account:

curl -X GET http://localhost:3000/api/accounts/:accountId \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_AUTH_TOKEN"

Copy

Execute

Update an Account:

curl -X PATCH http://localhost:3000/api/accounts/:accountId \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_AUTH_TOKEN" \
-d '{
  "formData": {
    "name": "Updated Checking Account",
    "type": "Checking",
    "balance": 1500.00
  }
}'

Copy

Execute

Delete an Account:

curl -X DELETE http://localhost:3000/api/accounts/:accountId \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_AUTH_TOKEN"

Copy

Execute

Conclusion
These changes make the Accounts API safer, cleaner, and more powerful. By adding authentication, ownership checks, and better error handling, we've made the code more secure and easier to use. Plus, the new features like tagging and user linking make the API more flexible.

If you're working on a similar project, I hope these changes inspire you to make your code safer and cleaner too! 🚀

Happy coding! 👩‍💻👨‍💻