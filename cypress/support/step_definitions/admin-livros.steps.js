const { Given, When, Then, Before, After } = require('@badeball/cypress-cucumber-preprocessor');

const tags = '@cadastro-livro or @edicao-livro or @exclusao-livro';
let token;
let identificador;
let livroId;
let livrosMassa;

Before({ tags }, () => {
  token = undefined;
  identificador = Date.now();
  livroId = undefined;
  livrosMassa = [];
});

// O sufixo permite repetir os testes sem alterar livros que já existem no acervo.
function tituloDoTeste(titulo) {
  return `${titulo} [${identificador}]`;
}

function buscarLivro(titulo) {
  cy.intercept({
    method: 'GET',
    pathname: '/api/books',
    query: { search: tituloDoTeste(titulo) },
  }).as('buscarLivro');

  cy.get('#search-input').clear().type(tituloDoTeste(titulo), { delay: 0 });
  cy.wait('@buscarLivro').its('response.statusCode').should('eq', 200);
  cy.get('#books-loading').should('not.be.visible');
}

function preencherLivro(dados) {
  // Aguarda o fim da animação para o formulário não tirar o foco durante a digitação.
  cy.get('#bookModal .modal-dialog').should('have.css', 'transform', 'none');
  cy.get('#book-title').clear().type(tituloDoTeste(dados['título']));
  cy.get('#book-author').clear().type(dados.autor);
  cy.get('#book-category').select(dados.categoria);
  cy.get('#book-copies').clear().type(dados.exemplares);
}

function linhaDoLivro(titulo) {
  // O identificador no final diferencia o título original do revisado.
  return cy.contains('#books-tbody td:nth-child(2) strong', tituloDoTeste(titulo)).closest('tr');
}

Given('que estou autenticado como administrador no Hub de Leitura', () => {
  cy.login(
    Cypress.env('adminEmail') || 'admin@biblioteca.com',
    Cypress.env('adminPassword') || 'admin123'
  ).then((usuario) => {
    expect(usuario.isAdmin).to.eq(true);
    // Token para uso em requisições de API nos testes.
    token = usuario.token;
  });
  cy.location('pathname').should('eq', '/admin-dashboard.html');
});

Given('estou na página de gerenciamento de livros', () => {
  cy.visit('/admin-books.html');
  cy.location('pathname').should('eq', '/admin-books.html');
  cy.get('#books-loading').should('not.be.visible');
  cy.contains('button', 'Novo Livro').should('be.visible');
});

Given('que não existe um livro com o título {string}', (titulo) => {
  cy.request({
    url: '/api/books',
    qs: { search: tituloDoTeste(titulo) },
    headers: { Authorization: token },
  }).then((resposta) => {
    expect(resposta.body.books).to.have.length(0);
  });
});

Given('que existe um livro cadastrado com os seguintes dados:', (tabela) => {
  const dados = tabela.rowsHash();

  cy.criarLivroPelaApi({
    titulo: tituloDoTeste(dados['título']),
    autor: dados.autor,
    categoria: dados.categoria,
    exemplares: dados.exemplares,
  }, token).then((livro) => {
    livroId = livro.id;
  });
});

Given('o livro {string} não possui reservas', (titulo) => {
 
  cy.request({
    url: `/api/books/${livroId}`,
    headers: { Authorization: token },
  }).then((resposta) => {
    expect(resposta.body.book.title).to.eq(tituloDoTeste(titulo));
    expect(resposta.body.book.total_reservations).to.eq(0);
  });
});

When('cadastro um livro com os seguintes dados:', (tabela) => {
  const dados = tabela.rowsHash();
  cy.criarLivroPeloSite({
    titulo: tituloDoTeste(dados['título']),
    autor: dados.autor,
    categoria: dados.categoria,
    exemplares: dados.exemplares,
  }).then((livro) => {
    // Guardar o ID para exclusão no After
    livroId = livro.id;
    expect(livro.title).to.eq(tituloDoTeste(dados['título']));
  });
});

