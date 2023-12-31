describe("View", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/sets/17");
  });
  context("Without login", () => {
    it("should only see the front side of 1st card on visit and able to navigate through cards", () => {
      cy.fixture("testSet").then((testSet) => {
        cy.get("h1").contains(testSet.title);

        const cards = cy.get(".Card");
        cards.should("have.length", testSet.cards.length);
        cards.each(($card, index) => {
          cy.wrap($card)
            .contains(testSet.cards[index].front)
            .should(index === 0 ? "be.visible" : "not.be.visible");
          cy.wrap($card)
            .contains(testSet.cards[index].back)
            .should("not.be.visible");
        });
        // when navigating through the cards, only the active card is visible and in order
        for (let i = 1; i < testSet.cards.length; i++) {
          cy.get("button[aria-label='Next Card']").click();
          cards.each(($card, index) => {
            cy.wrap($card)
              .contains(testSet.cards[index].front)
              .should(index === i ? "be.visible" : "not.be.visible");
          });
        }
        // get to the finish card
        cy.get("button[aria-label='Next Card']").click();
        cy.get("p").contains("Congratulations! You've finished the set!");
      });
    });

    it("should flip to the back on click of the card, and flip a card back to the front when returning to a flipped card", () => {
      const activeCard = cy.get(".Card.active");
      activeCard.should("not.have.class", "flip");
      activeCard.click();
      activeCard.should("have.class", "flip");

      cy.get("button[aria-label='Next Card']").click();
      cy.get("button[aria-label='Previous Card']").click();
      activeCard.should("not.have.class", "flip");
    });
  });
});
