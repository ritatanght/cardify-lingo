describe("Edit", () => {
  const login = (email) => {
    cy.session(email, () => {
      cy.visit("http://localhost:3000/login");

      cy.get("input[type=email]").type(email);
      cy.get("input[type=password]").type("123456{enter}");
      cy.get("header a").contains("user");
    });
  };

  beforeEach(() => {
    login("user@example.com");
    cy.visit("http://localhost:3000/sets/edit/17");
  });

  it("should change set info", () => {
    
  });
});
