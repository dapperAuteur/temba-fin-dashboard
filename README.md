# TEMBA: The Financial Management Dashboard

A financial literacy and planning application designed to give users a clear snapshot of their financial health and empower them to make smarter decisions about their money.
TEMBA => The Elementary MBA.

![[PLACEHOLDER FOR PROJECT BANNER OR GIF]](https://via.placeholder.com/1280x400.png?text=Your+App+In+Action)

<div align="center">

[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)](https://[YOUR-VERCEL-DEPLOYMENT-LINK].vercel.app)
[![Project License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)
[![Repo Stars](https://img.shields.io/github/stars/dapperAuteur/temba-fin-dashboard?style=for-the-badge)](https://github.com/dapperAuteur/temba-fin-dashboard/stargazers)

</div>

---

## 🎯 The Problem

For many people, managing personal finances feels overwhelming. It's difficult to get a clear picture of your financial standing, and even harder to make strategic decisions, like figuring out the best time to pay a credit card bill to minimize interest charges. This lack of clarity can lead to stress and missed opportunities to save money.

## ✨ The Solution

**TEMBA** is a financial literacy dashboard that demystifies personal finance. It provides users with a centralized view of their accounts and includes a powerful calculator to determine the optimal payment dates for loans and credit cards. By turning complex financial data into actionable insights, TEMBA helps users build financial confidence and save money.

---

## 🚀 Live Demo

See the application live!

**🔗 Live App:** **[https://dashboard.elementarymba.com/](https://dashboard.elementarymba.com/)**

[![Project Demo Video](https://img.shields.io/badge/Watch-Demo_Video-red?style=for-the-badge&logo=youtube)]([LINK-TO-YOUR-YOUTUBE-DEMO-VIDEO])

---

## 🛠️ Tech Stack

This project is built with a modern, full-stack toolkit, chosen for performance and developer experience.

| Tech          | Description                               |
|---------------|-------------------------------------------|
| **Next.js** | Full-stack React framework for web apps.  |
| **React** | UI library for building components.       |
| **Chart.js** | For creating interactive data visualizations. |
| **Plaid API** | To securely connect with real bank accounts. |
| **Gemini API**| For generating AI-powered financial insights. |
| **NextAuth.js**| For simple and secure user authentication. |
| **Vercel** | For seamless deployment and hosting.      |

---

## 🔥 Key Features

- **📊 Financial Snapshot:** A clear and concise dashboard of your overall financial picture.
- **💡 Optimal Payment Calculator:** An algorithm that calculates the best date to make credit card and loan payments to minimize interest paid.
- **💰 Optimal Payment Total Savings To Date:** Shows your total savings from taking advantage of the Optimal Payment Calculator.
- **💸 Projected Savings:** Shows you how much money you'll save by paying more than the minimum amount and paying on the optimum date over a period of time.
- **📈 Interactive Visualizations:** Engaging charts and graphs that make your financial data easy to understand.
- **🤖 AI-Powered Insights:** Personalized financial tips and suggestions powered by the Google Gemini API.
- **🔐 Secure Bank Connection:** Integration with the Plaid API for securely connecting financial accounts.
- **👤 User Authentication:** Save your data securely with our authentication system.

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

You will need `Node.js` (version 18 or later) and `npm` installed on your machine.

### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/dapperAuteur/temba-fin-dashboard.git](https://github.com/dapperAuteur/temba-fin-dashboard.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd temba-fin-dashboard
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Create a `.env.local` file:**
    Create a new file named `.env.local` in the root of your project and add the necessary environment variables.
    ```bash
    # Example
    PLAID_CLIENT_ID=your_plaid_client_id
    GEMINI_API_KEY=your_gemini_api_key
    MONGODB_URI=your_mongodb_uri
    NEXTAUTH_URL=your_nextauth_url
    NEXTAUTH_SECRET=your_nextauth_secret
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📖 API Usage Example

The application features a public API endpoint to calculate an optimal payment date.

**Endpoint:** `/api/calculate-payment-date`
**Method:** `POST`

### **Request Body**

Send a JSON object with the following structure:

```json
{
  "balance": 500.00,
  "apr": 22.5,
  "dueDate": "2025-07-25",
  "statementDate": "2025-07-01"
}
```
Example `curl` Request

```bash
curl -X POST http://localhost:3000/api/calculate-payment-date \
-H "Content-Type: application/json" \
-d '{"balance": 500.00, "apr": 22.5, "dueDate": "2025-07-25", "statementDate": "2025-07-01"}'
```
Success Response (200 OK)
```
{
  "optimalPaymentDate": "2025-07-24",
  "interestSaved": 3.12,
  "explanation": "By paying on this date, you avoid one day of interest accrual before your payment is due."
}
```
## ✍️ Content & Tutorials
I believe in building in public and sharing knowledge. Here are some articles and videos I've created based on this project.

Blog Post: How I Built a Financial Literacy App with Next.js and Chart.js
Video Tutorial: Building a Credit Card Payment Calculator with Next.js in 5 Minutes
Technical Deep Dive: The Algorithm Behind My Financial App for Optimizing Payments

## 🤝 How to Contribute
Contributions, issues, and feature requests are welcome! I'm actively looking to improve this project and learn with the community.

Feel free to check the issues page or start a discussion. If you'd like to contribute, please fork the repository and create a pull request.

For more detailed instructions, please see the CONTRIBUTING.md file.

## 📄 License
This project is distributed under the MIT License. See LICENSE for more information.

## 👤 About Me
My name is Anthony McDonald, a software developer passionate about building tools that educate and empower people. I specialize in full-stack development and love turning complex problems into simple, beautiful applications.

## Links
Portfolio: [https://i.brandanthonymcdonald.com](https://i.brandanthonymcdonald.com/portfolio)

LinkedIn: [l.awews.com/brand-am-linkedin](https://l.awews.com/brand-am-linkedin)
