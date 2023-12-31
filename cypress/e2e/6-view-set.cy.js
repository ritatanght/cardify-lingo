describe("View", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/sets/17");
  });
  context("Without login", () => {
    it("should not see a favorite button nor the edit buttons", () => {
      cy.get('[data-testid="likeBtn"]').should("not.exist");
      cy.get("a").contains("Edit Set").should("not.exist");
      cy.get(".Card button[aria-label='Edit card']").should("not.exist");
    });

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

  context("Login as non-set owner", () => {
    it("should not see the favorite button but not the edit buttons", () => {
      cy.visit("http://localhost:3000/login");
      cy.get("input[type=email]").type("john.doe@example.com");
      cy.get("input[type=password]").type("johnssecurepassword{enter}");
      cy.get("header a").contains("john_doe");

      cy.visit("http://localhost:3000/sets/17");

      cy.get('[data-testid="likeBtn"]').should("exist");
      cy.get("a").contains("Edit Set").should("not.exist");
      cy.get(".Card button[aria-label='Edit card']").should("not.exist");
    });
  });

  context("Login as the set owner", () => {
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
      cy.visit("http://localhost:3000/sets/17");
    });
    it("should see button for liking set and edit card/ set", () => {
      cy.get('[data-testid="likeBtn"]').should("exist");
      cy.get("a").contains("Edit Set").should("exist");
      cy.get(".Card button[aria-label='Edit card']").should("have.length", 8);
    });
  });
});
