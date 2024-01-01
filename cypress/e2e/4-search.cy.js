describe("Search", () => {
  const login = (email) => {
    cy.session(email, () => {
      cy.visit("http://localhost:3000/login");

      cy.get("input[type=email]").type(email);
      cy.get("input[type=password]").type("johnssecurepassword{enter}");
      cy.get("header a").contains("john_doe");
    });
  };
  before(() => {
    login("john.doe@example.com");
    // mark a set as private
    cy.visit("http://localhost:3000/profile");
    cy.get('a[href="/sets/5"] button[aria-label="Edit set"]').click();
    cy.url().should("include", "edit");
    // mark set as private
    cy.get("#private").check();
    cy.get("#private").should("be.checked");
    cy.get("form button").contains("Save").click();

    // redirect to profile after successful update
    cy.url().should("include", "profile");
  });
  it("should show the list of results when searched with matching results", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.get("input[name=query]").type("express{enter}");

    // check for page title including the query
    cy.get("h1").contains('Search Results for "express"');
    const sets = cy.get("a[href^='/sets/']");
    sets.should("have.length", 3);
    sets.contains("Portuguese Expressions");
  });

  it("should display no set found when searched with no matching results", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.get("input[name=query]").type("abc{enter}");

    // check for page title including the query
    cy.get("h1").contains('Search Results for "abc"');

    cy.contains("No set found matching your query");
  });

  it("should display private set in the search list for set owner", () => {
    login("john.doe@example.com");
    cy.visit("http://localhost:3000/");
    
    cy.get("input[name=query]").type("Cantonese{enter}");
    cy.get('a[href="/sets/5"]').should("exist");
  });

  it("should not display private set in the search list for non-owner", () => {
    cy.visit("http://localhost:3000/");

    cy.get("input[name=query]").type("Cantonese{enter}");
    cy.get('a[href="/sets/5"]').should("not.exist");
  });
});
