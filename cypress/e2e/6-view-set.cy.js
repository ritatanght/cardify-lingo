describe("View", () => {
  context("Without login", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/sets/17");
    });
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
    it("should see and toggle the favorite button but not the edit buttons", () => {
      cy.visit("http://localhost:3000/login");
      cy.get("input[type=email]").type("john.doe@example.com");
      cy.get("input[type=password]").type("johnssecurepassword{enter}");
      cy.get("header a").contains("john_doe");

      cy.visit("http://localhost:3000/sets/17");

      cy.get("a").contains("Edit Set").should("not.exist");
      cy.get(".Card button[aria-label='Edit card']").should("not.exist");
      // Able to toggle between like and unlike
      cy.get('[data-testid="likeBtn"]')
        .should("have.attr", "aria-label", "Like set")
        .click()
        .should("have.attr", "aria-label", "Unlike set")
        .click()
        .should("have.attr", "aria-label", "Like set");
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

    it("should see button for liking set and edit card/ set, and open edit modal", () => {
      cy.get('[data-testid="likeBtn"]').should("exist");
      cy.get("a").contains("Edit Set").should("exist");
      cy.get(".Card button[aria-label='Edit card']").should("have.length", 8);

      // open edit card modal
      cy.get("div[id^='headlessui-dialog-panel']").should("not.exist");
      cy.get(".Card.active button[aria-label='Edit card']").first().click();
      cy.get("div[id^='headlessui-dialog-panel']").should("exist");
    });

    it("should be able to edit card content with the edit card button", () => {
      cy.readFile("cypress/fixtures/testSet.json").then((testSet) => {
        cy.get(".Card.active button[aria-label='Edit card']").first().click();
        const oldCard = testSet.cards[0];
        const newCard = { front: "Yogurt", back: "Le yaourt", image_url: null };
        cy.get("div[id^='headlessui-dialog-panel']").then(($modal) => {
          // check that old card data matches before replacing with new card info
          cy.wrap($modal)
            .find("input#front")
            .should("have.value", oldCard.front)
            .clear()
            .type(newCard.front);
          cy.wrap($modal)
            .find("input#back")
            .should("have.value", oldCard.back)
            .clear()
            .type(newCard.back);
          cy.wrap($modal).find("button").contains("Save Changes").click();
          // update the testSet json file as well
          cy.writeFile("cypress/fixtures/testSet.json", {
            ...testSet,
            cards: [newCard, ...testSet.cards.slice(1)],
          });
        });
        cy.get(".Toastify__toast-body").contains("Changes have been saved");
        // Check new content on card
        cy.get(".Card.active").contains(newCard.front).should("be.visible");
        cy.get(".Card.active").contains(newCard.back).should("exist");
      });
    });

    it("should navigate to the edit page for the set on click of the edit set button", () => {
      cy.fixture("testSet").then((testSet) => {
        cy.get("a").contains("Edit Set").click();

        cy.url().should("include", "/sets/edit/17");
        // check against testSet data
        cy.get("h1").contains(`Edit: ${testSet.title}`);
        cy.get("textarea").contains(testSet.description);

        const cards = cy.get(".card-container");
        cards.should("have.length", testSet.cards.length);
      });
    });
  });
});