When('cadastro os seguintes livros com os seguintes dados:', (tabela) => {
  // hashes() transforma cada linha da tabela em um livro, usando os cabeçalhos.
  const livros = tabela.hashes();

  cy.wrap(livros).each((dados) => {
    // Abre a página sem manter o filtro do livro anterior.
    cy.visit('/admin-books.html');
    cy.get('#books-loading').should('not.be.visible');
    cy.request({
      url: '/api/books',
      qs: { search: tituloDoTeste(dados.titulo) },
      headers: { Authorization: token },
    }).then((resposta) => {
      expect(resposta.body.books).to.have.length(0);
    });

    cy.criarLivroPeloSite({
      titulo: tituloDoTeste(dados.titulo),
      autor: dados.autor,
      categoria: dados.categoria,
      exemplares: dados.exemplares,
    }).then((livro) => {
      // Varios livros podem ser criados.
      livrosMassa.push(livro.id);
      expect(livro.title).to.eq(tituloDoTeste(dados.titulo));
    });

    cy.get('#alert-container').should('be.visible').and('contain.text', 'Livro adicionado com sucesso!');
    cy.get('#bookModal').should('not.be.visible');
    buscarLivro(dados.titulo);
    linhaDoLivro(dados.titulo).within(() => {
      cy.get('td').eq(2).should('have.text', dados.autor);
      cy.get('td').eq(3).find('.badge').should('have.text', dados.categoria);
    });

  });
});

When('edito o livro {string} com os seguintes dados:', (titulo, tabela) => {
  buscarLivro(titulo);
  linhaDoLivro(titulo).find('button[title="Editar"]').click();
  cy.get('#bookModal').should('be.visible');
  preencherLivro(tabela.rowsHash());
  cy.intercept('PUT', '/api/books/*').as('editarLivro');
  cy.get('#save-book-btn').click();
  cy.wait('@editarLivro').its('response.statusCode').should('eq', 200);
});

When('solicito a exclusão do livro {string}', (titulo) => {
  buscarLivro(titulo);
  linhaDoLivro(titulo).find('button[title="Excluir"]').click();
  cy.get('#deleteModal').should('be.visible');
  cy.get('#book-to-delete-info').should('contain', tituloDoTeste(titulo));
});

When('confirmo a exclusão', () => {
  cy.get('#deleteModal .modal-dialog').should('have.css', 'transform', 'none');
  cy.intercept('DELETE', '/api/books/*').as('excluirLivro');
  cy.get('#confirm-delete-btn').click();
  cy.wait('@excluirLivro').its('response.statusCode').should('eq', 200);
  // A exclusão já foi feita pela interface; não precisamos repeti-la na limpeza.
  cy.then(() => {
    livroId = undefined;
  });
});

Then('devo ver a mensagem {string}', (mensagem) => {
  cy.get('#alert-container').should('be.visible').and('contain.text', mensagem);
});

Then('devo encontrar o livro {string} no acervo com os seguintes dados:', (titulo, tabela) => {
  const dados = tabela.rowsHash();
  buscarLivro(titulo);
  linhaDoLivro(titulo).within(() => {
    cy.get('td').eq(2).should('have.text', dados.autor);
    cy.get('td').eq(3).find('.badge').should('have.text', dados.categoria);
    cy.get('button[title="Editar"]').click();
  });
  
  cy.get('#bookModal').should('be.visible');
  cy.get('#book-copies').should('have.value', dados.exemplares);
  cy.get('#bookModal .modal-dialog').should('have.css', 'transform', 'none');
  cy.get('#bookModal').contains('button', 'Cancelar').click();
  cy.get('#bookModal').should('not.be.visible');
});

Then('não devo encontrar o livro {string} no acervo', (titulo) => {
  buscarLivro(titulo);
  cy.contains('#books-tbody td:nth-child(2) strong', tituloDoTeste(titulo)).should('not.exist');
});

After({ tags }, () => {
  // Inclui o livro dos cenários individuais na lista de limpeza.
  if (livroId) {
    livrosMassa.push(livroId);
  }
  livrosMassa.forEach((id) => {
    cy.request({
      method: 'DELETE',
      url: `/api/books/${id}`,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.be.oneOf([200, 404]);
    });
  });
});
