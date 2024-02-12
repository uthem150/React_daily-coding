import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function Header(props) {
  //React에서 사용자 정의 태그는(component) 무조건 대문자
  return (
    <header>
      <h1>
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault(); //클릭해도 reload가 일어나지 않도록, 기본 동작 방지
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const lis = [];

  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      //동적으로 만드는 태그들은 key라는 prop을 가져야 하고, key는 반복문 안에서 unique해야 함.
      <li key={t.id}>
        <a
          id={t.id}
          href={"/read/" + t.id}
          onClick={(event) => {
            event.preventDefault(); //a태그를 클릭했을 때, 동작하지 않도록
            props.onChangeMode(Number(event.target.id)); //이벤트를 유발시킨 태그를 가리키고, 그 태그가 가진 id값 가져옴
          }}
        >
          {t.title}
        </a>
      </li>
    );
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function App() {
  //useState는 배열을 리턴 (상태, 함수)
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null); //초기값은 없음

  // 객체를 배열에 넣은 형식
  const topics = [
    { id: 1, title: "HTML", body: "HTML is ..." },
    { id: 2, title: "CSS", body: "CSS is ..." },
    { id: 3, title: "JavaScript", body: "JavaScript is ..." },
  ];

  let content = null;
  if (mode === "WELCOME") {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if (mode === "READ") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
  }

  return (
    <div>
      {/*Component 사용*/}
      <Header
        title="WEB"
        onChangeMode={() => {
          setMode("WELCOME"); //useState에서 지정한 함수
        }}
      ></Header>
      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          setMode("READ");
          setId(_id);
        }}
      ></Nav>
      {content}
    </div>
  );
}

export default App;
