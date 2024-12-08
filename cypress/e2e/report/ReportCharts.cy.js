describe('Render all charts in report', () => {
  beforeEach(() => {
    cy.visit(`/`)
  })

  it('visits report', () => {
    cy.visit('/')
    cy.get('header > p').should('have.text', 'Report')
    cy.get('header > h4').should('have.text', 'Integria Dashboard')
  })
})
