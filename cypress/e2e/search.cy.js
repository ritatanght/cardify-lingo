describe("Search", () => {
  it("should show the list of results when searched with matching results", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.get("input[name=query]").type("express{enter}");

    // check for page title including the query
    cy.get("h1").contains('Search Results for "express"');

    cy.get("a").contains("Portuguese Expressions");
    cy.get("a").contains("Cantonese Slang");
  });

  it("should display no set found when searched with no matching results", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.get("input[name=query]").type("abc{enter}");

    // check for page title including the query
    cy.get("h1").contains('Search Results for "abc"');

    cy.contains("No set found matching your query");
  });
});
