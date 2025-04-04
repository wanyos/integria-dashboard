describe('Render all charts in report', () => {
  beforeEach(() => {
    cy.viewport(1440, 900)
    cy.visit('http://localhost:5173/')
  })

  it('visits report', () => {
    cy.get('header > p').should('have.text', 'Report')
    cy.get('header > article > h4').should('have.text', 'Integria Dashboard')
  })
})
