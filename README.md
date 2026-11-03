# cucumber-cypress-exemplo -- Alexandre

Exemplo de automação de testes usando Cypress com Cucumber para estudantes da EBAC.

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Git

## 🚀 Como usar este projeto

### 1. Clone o repositório
```bash
git clone https://github.com/EBAC-QE/cucumber-cypress-exemplo.git
cd cucumber-cypress-exemplo
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute os testes
```bash
# Executar testes em modo headless
npx cypress run

# Executar testes com interface gráfica
npx cypress open
```
# Excutar testes com tags
```bash
npx cypress run --env tags='@learn'
```

## Testes de administração de livros

Os cenários de `cypress/e2e/admin-livros.feature` possuem steps em
`cypress/support/step_definitions/admin-livros.steps.js`.

1. Em outro terminal, entre em `C:\repositorio\hub-de-leitura-integrado` e execute `npm start`.
2. Neste projeto, execute:

```bash
npx cypress run --spec "cypress/e2e/admin-livros.feature"
```

## Cadastro com massa de dados

O arquivo `cypress/e2e/admin-livros-massa.feature` cadastra vários livros em um
único cenário. 

Com o Hub de Leitura iniciado em `http://localhost:3000`, execute:

```bash
npx cypress run --spec "cypress/e2e/admin-livros-massa.feature"
```

## Exercício BDD: login positivo e negativo

O arquivo `cypress/e2e/login.feature` contém dois cenários independentes:
login válido de administrador e recusa de acesso com senha incorreta.
As definições ficam em `cypress/support/step_definitions/login.steps.js`.

Com o Hub de Leitura iniciado em `http://localhost:3000`, execute:

```bash
npx cypress run --spec "cypress/e2e/login.feature"
```


## 🛠 Tecnologias utilizadas

- **Cypress** - Framework de testes E2E
- **Cucumber** - Ferramenta BDD para escrita de cenários
- **JavaScript** - Linguagem de programação

## 📚 Recursos de aprendizado

Este projeto foi criado para fins educacionais da EBAC (Escola Britânica de Artes Criativas e Tecnologia).
