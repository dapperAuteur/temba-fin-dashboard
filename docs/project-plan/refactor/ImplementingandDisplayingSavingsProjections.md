### **The Plan: Implementing and Displaying Savings Projections**

We will focus on two phases: first, enhancing our calculation engine to produce this new comparative data, and second, building the UI components to display it clearly to the user.

---

#### **Phase 1: Enhance the Calculation Engine (`payment-optimizer.ts`)**

The goal here is to make our backend calculator even smarter, so it provides all the data the new UI will need.

* **Step 1.1: Update the Data Structures.**
    * **Action:** We will update the `PaymentOptimizerResult` interface in `lib/calculators/payment-optimizer.ts`. We will replace the single `projections` array with two new ones: `projectionsWithExtra` and `projectionsMinOnly`. This will make our data structure explicit and easy to work with on the frontend.

* **Step 1.2: Implement the Comparative Projection Logic.**
    * **Action:** We will modify the `calculatePaymentScenarios` function. It already calculates the monthly savings based on the user's total payment (minimum + extra). We will use this to generate the `projectionsWithExtra`.
    * **Action:** We will then perform a *second* calculation within the same function. We'll determine what the savings would have been if the `extraPayment` was zero. This will give us the data for `projectionsMinOnly`.

**Goal of Phase 1:** The `payment-optimizer.ts` module will output a complete data object containing separate, long-term savings projections for both payment scenarios (minimum vs. minimum + extra).

---

#### **Phase 2: Overhaul the User Interface (`OptimalPaymentCalculator.tsx`)**

Now we will build the frontend components to display this rich new data.

* **Step 2.1: Create a Savings Projections Table.**
    * **Action:** We will add a new `Table` component to the results section of the UI. This table will be dedicated to showing the long-term projections.
    * **Action:** The table will have columns like "Timeframe", "Savings (Minimum Pmt)", and "Savings (With Extra Pmt)". This directly addresses the bug where this information was missing.

* **Step 2.2: Clarify the Scenario Comparison Graph.**
    * **Action:** Your current line graph already does a great job of showing the *immediate* impact of the extra payment with the dashed orange line ("Pay Halfway (Min Only)"). To make this even clearer, we will adjust the graph's title and legend to explicitly state that it's comparing the accrued interest for the *current month*. This avoids confusion between the monthly graph and the long-term projection table.

**Goal of Phase 2:** The user will see a clear, comprehensive breakdown of their potential savings, both in the immediate billing cycle (via the graph) and over the long term (via the new table).

This plan systematically addresses the issues you found and will make the calculator significantly more powerful and persuasive.

Let's start with **Phase 1: Enhancing the Calculation Engine**. Are you ready to proceed?