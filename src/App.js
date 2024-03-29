import logo from "./logo.svg";
import "./App.css";
// 값이 바뀌면 화면이 Reload될 수 있도록 state사용하기
import { useState } from "react";

//사용자 정의태그 생성
//React에서 사용자 정의 태그는(component) 무조건 대문자
function Header(props) {
  return (
    <header>
      <h1>
        {/* html문법이 아닌 리액트 문법으로 onClick={함수} */}
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault(); //a태그를 클릭했을 때, Reload하지 않도록
            props.onChangeMode(); //props로 받은 onChangeMode함수 호출
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
      // 동적으로 만드는 태그들은 key라는 prop을 가져야 하고, key는 반복문 안에서 unique해야 함.
      // React는 자동으로 생성하는 태그를 추적할 때, 근거가 필요함 -> 그게 key
      <li key={t.id}>
        <a
          id={t.id}
          href={"/read/" + t.id}
          onClick={(event) => {
            event.preventDefault();

            // 함수 안에서 이벤트 속성의 id값을 얻어내기
            // 이벤트가 가지고 있는 id값을 가져오기
            props.onChangeMode(Number(event.target.id)); //값을 태그의 속성으로 넘기면 문자가 됨
          }}
        >
          {t.title}
        </a>
      </li>
    );
  }
  return (
    <nav>
      {/* 배열을 넣어주면, 하나씩 꺼내서 배치시켜줌 */}
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

function Create(props) {
  return (
    // Article 컴포넌트가 아닌, article태그임.
    <article>
      <h2>Create</h2>
      {/* 정보를 서버로 전송할 때, 사용하는 form태그 */}

      <form
        // onSubmit은 submit버튼을 클릭했을 때, form태그에서 발생하는 이벤트
        onSubmit={(event) => {
          event.preventDefault(); // 하지 않으면 페이지가 새로고침 되어버림

          //form태그 안에서 발생하기 때문에, event타겟은 form태그
          const title = event.target.title.value; //name이 title의 태그의 값을 가져옴
          const body = event.target.body.value;

          // onCreate함수를 통해, 작성한 title, body의 값을 제공
          props.onCreate(title, body);
        }}
      >
        {/* 서로 블록처럼 쌓이는 형태로 만들기 위해, p태그로 각각을 감쌈 */}
        <p>
          {/* placeholder은 어떤 속성을 입력해야 하는지 알려주는 것 */}
          <input type="text" name="title" placeholder="title"></input>
        </p>
        <p>
          {/* 여러줄을 적는 본문은 textarea */}
          <textarea name="body" placeholder="body" cols="35"></textarea>
        </p>
        <p>
          {/* value는 버튼에 적힐 값 */}
          <input type="submit" value="Create"></input>
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  // props로 받은 값을 내부에서 변경할 수 있도록, prop -> state로 환승
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title} //props.title이 아닌 state title
            onChange={(event) => {
              // 새로운 값을 입력할 때 마다, setTitle로 Title을 지정
              setTitle(event.target.value);
            }}
          ></input>
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            cols="35"
            value={body} //props.body가 아닌 state body
            onChange={(event) => {
              setBody(event.target.value);
            }}
          ></textarea>
        </p>
        <p>
          <input type="submit" value="Update"></input>
        </p>
      </form>
    </article>
  );
}

