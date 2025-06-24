Excellent analysis. You've identified the exact limitations that need to be addressed to transform this calculator from a simple demo into a realistic and genuinely useful financial tool. These are the kinds of product-focused insights that are highly valued.

You're right, let's create a clear, methodical plan to fix these issues.

### **The Plan: Upgrading to a Realistic Financial Model**

We will tackle these bugs and new features in three phases, starting with what the user sees and ending with the core engine.

---

#### **Phase 1: Upgrading the Form & Input Validation**

The goal here is to fix the data integrity issue and add the necessary inputs to the user interface.

* **Step 1.1: Fix the Date Logic.**
    * **Action:** We will update the `zod` schema in `OptimalPaymentCalculator.tsx`. We'll add a `.refine()` check to ensure that the `dueDate` is always after the `statementDate`, providing an immediate, user-friendly error message if the dates are invalid. This solves Bug #4.

* **Step 1.2: Add Minimum Payment Input.**
    * **Action:** We will add a new `FormField` to the UI for "Minimum Payment Due". This will be a standard number input.
    * **Action:** We'll update the `zod` schema to include this new `minimumPayment` field, making it an optional number. This solves the missing input for Bug #3.

---

#### **Phase 2: Re-architecting the Calculation Engine**

This is the most critical phase, where we overhaul the financial math in our `lib/calculators/payment-optimizer.ts` module to be more realistic.

* **Step 2.1: Update the Calculator's Inputs.**
    * **Action:** We will modify the `PaymentOptimizerInput` interface to accept the new `minimumPayment` and `extraPayment` values.

* **Step 2.2: Implement the New Core Logic.**
    * **Action:** We will completely refactor the `calculateInterestForPeriod` function. The new logic will be:
        1.  Calculate the `totalPayment` = `minimumPayment` + `extraPayment`.
        2.  Calculate the `remainingBalance` = `statementBalance` - `totalPayment`.
        3.  Interest will **only** be calculated on this `remainingBalance`.
        4.  If `remainingBalance` is zero or less, the interest for that period is $0.
    * **Action:** This new, more accurate interest calculation will be applied to all three scenarios (Pay on Statement Date, Halfway, Due Date). This will correctly model the effect of partial payments and extra payments, fixing Bugs #1 and #2.

---

#### **Phase 3: Connecting the New UI to the Engine**

This final phase ensures that the new data flows seamlessly from the user, through the API, to the calculator, and back to the results display.

* **Step 3.1: Upgrade the API Endpoint.**
    * **Action:** We will update the `zod` schema and the function call inside our API route (`app/api/calculate-payment-date/route.ts`) to handle the new `minimumPayment` and `extraPayment` fields.

* **Step 3.2: Update the Frontend `onSubmit` Function.**
    * **Action:** We will modify the `onSubmit` function in `OptimalPaymentCalculator.tsx` to ensure it passes the new `minimumPayment` value, along with the existing `extraPayment` from the slider, in the request body to the API.

This structured plan addresses every issue you raised in a logical order, minimizing the risk of new bugs. We will build a much more robust and impressive feature.

Let's begin with **Phase 1, Step 1.1: Fixing the Date Logic**. Ready to start?