import './App.css';

import {useState, useEffect} from "react";
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';

const API = "http://localhost:5000";

function App() {
    /* Isso aqui é o título da tarefa, inicialmente
  ela começa como uma string vazia.*/
  const [title, setTitle] = useState("");

  /* Aqui é o tempo que vai levar para fazer a
  tarefa, setada pelo usuário */
  const [time, setTime] = useState("");

  /* Aqui são os Todos propriamente ditos, declara
  como um array */
  const [todos, setTodos] = useState([]);

  /* Isso é para uma animação de Loading */
  const [loading, setLoading] = useState(false);

  //Carregar os Todos no carregamento da página
  useEffect(() => {
    const loadData = async () =>{
      setLoading(true);
      
      //Variável que vai guardar os dados do fetch
      /* 
      No primeiro then, vamos esperar uma resposta
      e transformar essa resposta em json.
      No segundo then, ele vai pegar a resposta
      chamando a resposta de data, e vai retornar
      esses dados
      O catch vai pegar algum possível erro e
      imprimir no console
      */
      const res = await fetch(API + "/todo").then((res) => res.json()).then((data) => data).catch((err) => console.log(err));

      /*a função await ta esperando tudo ser carregado para
      poder voltar ao fluxo de execução. depois disso, só
      tirar o loading*/
      setLoading(false);

      setTodos(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    /*Com o método preventDefault, conseguimos parar o envio do
    formulário, deixando ele no fluxo da SPA */
    e.preventDefault();
    
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }

    /*Enviando os dados para a API, com JS puro!*/
    //method post pq estamos enviando dados
    /*JSON.stringify(todo) manda nosso objeto para o body
    como uma string */
    /* o headers define um cabeçalho com o padrão JSON
    para se comunicar */
    await fetch(API + "/todo", {
    method: "POST",
    body: JSON.stringify(todo),
    headers:{
      "Content-Type": "application/json",
    },
    });

    /*
     prevState -> estado anterior do item que você está trabalhando, você adiciona um novo item ao estado anterior e gera um novo estado
     */
    setTodos((prevState) => [...prevState, todo]);

    /* Isso aqui vai limpar o input, podemos fazer por causa
    do controled input que definimos lá embaixo*/
    setTitle("");
    setTime("");
  }

  /*
  Isso aqui vai excluir uma tarefa quando o usuário
  clicar na lixeira
  */
  const handleDelete = async (id) => {
    await fetch(API + "/todo/" + id, {
      method: "DELETE",
      });
      
      /* Aqui, utilizamos o filter para pegar todos os todos e fazer uma comparação. Se o id do todo for diferente do id que veio pela requisição, você retorna esse todo.
      Basicamente vai imprimir no front todos os todos que tiverem id diferente daquele a ser deletado. Sendo deletado também no Backend. */
      setTodos((prevState) => prevState.filter((todo) => todo.id!== id));
    };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todo/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers:{
        "Content-Type": "application/json",
      },
      });
      
      /*
      O map chama todos os Todo 't', dentro do map vai precisar dos dados da atualização (data ali em cima), pegando os dados que vem do banco.
      Se o t.id for igual ao data.id (tarefa do backend), atualiza o objeto pelo oq veio do backend (t = data), se não t continua como está.
      */
      setTodos((prevState) => prevState.map((t) => (t.id === data.id? (t = data) : t)));
  };

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React Todo</h1>
      </div>

      <div className="form-todo">
        <h2>Insira sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input
              type="text"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>
          <input type="submit" value="Criar tarefa"/>
        </form>
      </div>

      <div className="list-todo">
        <h2>Lista de todos</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done? "todo-done" : "todo-not-done"}>{todo.title}</h3>
            <p>Duração: {todo.time > 1 ? `${todo.time} horas` : `${todo.time} hora`}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
