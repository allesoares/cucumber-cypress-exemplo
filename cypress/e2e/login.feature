#language: pt

Funcionalidade: Autenticação no Hub de Leitura
  Como usuário do Hub de Leitura
  Quero acessar o sistema com minha conta
  Para utilizar as funcionalidades permitidas ao meu perfil

  @login @positivo
  Cenário: Acessar o painel com credenciais válidas de administrador
    Quando faço login com credenciais válidas de administrador
    Então devo acessar o painel administrativo autenticado

  @login @negativo
  Cenário: Recusar o acesso com senha incorreta
    Dado que acesso a página de login do Hub de Leitura
    Quando tento entrar com o email "admin@biblioteca.com" e a senha "senha-incorreta"
    Então o acesso deve ser recusado com a mensagem "Email ou senha incorretos."
    E devo permanecer na página de login sem autenticação
