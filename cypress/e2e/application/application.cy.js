/// <reference types="cypress" />

Cypress.config('defaultCommandTimeout', 120_000)


describe('Application flow', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitUntil(function() {
      return cy.get('.sidebar').should('exist');
    },{timeout:120_000})
  })

  it('check all tables are visible and is not empty', () => {
    cy.get('[data-cy=transaction-table]').should('exist')
    cy.get('[data-cy=transaction-table]').getTable().should(tableData => {
      expect(tableData).to.be.not.empty
    })

    cy.contains('Holders').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/holders')
    })
    cy.get('[data-cy=holders-table]').getTable().should(tableData => {
      expect(tableData).to.be.not.empty
    })

    cy.contains('Minters').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/minters')
    })
    cy.get('[data-cy=minters-table]').getTable().should(tableData => {
      expect(tableData).to.be.not.empty
    })
  })
})
