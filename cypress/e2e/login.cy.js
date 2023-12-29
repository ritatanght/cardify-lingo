describe("Login", () => {
  it("should prompt errors when email and password are both blank", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("button").contains("Submit").click();
    cy.get(".Toastify__toast-body").contains("Fields cannot be empty");
  });

  it("should prompt errors to users for incorrect email", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input[type=email]").type("john.doe@example.com");
    cy.get("input[type=password]").type("123456{enter}");

    cy.get(".Toastify__toast-body").contains("Login details are incorrect");
  });

  it("should prompt errors to users for incorrect password", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input[type=email]").type("john@example.com");
    cy.get("input[type=password]").type("johnssecurepassword{enter}");

    cy.get(".Toastify__toast-body").contains("Login details are incorrect");
  });

  it("should redirect to profile page after successful login with email and password", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input[type=email]").type("john.doe@example.com");
    cy.get("input[type=password]").type("johnssecurepassword{enter}");
    cy.get(".Toastify__toast-body").contains("Login successful");
    cy.url().should("include", "/profile");

    // The new page should contain an h1 with the user's "username"
    cy.get("h1").contains("john_doe");
  });

});
