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

  it("should revise set and cards details", () => {
    // change title to 'Common Food in French'
    // and update the second card in the list
    const newTitle = "Common Food in French";
    const newDesc = "Learn common food vocabulary in French";
    const newCard = { front: "Milk", back: "Le lait", image_url: null };
    cy.get("input[aria-label='Title']").clear().type(newTitle);
    cy.get("textarea[aria-label='Description']").clear().type(newDesc);
    cy.get(".card-container")
      .eq(1) // change the 2nd card
      .then(($card) => {
        const inputs = cy.wrap($card).find("input[type='text']");
        inputs.each(($el, ind) =>
          cy
            .wrap($el)
            .clear()
            .type(newCard[ind === 0 ? "front" : "back"])
        );
      });
    cy.get("form button").contains("Save").click();
    cy.get(".Toastify__toast-body").contains("Set updated successfully");
    cy.url().should("include", "/profile");
    cy.get("main a").contains(newTitle).should("exist");

    cy.request("http://localhost:3000/api/sets/17").as("set");

    cy.readFile("cypress/fixtures/testSet.json").then((testSet) => {
      // update the testSet json file as well
      const updatedCards = testSet.cards;
      updatedCards[1] = newCard;
      cy.writeFile("cypress/fixtures/testSet.json", {
        ...testSet,
        title: newTitle,
        description: newDesc,
        cards: [...updatedCards],
      });
    });

    cy.fixture("testSet").then((testSet) => {
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

  it("should reorder cards in set with mouse drag and drop", () => {
    // swap the first two cards
    cy.get("span[data-testid='dragHandle']")
      .first()
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 500, clientY: 250 })
      .trigger("mouseup", { force: true });

    cy.wait(200).get("form button").contains("Save").click();
    cy.get(".Toastify__toast-body").contains("Set updated successfully");

    cy.readFile("cypress/fixtures/testSet.json").then((testSet) => {
      const [firstCard, secondCard, ...card] = [...testSet.cards];
      // update the testSet json file as well
      cy.writeFile("cypress/fixtures/testSet.json", {
        ...testSet,
        cards: [secondCard, firstCard, ...card],
      });
    });

    cy.url().should("include", "/profile");
    cy.request("http://localhost:3000/api/sets/17").as("set");

    cy.fixture("testSet").then((testSet) => {
      cy.get("@set").should((res) => {
        // check content of cards
        console.log("res.body.cards", res.body.cards);
        console.log("testSet.cards", testSet.cards);
        res.body.cards.forEach((card, index) => {
          for (const key in card) {
            if (key === "front" || key === "back") {
              expect(card[key]).to.be.eq(testSet.cards[index][key]);
            }
          }
        });
      });
    });
  });

  it("should reorder cards in set with touch drag and drop and able to remove card", () => {
    // swap the last two cards
    cy.get("span[data-testid='dragHandle']")
      .last()
      .trigger("touchstart", { which: 1 })
      .trigger("touchmove", { clientX: 500, clientY: 250 })
      .trigger("touchend");

    // remove the 1st card
    cy.get('button[aria-label="Remove Card"]').eq(0).click();

    cy.wait(200).get("form button").contains("Save").click();
    cy.get(".Toastify__toast-body").contains("Set updated successfully");

    cy.readFile("cypress/fixtures/testSet.json").then((testSet) => {
      const [deleted, ...updatedCards] = [...testSet.cards];
      //swap the last two items in the list
      const [removed] = updatedCards.splice(-1, 1);
      updatedCards.splice(-1, 0, removed);

      cy.writeFile("cypress/fixtures/testSet.json", {
        ...testSet,
        cards: [...updatedCards],
      });
    });

    cy.url().should("include", "/profile");
    cy.request("http://localhost:3000/api/sets/17").as("set");

    cy.fixture("testSet").then((testSet) => {
      cy.get("@set").should((res) => {
        // check content of cards
        console.log("res.body.cards", res.body.cards);
        console.log("testSet.cards", testSet.cards);
        res.body.cards.forEach((card, index) => {
          for (const key in card) {
            if (key === "front" || key === "back") {
              expect(card[key]).to.be.eq(testSet.cards[index][key]);
            }
          }
        });
      });
    });
  });

  it("should display no permission when trying to edit other user's set", () => {
    cy.visit("http://localhost:3000/sets/edit/1");
    cy.get("h1").contains("Sorry, you don't have permission to edit this set!");
  });
});
