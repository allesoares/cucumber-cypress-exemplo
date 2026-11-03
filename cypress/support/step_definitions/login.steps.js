const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

Given('que acesso a página de login do Hub de Leitura', () => {
  cy.visit('/login.html');
  cy.get('#login-btn').should('be.visible');
});

When('faço login com credenciais válidas de administrador', () => {
  // Reutiliza o comando que valida o sucesso do login pela interface.
  cy.login(
    Cypress.env('adminEmail') || 'admin@biblioteca.com',
    Cypress.env('adminPassword') || 'admin123'
  ).then((usuario) => {
    expect(usuario.isAdmin).to.eq(true);
  });
});

Then('devo acessar o painel administrativo autenticado', () => {
  cy.location('pathname').should('eq', '/admin-dashboard.html');
  cy.window().should((janela) => {
    expect(janela.localStorage.getItem('authToken')).to.be.a('string').and.not.be.empty;
    expect(janela.localStorage.getItem('isAdmin')).to.eq('true');
  });
});

When('tento entrar com o email {string} e a senha {string}', (email, senha) => {
  // cy.login() espera sucesso; neste cenário enviamos as credenciais diretamente.
  cy.get('#email').type(email);
  cy.get('#password').type(senha, { log: false });
  cy.intercept('POST', '/api/login').as('loginInvalido');
  cy.get('#login-btn').click();
});

Then('o acesso deve ser recusado com a mensagem {string}', (mensagem) => {
  cy.wait('@loginInvalido').its('response.statusCode').should('eq', 401);
  cy.get('#alert-container').should('be.visible').and('contain.text', mensagem);
});

Then('devo permanecer na página de login sem autenticação', () => {
  cy.location('pathname').should('eq', '/login.html');
  cy.window().should((janela) => {
    expect(janela.localStorage.getItem('authToken')).to.eq(null);
  });
});
