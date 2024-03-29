# BatePapo Uol

Essa API é responsável por fornecer recursos para um chat simples.

Com essa API é possível:

- Cadastrar um nome de usuário;
- Acessar a lista de todos os usuários cadastrados;
- Enviar mensagens;
- Enviar mensagens privadas;
- Acessar a lista de mensagens;
- Editar mensagens;
- Deletar mensagens;

Confira também o frontend dessa aplicação: [https://github.com/Nicoladla/BatePapo-UOL](https://github.com/Nicoladla/BatePapo-UOL).

**OBS**: A API usada nesse frontend não é a mesma deste repositório. Sendo assim, existem algumas divergências nas funcionalidades.

---

## Confira como usar os recursos da API:

#### 1- Cadastrar um usuário:

- Método: **`POST`**;
- Rota: **`/participants`**;

* Você deverá enviar pelo **body** da requisição um `name`, que deverá ser uma string, ter no mínimo 3 letras e não deve ser vazio:

  ```javascript
  {
    name: "Fulano";
  }
  ```

- O usuário será salvo no banco de dados com o seguinte formato:

  ```javascript
  {
    {name: 'Fulano', lastStatus: 12313123}
  }
  ```

  - **OBS**: o uso do `lastStatus` será explicado mais a frente.
  - **OBS**: O usuário cadastrado só existirá enquanto ele permanecer conectado ao servidor.

- Sempre que um novo usuário for cadastrado, será salvo automaticamente uma mensagem de status:

  ```javascript
  {
    from: 'xxx', to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'
  }
  ```

- Assim como, usuários que forem desconectados do servidor. Também será salvo uma mensagem automaticamente:

  ```javascript
  {
    from: 'xxx', to: 'Todos', text: 'sai da sala...', type: 'status', time: 'HH:MM:SS'
  }
  ```

- Status Code:

  - Ocorre quando tudo dá certo:

    ```
    status: 201
    ```

  - Ocorre quando o `name` é inválido:

    ```
    status: 422
    ```

  - Ocorre quando o usuário a ser cadastrado já existe:

    ```
    status: 409
    ```

  - Ocorre quando acontece algum erro no servidor:

    ```
    status: 500
    ```

    - **OBS**: esse erro também poderá aparecer nas próximas rotas.

#### 2- Para obter a lista de usuários:

- Método: **`GET`**;
- Rota: **`/participants`**;

* Será retornado a lista de todos os usuários ativos, exemplo:

  ```javascript
  [
    {
      _id: "65438bcf81ccb6b4c75167b1",
      name: "Fulano",
      lastStatus: 1698925519313,
    },
    {
      _id: "65438bd181ccb6b4c75167b3",
      name: "Siclano",
      lastStatus: 1698925521147,
    },
  ];
  ```

- Status Code: **200**

#### 3- Para enviar uma mensagem:

- Método: **`POST`**;
- Rota: **`/messages`**;

* Você deverá enviar pelo **body** da requisição, os parâmetros **to**, **text** e **type**:

  ```javascript
  {
    to: "Siclano",
    text: "Oi sumido rsrsrs",
    type: "private_message"
  }
  ```

  - **Observações**:

    - O **from** da mensagem, ou seja, o remetente, será enviado pelo `header` da requisição, chamado `User`;

    * **from** deve ser um participante existente na lista de participantes;
    * **type** só pode ser `message` ou `private_message`;
    * O **to** da messagem, ou seja, para quem a mensagem é destinada, deve ter mais que 2 letras.
    * **to** e **text** devem ser strings não vazias;

- Status Code:

  - Ocorre quando tudo dá certo:

    ```
    status: 201
    ```

  - Ocorre se algum dos campos for inválido:

    ```
    status: 422
    ```

#### 4- Para obter a lista de mensagens:

- Método: **`GET`**;
- Rota: **`/messages`**;

* Para obter a lista de mensagens, será necessário enviar um `header` chamado `User`, com o nome do usuário.

* Será retornada uma lista com todas as mensagens públicas e as mensagens do usuário (recebidas e enviadas). Exemplo:

  ```javascript
  [
    {
      _id: "6370c6ec78d7a8d238ae21a3",
      from: "Fulano",
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: "7:29:0",
    },
    {
      _id: "6370d6ddb0c655d20c36f41a",
      from: "Fulano",
      to: "Siclano",
      text: "Oi sumido rsrsrs",
      type: "private_message",
      time: "8:37:1",
    },
  ];
  ```

- Essa rota aceita um parâmetro via **query string**, onde você pode indicar quantas mensagens recentes deseja obter. O parâmetro se chama `limit` e nele é definido a quantidade.

- Confira como fica a url com esse parâmetro:

  ```
  localhost:5000/messages?limit=100
  ```

- Status Code: **200**

#### 5- Para deletar uma messagem:

- Método: **`DELETE`**;
- Rota: **`/messages/ID_DA_MENSAGEM`**;

* Para deletar uma mensagem, será necessário enviar um `header` chamado `User`, com o nome do usuário que deseja deletar a mensagem.

* Você deverá enviar pelo parâmetro da rota o `id` da mensagem a ser deletada. Exemplo:

  ```
  /messages/6370d6ddb0c655d20c36f41a
  ```

- Status Code:

  - Ocorre quando tudo dá certo:

    ```
    status: 200
    ```

  - Ocorre quando a mensagem a ser deletada não existe no banco de dados:

    ```
    status: 404
    ```

  - Ocorre quando o usuário não é o dono da mensagem:

    ```
    status: 401
    ```

#### 6- Para editar uma messagem:

- Método: **`PUT`**;
- Rota: **`/messages/ID_DA_MENSAGEM`**;

* Você deverá enviar pelo **body** da requisição, os parâmetros **to**, **text** e **type**:

  ```javascript
  {
    to: "Siclano",
    text: "Iae meu brother!",
    type: "private_message"
  }
  ```

  - **Observações**:

    - O **from** da mensagem, ou seja, o remetente, será enviado pelo `header` da requisição, chamado `User`, com o nome do usuário que deseja editar a mensagem.;

    * **from** deve ser um participante existente na lista de participantes;
    * **type** só pode ser `message` ou `private_message`;
    * O **to** da messagem, ou seja, para quem a mensagem é destinada, deve ter mais que 2 letras.
    * **to** e **text** devem ser strings não vazias;

* Você deverá enviar pelo parâmetro da rota o `id` da mensagem a ser editada. Exemplo:

  ```
  /messages/6370d6ddb0c655d20c36f41a
  ```

- Status Code:

  - Ocorre quando tudo dá certo:

    ```
    status: 200
    ```

  - Ocorre se algum dos campos for inválido:

    ```
    status: 422
    ```

    - Ocorre quando a mensagem a ser editada não existe no banco de dados:

    ```
    status: 404
    ```

  - Ocorre quando o usuário não é o dono da mensagem:

    ```
    status: 401
    ```

#### 7- Para manter o usuário conectado ao servidor:

- Método: **`POST`**;
- Rota: **`/status`**;

* **Observações**:

  - O `lastStatus` é usado para identificar a atividade do usuário no servidor.

  - A cada 15 segundos, o servidor verifica quais usuários estão com o `lastStatus` desatualizados em 10 segundos, ou seja, estão inativos a mais de 10 segundos. Caso isso aconteça, esses usuários serão removidos do servidor automaticamente.

* Para atualizar o status de um usuário, e evitar dele ser desconectado do servidor, será necessário enviar um `header` chamado `User`, com o nome do usuário a ter o status atualizado.

- Status Code:

  - Ocorre quando tudo dá certo:

    ```
    status: 200
    ```

  - Ocorre quando o usuário não existe na lista de usuários:

    ```
    status: 404
    ```

---

## Informações técnicas

### Observações:

- Esse projeto utiliza o banco de dados NoSQL **MongoDB**. Portanto você deverá ter ele instalado na sua máquina, para a execução correta da aplicação.

- Para fazer a instalação do MongoDB, você pode seguir algum tutorial pela internet, ou se preferir, você pode ir direto no [site oficial](https://www.mongodb.com/) do MongoDb.

- A versão do MongoDB usada nesse projeto foi a `v5.0.18`.

### Tecnologias utilizadas:

- **Desenvolvimento**:

  - Nodemon.

- **Produção**:
  - Node (v16.17.0);
  - Express;
  - Cors;
  - Dayjs;
  - Dotenv;
  - Joi;
  - MongoDB.

### Como iniciar o projeto na minha máquina?

- O primeiro passo é você fazer o download do projeto para sua máquina: [Download ZIP](https://github.com/Nicoladla/BatePapoUol-API/archive/refs/heads/main.zip)

- Ou então clonar esse repositório através do seu terminal:

  ```
  git clone https://github.com/Nicoladla/BatePapoUol-API.git
  ```

- Com o projeto na sua máquina, abra o seu editor de código favorito e então, dentro do seu projeto no seu terminal, execute o comando:

  ```
  npm install
  ```

- Com o MongoDB instalado em sua máquina, abra o seu terminal e inicie o servidor do Mongo com o seguinte comando:

  ```
  mongod --dbpath ~/.mongo
  ```

  - Enquanto o terminal estiver aberto, o servidor do Mongo estará ativo. Só assim a aplicação será capaz de persistir e acessar os dados corretamente.

- Também será necessário criar um arquivo `.env`, onde você colocará as variáveis de ambiente. Você deve usar como base as variáveis que estão no arquivo `.env.example`.

- Para usar o banco de dados da sua máquina você irá colocar o seguinte valor na variável **MONGO_URL**:

  ```
  mongodb://localhost:27017
  ```

- O próximo passo é você colocar o valor da porta, onde a sua máquina disponibilizará a aplicação, na variável **PORT_EXPRESS**:

  ```
  5000
  ```

  - **OBS**: Você pode usar qualquer porta que desejar, mas para esse guia use a porta indicada.

- Agora seu arquivo `.env` estará nesse formato:

  ```
  MONGO_URL= mongodb://localhost:27017
  PORT_EXPRESS = 5000
  ```

- Por fim, basta inicializar a aplicação:

  ```
  npm start
  ```

- Assim, ao executar esse comando, aparecerá no terminal o status da aplicação.

- Agora você poderá fazer requisições para a API, usando como base, a url:

  ```
  localhost:5000/
  ```
