# Testes BDD com Cypress e Cucumber

Neste projeto, pratiquei a escrita de cenários em Gherkin e a implementação dos steps com Cypress. Usei o Hub de Leitura para testar login e administração de livros, incluindo cadastro com tabelas de dados e esquema de cenário.

**Tecnologias:** Cypress, Cucumber, Gherkin e JavaScript.

## Cenários do exercício

| Arquivo | O que verificar |
| --- | --- |
| [login.feature](cypress/e2e/login.feature) | Acesso válido e recusa de senha incorreta |
| [admin-livros.feature](cypress/e2e/admin-livros.feature) | Cadastro, edição e exclusão de livros |
| [admin-livros-massa.feature](cypress/e2e/admin-livros-massa.feature) | Cadastro com tabela de dados e exemplos diferentes |

As ações e validações estão em [step_definitions](cypress/support/step_definitions). O arquivo `teste.feature` mantém os exemplos de navegação no site do Cucumber usados em aula.

## Como executar

Tenha Node.js e npm instalados. Inicie o [Hub de Leitura integrado](https://github.com/EBAC-QE/hub-de-leitura-integrado) em `http://localhost:3000`, com os usuários de demonstração e o catálogo de aula.

Na pasta deste projeto:

```powershell
npm ci
npx cypress run --spec "cypress/e2e/login.feature,cypress/e2e/admin-livros.feature,cypress/e2e/admin-livros-massa.feature"
```

Para executar todos os exemplos, use `npm test`. Para acompanhar pela interface, use `npx cypress open`.

Também é possível selecionar os cenários de cadastro pela tag:

```powershell
npx cypress run --env tags="@cadastro-livro"
```

Os testes de administração criam, alteram e removem livros no ambiente de teste. Os arquivos `.feature` mostram os dados necessários para reproduzir cada cenário.

## Contexto

Exercício desenvolvido por Alexandre Soares durante o curso da EBAC, com a aplicação e os exemplos fornecidos nas aulas.

[Voltar ao portfólio](https://github.com/allesoares/qa-portfolio)
