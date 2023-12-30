describe("Register", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/register");

    cy.get('input[aria-label="email"]').type("user@example.com");
    cy.get('input[aria-label="username"]').type("user");
  });

  // before(()=>{
  //   cy.exec("npm run db:reset");
  // })

  it("should prompt error when password and confirm password fields do not match", () => {
    cy.get('input[aria-label="Password"]').type("123456");
    cy.get('input[aria-label="Confirm Password"]').type("543210");
    cy.get("button").contains("Submit").click();

    cy.get(".Toastify__toast-body").contains("fields do not match");
  });

  it("should prompt error when password has length less than 6", () => {
    cy.get('input[aria-label="Password"]').type("12345");
    cy.get('input[aria-label="Confirm Password"]').type("12345");
    cy.get("button").contains("Submit").click();

    cy.get(".Toastify__toast-body").contains(
      "Password must be at least 6 in length"
    );
  });

  it("should redirect to profile page upon successful registration", () => {
    cy.get('input[aria-label="Password"]').type("123456");
    cy.get('input[aria-label="Confirm Password"]').type("123456");
    cy.get("button").contains("Submit").click();

    // Redirect to the profile page
    cy.url().should("include", "/profile");
    cy.get("h1").contains("user");

    // Check for existance of buttons and text inside main
    cy.get("main").then(($main) => {
      // brand new user with no created/ favorited set
      cy.wrap($main).find("button").contains("My Sets");
      cy.wrap($main).find("p").contains("You don't have any sets yet.");
      cy.wrap($main).find("button").contains("Favorite Sets").click();
      cy.wrap($main).find("p").contains("You have not favorited any sets yet.");
    });
  });

  it("should prompt error for an existing account with the same email", () => {
    cy.get('input[aria-label="Password"]').type("123456");
    cy.get('input[aria-label="Confirm Password"]').type("123456");
    cy.get("button").contains("Submit").click();

    cy.get(".Toastify__toast-body").contains(
      "An account with this email address already exists"
    );
  });
});
