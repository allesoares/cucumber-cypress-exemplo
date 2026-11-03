#language: pt

Funcionalidade: Administrar livros no Hub de Leitura
  Como administrador do Hub de Leitura,
  quero poder cadastrar, editar e excluir livros,
  para manter o catálogo de livros atualizado.

  Contexto:
    Dado que estou autenticado como administrador no Hub de Leitura
    E estou na página de gerenciamento de livros

  @cadastro-livro
  Cenário: Cadastrar um livro com os dados obrigatórios
    Dado que não existe um livro com o título "Aprendendo BDD"
    Quando cadastro um livro com os seguintes dados:
      | título     | Aprendendo BDD |
      | autor      | Alexandre Soares      |
      | categoria  | Tecnologia     |
      | exemplares | 3              |
    Então devo ver a mensagem "Livro adicionado com sucesso!"
    E devo encontrar o livro "Aprendendo BDD" no acervo com os seguintes dados:
      | autor      | Alexandre Soares  |
      | categoria  | Tecnologia |
      | exemplares | 3          |

  @edicao-livro
  Cenário: Editar os dados de um livro cadastrado
    Dado que existe um livro cadastrado com os seguintes dados:
      | título     | Praticando BDD |
      | autor      | Alexandre Soares |
      | categoria  | Tecnologia     |
      | exemplares | 2              |
    Quando edito o livro "Praticando BDD" com os seguintes dados:
      | título     | Praticando BDD - Revisado |
      | autor      | Alexandre Soares          |
      | categoria  | Tecnologia               |
      | exemplares | 4                        |
    Então devo ver a mensagem "Livro atualizado com sucesso!"
    E devo encontrar o livro "Praticando BDD - Revisado" no acervo com os seguintes dados:
      | autor      | Alexandre Soares |
      | categoria  | Tecnologia  |
      | exemplares | 4           |
    E não devo encontrar o livro "Praticando BDD" no acervo

  @exclusao-livro
  Cenário: Excluir um livro após confirmar a exclusão
    Dado que existe um livro cadastrado com os seguintes dados:
      | título     | Introdução ao Cucumber |
      | autor      | Alexandre Soares       |
      | categoria  | Tecnologia             |
      | exemplares | 1                      |
    E o livro "Introdução ao Cucumber" não possui reservas
    Quando solicito a exclusão do livro "Introdução ao Cucumber"
    E confirmo a exclusão
    Então devo ver a mensagem "Livro excluído com sucesso!"
    E não devo encontrar o livro "Introdução ao Cucumber" no acervo
