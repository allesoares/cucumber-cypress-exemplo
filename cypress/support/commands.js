// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Faz o login pela tela e retorna os dados da conta para quem chamou o comando.
Cypress.Commands.add('login', (email, senha) => {
  cy.visit('/login.html');
  cy.get('#email').type(email);
  cy.get('#password').type(senha, { log: false });
  cy.intercept('POST', '/api/login').as('login');
  cy.get('#login-btn').click();
  cy.wait('@login').its('response.statusCode').should('eq', 200);
  cy.get('#alert-container').should('contain.text', 'Login realizado com sucesso!');
  cy.location('pathname').should('include', 'dashboard.html');

  // O token retornado permite preparar e limpar os dados pela API.
  return cy.get('@login').its('response.body');
});

// Recebe título, autor, categoria e exemplares e retorna o livro criado.
Cypress.Commands.add('criarLivroPelaApi', (dados, token) => {
  return cy.request({
    method: 'POST',
    url: '/api/books',
    headers: { Authorization: token },
    body: {
      title: dados.titulo,
      author: dados.autor,
      category: dados.categoria,
      total_copies: Number(dados.exemplares),
    },
  }).then((resposta) => {
    expect(resposta.status).to.eq(201);
    return resposta.body.book;
  });
});

// Requer login como administrador e a página de gerenciamento de livros aberta.
// Recebe os mesmos dados do comando pela API e também retorna o livro criado.
Cypress.Commands.add('criarLivroPeloSite', (dados) => {
  cy.contains('button', 'Novo Livro').click();
  cy.get('#bookModal').should('be.visible');
  // A animação precisa terminar para o campo não perder o foco ao digitar.
  cy.get('#bookModal .modal-dialog').should('have.css', 'transform', 'none');
  cy.get('#book-title').clear().type(dados.titulo);
  cy.get('#book-author').clear().type(dados.autor);
  cy.get('#book-category').select(dados.categoria);
  cy.get('#book-copies').clear().type(String(dados.exemplares));
  cy.intercept('POST', '/api/books').as('cadastrarLivro');
  cy.get('#save-book-btn').click();

  return cy.wait('@cadastrarLivro').then((requisicao) => {
    expect(requisicao.response.statusCode).to.eq(201);
    return requisicao.response.body.book;
  });
});