function App() {
  // 일반적인 지역변수는 변경이 되지 않지만, state는 변경이 됨
  // const mode = "WELCOME";
  //useState는 배열을 리턴 (상태, 함수)

  //0번째 값이 상태의 값
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4); //기본으로 3개가 있으니, 다음으로 생성될 Id는 4

  // 변경사항이 있으면, 바뀔 수 있도록 state로 승격
  const [topics, setTopics] = useState([
    { id: 1, title: "HTML", body: "HTML is ..." },
    { id: 2, title: "CSS", body: "CSS is ..." },
    { id: 3, title: "JavaScript", body: "JavaScript is ..." },
  ]);

  let content = null;
  let contextControl = null; //맥락적으로 만들어지는 ui -> update가 특정 상황에만 보이도록

  if (mode === "WELCOME") {
    // Home
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if (mode === "READ") {
    // 상세보기
    let title,
      body = null;

    // topics배열의 값 중에, setId로 변경한 id와 일치하는 값을 찾아서, title과 body값으로 세팅해줌.
    for (let i = 0; i < topics.length; i++) {
      //topics의 id과 id state의 값이 일치하면,
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = (
      <>
        <li>
          <a
            href={"/update/" + id}
            onClick={(event) => {
              event.preventDefault();
              setMode("UPDATE");
            }}
          >
            Update
          </a>
        </li>
        <li>
          <input
            type="button"
            value="Delete"
            onClick={() => {
              let result = window.confirm("정말로 삭제하시겠습니까?");
              if (result == true) {
                const newTopics = [];
                for (let i = 0; i < topics.length; i++) {
                  if (topics[i].id !== id) {
                    newTopics.push(topics[i]); // id값이 일치하지 않는 값들만 push -> 원하는 것만 있는 새 배열 만들기
                  }
                }
                setTopics(newTopics); // 새로운 배열로 바꿔주기
                setMode("WELCOME"); // 삭제하고 나면, 초기화면으로
              } else {
                alert("취소되었습니다.");
              }
            }}
          ></input>
        </li>
      </>
    );
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          // topics가 객체(배열)이기 때문에, 복제본을 만들고
          const newTopics = [...topics];

          //복제본에 새로운 내용을 추가한 뒤
          newTopics.push(newTopic);

          // 완성된 복제본을 setTopics로 전달
          setTopics(newTopics);

          //글을 추가한 뒤, 추가한 글의 상세페이지로 이동
          setMode("READ");
          setId(nextId);

          // 또 새로운 글을 추가할 경우를 위해, nextId++
          setNextId(nextId + 1);
        }}
      ></Create>
    ); //별도의 컴포넌트로 만들 것임.
  } else if (mode === "UPDATE") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    // 기존의 title, body값, onUpdate함수를 props로 보냄
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          const newTopics = [...topics]; //topics가 객체이기 때문에 복제

          //READ를 한 상태에서만, UPDATE가 실행될 수 있기 때문에,
          // READ에서 받은 id를 가져올 수 있음.
          const updatedTopic = { id: id, title: title, body: body };

          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id === id) {
              newTopics[i] = updatedTopic;
              break; //완료 했다면 이후는 안찾아봐도 되므로 break
            }
          }
          setTopics(newTopics);
          setMode("READ"); //update이후 상세보기로 이동
        }}
      ></Update>
    ); //업데이트 컴포넌트 출력
  }
  return (
    <div>
      {/*Component에 속성(prop) 넣기*/}
      {/* props에 onChangeMode에는 함수를 넣어서, 동작할 일을 정해줌 */}
      <Header
        title="WEB"
        onChangeMode={() => {
          setMode("WELCOME"); //값이 바뀌면 상태도 바뀌도록 하기 위해 state의 상태변경 함수 사용
        }}
      ></Header>
      {/* topics 변수를 Nav 컴포넌트에 prop으로 전달. */}
      <Nav
        topics={topics}
        // nav 컴포넌트로부터 받은 이벤트 아이디값을 이용해, setId
        onChangeMode={(_id) => {
          setMode("READ");
          setId(_id);
        }}
      ></Nav>
      {content}
      <ul>
        <li>
          {/* create 기능 구현 */}
          <a
            href="/create"
            onClick={(event) => {
              event.preventDefault();
              setMode("CREATE"); //mode값을 CREATE로 바꾸고, App component가 다시 실행되면서, 해당되는 기능 실행
            }}
          >
            Create
          </a>
        </li>

        {/* update 기능 구현 */}
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
