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

**1- Cadastrar um usuário:**

- Método: **`POST`**;
- Rota: **`/participants`**;

* Você deverá enviar pelo **body** da requisição um `name`, que deverá ser uma string, ter no mínimo 3 letras e não deve ser vazio:

  ```javascript
  {
    name: "Fulano"
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
