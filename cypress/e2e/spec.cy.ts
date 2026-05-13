describe("template spec", () => {
    it("passes", () => {
        cy.visit("/");

        cy.get("#getResponse")
            .invoke("text")
            .should("not.be.empty")
            .then(JSON.parse)
            .should("deep.equal", { mock: "GET" });

        cy.get("#postResponse")
            .invoke("text")
            .should("not.be.empty")
            .then(JSON.parse)
            .should("deep.equal", { mock: "POST" });
    });
});
