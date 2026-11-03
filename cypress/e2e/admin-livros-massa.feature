#language: pt

Funcionalidade: Cadastrar livros com diferentes massas de dados
  Como administrador do Hub de Leitura
  Quero cadastrar livros de diferentes autores e categorias
  Para ampliar o acervo da biblioteca

  Contexto:
    Dado que estou autenticado como administrador no Hub de Leitura
    E estou na página de gerenciamento de livros

  @cadastro-livro @massa-livros
  Cenário: Cadastrar vários livros com sucesso
    Quando cadastro os seguintes livros com os seguintes dados:
      | titulo                   | autor            | categoria  | exemplares |
      | Primeiros passos com BDD | Alexandre Soares | Tecnologia | 3          |
      | Uma aventura na serra    | Ana Silva        | Aventura   | 2          |
      | Histórias de um verão    | Bruno Souza      | Romance    | 1          |
    Então devo ver a mensagem "Livro adicionado com sucesso!"

@cadastro-livro
Esquema do Cenário: Cadastrar livros usando esquema de dados
  Dado que não existe um livro com o título "<titulo>"
    Quando cadastro um livro com os seguintes dados:
      | título     | <titulo> |
      | autor      | <autor>  |
      | categoria  | <categoria> |
      | exemplares | <exemplares> |
    Então devo ver a mensagem "Livro adicionado com sucesso!"
    E devo encontrar o livro "<titulo>" no acervo com os seguintes dados:
      | autor      | <autor>  |
      | categoria  | <categoria> |
      | exemplares | <exemplares> |

    Exemplos:
      | titulo                   | autor            | categoria  | exemplares |
      | Primeiros passos com BDD | Alexandre Soares | Tecnologia | 3          |
      | Uma aventura na serra    | Ana Silva        | Aventura   | 2          |
      | Histórias de um verão    | Bruno Souza      | Romance    | 1          |

