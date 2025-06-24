### **The Plan: Upgrading the Optimal Payment Calculator**

We will tackle this in three distinct phases, moving from the backend logic to the frontend user experience.

#### **Phase 1: Architecting the New Calculation Engine (Backend Logic)**

The goal of this phase is to create a robust, testable module that handles all the complex financial math, completely separate from our API and UI.

* **Step 1.1: Create a Dedicated Calculator Module.** We will create a new file at `lib/calculators/payment-optimizer.ts`. This file will contain all the new logic, keeping our API route clean and simple.
* **Step 1.2: Define New Data Structures.** In the new module, we'll define TypeScript `interfaces` for the calculation results. The new structure will need to hold data for multiple scenarios (e.g., `PaymentScenario[]`) and long-term projections (e.g., `SavingsProjection[]`).
* **Step 1.3: Implement the Multi-Scenario Logic.** We will write the core function that calculates the interest paid for each of the three scenarios you requested:
    1.  Paying on the **Statement Date**.
    2.  Paying **Halfway** between the statement and due dates.
    3.  Paying on the **Due Date** (this is our baseline for comparison).
* **Step 1.4: Implement the Long-Term Projection Logic.** We'll create another function that takes the single-month savings from the best-case scenario and projects them over 1, 3, 6, and 12 months.

**Goal of Phase 1:** We will have a powerful, self-contained TypeScript module that can accurately calculate complex payment scenarios and projections.

---

#### **Phase 2: Upgrading the API Endpoint**

Now, we'll connect our new calculation engine to the outside world through our existing API.

* **Step 2.1: Refactor the API Route.** We will modify the `app/api/calculate-payment-date/route.ts` file. It will no longer contain any calculation logic itself. Instead, it will import and call the functions from our new `payment-optimizer.ts` module.
* **Step 2.2: Expand the API Response.** The API will now return the richer data structure we defined in Step 1.2, sending the full breakdown of scenarios and projections to the frontend.

**Goal of Phase 2:** Our API will be able to serve the complex, multi-scenario data needed to power the new user interface.

---

#### **Phase 3: Overhauling the User Interface (Frontend Experience)**

This is where we bring the new functionality to life for the user.

* **Step 3.1: Add Interactive Controls.** We will add a `Slider` component from Shadcn/UI to the form. This will allow users to adjust a variable, like "Extra Payment Amount," to see how it affects their savings in real-time.
* **Step 3.2: Display Detailed Scenarios.** We'll enhance the results section in `OptimalPaymentCalculator.tsx`. Instead of a single result, we will use a Shadcn/UI `Table` to neatly display the outcomes for each payment scenario (Pay on Statement Date, Halfway, etc.).
* **Step 3.3: Create the Savings Projection Chart.** We will replace the current bar chart with a `Line` chart from Chart.js. This new chart will visually represent the "Projected Savings" over 1, 3, 6, and 12 months, providing a compelling visual incentive for the user.
* **Step 3.4: Update Component State.** We will update the React state management within the component to handle the new interactive slider value and the more complex data structure returned by our upgraded API.

**Goal of Phase 3:** The user will have a fully interactive, visually engaging tool that clearly communicates the benefits of optimizing their payments over the short and long term.

---

This structured plan will allow us to build this complex feature methodically, test each part as we go, and ensure a high-quality result.

**Let's start with Phase 1, Step 1.1 & 1.2.** Are you ready to create the new calculator module and define its data structures?