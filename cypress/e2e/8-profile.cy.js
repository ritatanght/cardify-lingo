describe("Profile", () => {
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
    cy.visit("http://localhost:3000/profile");
  });

  it("should navigate to create set page", () => {
    // click on the create set button on profile page
    cy.get("main a").contains("Create Set").click();

    // navigate to the create page
    cy.get("h1").contains("Create a New Set");
  });

  it("should navigate to edit set page", () => {
    cy.fixture("testSet").then((testSet) => {
      cy.get("main a")
        .contains(testSet.title)
        .parent()
        .find('button[aria-label="Edit set"]')
        .click();

      // navigate to the edit page
      cy.get("h1").contains(`Edit: ${testSet.title}`);
      cy.get("form button").contains("Save").should("exist");
    });
  });

  it("should toggle favoriting a set when clicking on the heart icon", () => {
    // the set is not in favorite sets before liking
    cy.get("button").contains("Favorite Sets").click();
    cy.get("a").contains("Food in French").should("not.exist");

    // like the set
    cy.get("button").contains("My Sets").click();
    cy.get("a")
      .contains("Food in French")
      .parent()
      .find('[data-testid="likeBtn"]')
      .should("have.attr", "aria-label", "Like")
      .click();
    // the set should be in favorites
    cy.get("button").contains("Favorite Sets").click();
    cy.get("a").contains("Food in French").should("exist");

    // unlike the set
    cy.get("button").contains("My Sets").click();
    cy.get("a")
      .contains("Food in French")
      .parent()
      .find('[data-testid="likeBtn"]')
      .should("have.attr", "aria-label", "Unlike")
      .click();

    // the set should not be in favorites
    cy.get("button").contains("Favorite Sets").click();
    cy.get("a").contains("Food in French").should("not.exist");
  });

  it.only("should prompt confirmation before deleting a set", () => {
    cy.get("a")
      .contains("Food in French")
      .parent()
      .find('[data-testid="delBtn"]')
      .click();
    const modal = cy.get("[id^='headlessui-dialog-panel']");
    modal.get("button").contains("Cancel").click();
    modal.should("not.exist");

    cy.get("a")
      .contains("Food in French")
      .parent()
      .find('[data-testid="delBtn"]')
      .click();

    modal.get("button").contains("Confirm").click();
    cy.get(".Toastify__toast-body").contains("Set deleted");
    cy.get("a").contains("Food in French").should("not.exist");

    cy.request({
      url: "http://localhost:3000/api/sets/17",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.deep.eq({ message: "Set not found" });
    });
  });
});
