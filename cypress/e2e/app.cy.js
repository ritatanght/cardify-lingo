describe("Navigation", () => {
  it("should be able to visit homepage with no error", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.get("h2").contains("Get Started with Your Set");
  });


  it("should redirect to the login page when clicking on the create set button without logging in", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // Find a link with an href attribute containing "create" and click it
    cy.get('a[href*="create"]').click();

    // The new url should include "/login"
    cy.url().should("include", "/login");
    cy.get("h1").contains("Login");
  });
});
