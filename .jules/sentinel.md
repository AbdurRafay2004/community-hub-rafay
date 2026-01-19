## 2025-02-12 - Missing Input Validation in Form
**Vulnerability:** The "Create Notice" form relied on manual state management without any validation, allowing empty or malformed data to be "submitted" (navigated away).
**Learning:** Frontend prototypes often skip validation for speed, but this creates a habit of insecure data handling. Even without a backend, validating input prevents client-side state corruption and prepares the app for API integration.
**Prevention:** Always use a schema validation library like Zod with React Hook Form from the start. It enforces constraints declaratively and securely.
