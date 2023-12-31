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

  const testSet = {
    title: "Food in French",
    description: "Learn common food in French",
    language_name: "French",
    cards: [
      {
        front: "Milk",
        back: "Le lait",
        image_url: null,
      },
      {
        front: "Egg",
        back: "L' œuf",
        image_url: null,
      },
      {
        front: "Apple",
        back: "La pomme",
        image_url: null,
      },
      {
        front: "Sugar",
        back: "Le sucre",
        image_url: null,
      },
    ],
  };

  beforeEach(() => {
    login("user@example.com");

    cy.get('input[aria-label="Title"]').type(testSet.title);
    cy.get('textarea[aria-label="Description"]').type(testSet.description);
    // Pick French as the language
    cy.get('button[id^="headlessui-listbox-button"]')
      .click()
      .next()
      .find("li")
      .contains(testSet.language_name)
      .click();

    // fill the three cards with data from testSet
    cy.get(".card-container").each(($card, cardIdx) => {
      const inputs = cy.wrap($card).find("input[type='text']");

      inputs.each(($el, ind) =>
        cy.wrap($el).type(testSet.cards[cardIdx][ind === 0 ? "front" : "back"])
      );
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
    cy.get("form button").contains("Create").click();

    cy.get(".Toastify__toast-body").contains(
      "Title and description cannot be empty"
    );
  });

  it("should prompt warning when attempting to remove all cards", () => {
    const deleteBtns = cy.get('button[aria-label="Remove Card"]');
    deleteBtns.each(($btn) => $btn.click());
    cy.get(".Toastify__toast-body").contains("at least one card");
  });

  it("should prompt warning when attempts to submit a card with blank front", () => {
    cy.get(".card-container").first().find("input[name='front']").clear();

    cy.get("form button").contains("Create").click();
    cy.get(".Toastify__toast-body").contains("Cards cannot be empty");
  });

  it("should prompt warning when attempts to submit a card with blank back", () => {
    cy.get(".card-container").last().find("input[name='back']").clear();

    cy.get("form button").contains("Create").click();
    cy.get(".Toastify__toast-body").contains("Cards cannot be empty");
  });

  it("should able to add new card", () => {
    cy.get("form button").contains("Add").click();
    cy.get(".card-container")
      .last()
      .then(($card) => {
        const inputs = cy.wrap($card).find("input[type='text']");

        inputs.each(($el, ind) =>
          cy.wrap($el).type(testSet.cards[3][ind === 0 ? "front" : "back"])
        );
      });

    cy.get("form button").contains("Create").click();
    cy.get(".Toastify__toast-body").contains("successfully");

    // redirect to profile page
    cy.url().should("include", "/profile");
    cy.get("main a").contains("Food in French");
  });

  after(() => {
    cy.request("/api/sets/17").as("set");
    cy.get("@set").should((res) => {
      expect(res.body).to.have.property("set");
      expect(res.body).to.have.property("cards");
      const { set, cards } = res.body;

      expect(set.title).to.be.eq(testSet.title);
      expect(set.description).to.be.eq(testSet.description);
      expect(set.language_name).to.be.eq(testSet.language_name);
      expect(cards).to.have.lengthOf(4);
      // check content of cards
      cards.forEach((card, index) => {
        for (const key in card) {
          if (key === "front" || key === "back") {
            expect(card[key]).to.be.eq(testSet.cards[index][key]);
          }
        }
      });
    });
  });
});
