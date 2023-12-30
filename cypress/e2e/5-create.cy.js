describe("Create", () => {
  const login = (email) => {
    cy.session(email, () => {
      cy.visit("http://localhost:3000/login");

      cy.get("input[type=email]").type(email);
      cy.get("input[type=password]").type("123456{enter}");
      cy.get("header a").contains("user");
    });
    cy.visit("http://localhost:3000/sets/create");
  };

  beforeEach(() => {
    login("user@example.com");

    cy.get('input[aria-label="Title"]').type("Food in French");
    cy.get('textarea[aria-label="Description"]').type(
      "Learn common food in French"
    );
    // Pick French as the language
    cy.get('button[id^="headlessui-listbox-button"]')
      .click()
      .next()
      .find("li")
      .contains("French")
      .click();

    // Input the front end back for all the cards
    const frontText = ["Milk", "Egg", "Apple"];
    cy.get('.card-container input[name="front"]').each(($el, index) => {
      cy.wrap($el).type(frontText[index]);
    });

    const backText = ["Le lait", "L' œuf", "La pomme"];
    cy.get('.card-container input[name="back"]').each(($el, index) => {
      cy.wrap($el).type(backText[index]);
    });
  });

  it("should prompt error when title is empty", () => {
    cy.get('input[aria-label="Title"]').clear();
    cy.get("button").contains("Create").click();
    cy.get(".Toastify__toast-body").contains("Creating Set");
    cy.get(".Toastify__toast-body").contains(
      "Title and description cannot be empty"
    );
  });

  it("should prompt error when description is empty", () => {
    cy.get('textarea[aria-label="Description"]').clear();
    cy.get("button").contains("Create").click();

    cy.get(".Toastify__toast-body").contains(
      "Title and description cannot be empty"
    );
  });

});