describe("Homepage", () => {
  it("should be able to visit homepage with no error", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.get("h2").contains("Get Started with Your Set");
  });

  it("should navigate to the languages set list when clicking on the link in the dropdown", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // click on the dropdown toggle button
    cy.contains("Languages").click();

    // there is a link that links to languages with id of 1
    cy.get('a[href="/languages/1"]');

    // Click on the link displayed as 'Japanese'
    cy.get("a").contains("Japanese").click();

    // check page title
    cy.get("h1").contains("Language: Japanese");

    // check existance of set title
    cy.get("a").contains("Japanese Hiragana");
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
