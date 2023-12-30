describe("Register", () => {
  it("should prompt error when password and confirm password fields do not match", () => {
    cy.visit("http://localhost:3000/register");

    cy.get('input[aria-label="email"]').type("user@example.com");
    cy.get('input[aria-label="username"]').type("user");
    cy.get('input[aria-label="Password"]').type("123456");
    cy.get('input[aria-label="Confirm Password"]').type("543210");
    cy.get("button").contains("Submit").click();

    cy.get(".Toastify__toast-body").contains("fields do not match");
  });

  it("should prompt error when password has length less than 6", () => {
    cy.visit("http://localhost:3000/register");

    cy.get('input[aria-label="email"]').type("user@example.com");
    cy.get('input[aria-label="username"]').type("user");
    cy.get('input[aria-label="Password"]').type("12345");
    cy.get('input[aria-label="Confirm Password"]').type("12345");
    cy.get("button").contains("Submit").click();

    cy.get(".Toastify__toast-body").contains(
      "Password must be at least 6 in length"
    );
  });
});
