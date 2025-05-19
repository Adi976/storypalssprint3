describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/auth');
  });

  it('should display login form', () => {
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show validation errors for invalid input', () => {
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
}); 