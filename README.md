# ecommerce_adonisJS
Consolidando o conhecimento com adonisJS e typescript

### Sobre
Esse projeto foi passado como desafio para implementar os conhecimentos adquiridos em cursos e artigos.

### Pré-requisitos
Antes de começar precisará configurar suas variavéis de ambiente, descomentando o arquivo .env.example e adicionando suas variavéis.

### 🎲 Rodando o Back End (servidor)

```bash
# Clone este repositório
$ git clone <https://github.com/EduardoBarbosa-TI/ecommerce_adonisJS.git>

# Entre dentro da pasta api-ecommerce
$cd api-ecommerce

# Instale as dependências
$ npm install || yarn install

# Realize a migration das tabelas
$ node ace migration:run

# Execute a aplicação em modo de desenvolvimento
$ npm run dev || node ace serve --watch

# O servidor inciará na port:3333 
# Acesse o swagger em
$ http://localhost:3333/docs