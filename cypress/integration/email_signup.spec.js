import faker from "faker"

faker.locale = "fr";

describe('Email Signup', function () {
  const emailAddress = faker.internet.email()
  const phoneNumber = faker.phone.phoneNumber("06########");

  it('should be able to signup with email', function () {
    cy.visit(Cypress.env('CONNECT_DEMO_YOGA_URL'));

    cy.get('.login-button').click()

    cy.get('#choose-language').select('fr-FR')

    cy.get('h1')
      .should('contain', 'Se connecter')

    cy.get('#email')
      .focus()
      .type(emailAddress, { delay: 0 })
      .should('have.value', emailAddress)

    cy.get('#next-btn')
      .click()

    cy.wait(500)

    cy.request(`${Cypress.env('MAILDEV_URL')}/email`).then((response) => {
      const email = response.body.filter((email) => email.to[0].address === emailAddress)[0]
      cy.request('DELETE', `${Cypress.env('MAILDEV_URL')}/email/${email.id}`)

      expect(email.text).to.match(/or navigate to https:\/\/notification.*&type=email/)

      const link = email.text.match(/https:\/\/notification.*&type=email/g)[0]

      cy.visit(link)

      cy.get("#set-phone")
        .focus()
        .type(phoneNumber, { delay: 50 });

      cy.get("[type=submit]")
        .click();

      cy.get(".forward > button")
        .click()
    })
  })
})
