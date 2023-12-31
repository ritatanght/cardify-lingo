describe("View", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/sets/17");
  });
  it("should only see the front side of the first card on visit of the view set page", () => {
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
    });
  });
  it("should flip to the back on click of the card", () => {
    const activeCard = cy.get(".Card.active");
    activeCard.should("not.have.class", "flip");
    activeCard.click();
    activeCard.should("have.class", "flip");
  });
});
