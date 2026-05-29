---
applyTo: '**'
---

# Specifications for Handling Component Creation

## 1. Exporting Components
- **All components must use named exports**. Default exports are not allowed.

## 2. Function-Based Components
- **Components should always be defined as regular functions** (i.e., `function ComponentName() {}`), not as `const` or arrow functions.

## 3. Prop Typing
- **All component props must be properly typed**:
  - Use **TypeScript interfaces** or **types** for defining props.
  - The choice of `interface` or `type` should depend on the nature of the request or specific instructions provided by the user.
  - Ensure type safety and correctness.

## 4. Composition Components
- For **larger components** like Cards, Modals, etc.:
  - Treat them as **composition components**, meaning all related subcomponents should be bundled together.
  - Export all subcomponents as part of a single object in the same file. For example:
    ```typescript
    export { Card, CardHeader, CardBody, CardFooter };
    ```

## 5. Base Props Inheritance
- **All components must inherit base props** in addition to their own defined props.

## 6. Handling Variants
- When creating variants for components:
  - Use the library **`tailwind-variants`**.
  - Before making any changes, **agents must read the `tailwind-variants` documentation** using the Context7 platform to ensure proper usage.
  - Implement variants using `tailwind-variants` to maintain consistency and flexibility.

These guidelines are mandatory to ensure consistency and adherence to the project's established best practices.