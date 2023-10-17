/// <reference types="cypress" />

Cypress.config('defaultCommandTimeout', 60_000)


describe('Sidebar Navigation', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.waitUntil(function () {
            return cy.get('.sidebar').should('exist');
        })
    })

    it('check all navigation are visible and highlighted', () => {
        cy.get('.transactions-nav').should('have.class', 'active')
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/')
        })


        cy.contains('Holders').click()
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/holders')
        })
        cy.get('.holders-nav').should('have.class', 'active')

        cy.contains('Minters').click()
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/minters')
        })
        cy.get('.minters-nav').should('have.class', 'active')

    })
})
