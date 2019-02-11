# Safadeador de github

Este pacote tem objetivo de ajudar desenvolvedores em redes corporativas que não permitem realizar download de repositórios do github.

Para driblar o problema, o download do repositório é feito pela API do Github e não usando o protocolo do git.

## Requisitos para utilização:

 - NodeJS
 - NPM

## Como instalar

`npm install -g safadear-github`

## Como utilizar

`safadear-github URL_REPO`

Exemplo:
`safadear-github https://github.com/SerenityInAllThings/safadeador-github`

## Notas
Devido as limitações dos ambientes corporativos, talvez seja necessário adicionar algumas variáveis de ambiente para que seus pacotes NPM funcionem:

 - Adicionar a variável `NODE_PATH` com o valor `%APPDATA%\npm\node_modules`

 - Concatenar ao seu `PATH` o valor `%APPDATA%\npm`

 ## Repositório NPM

 https://www.npmjs.com/package/safadear-github