describe("Create", () => {
  before(() => {
    cy.visit("http://localhost:3000/login");

    cy.get("input[type=email]").type("user@example.com");
    cy.get("input[type=password]").type("123456{enter}");
    cy.get("header a").contains("user");
    cy.visit("http://localhost:3000/sets/create");
    cy.get("h1").contains("Create a New Set");
  });
  beforeEach(() => {
    cy.get('input[aria-label="Title"]').type("Food in French");
    cy.get('textarea[aria-label="Description"]').type(
      "Learn common food in French"
    );
    // Pick French as the language
    cy.get('button[id^="headlessui-listbox-button"]').click();
    cy.get("ul li").contains("French").click();

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

  it("", () => {});
});
