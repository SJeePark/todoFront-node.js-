import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import TodoBoard from "./components/TodoBoard";

import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import api from "./utils/api";

function App() {

  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  const getTasks = async()=>{
    const response = await api.get("/tasks");
    console.log('rrrr', response);
    setTodoList(response.data.data);
  }
  
  const addTask = async() =>{
    try{
      const response = await api.post('/tasks', 
        {task:todoValue, 
        isComplete: false})
        if(response.status === 200){
          console.log("성공")
          // 1. 입력한 값이 안사라짐
          setTodoValue("")
          // 2. 추가한 값이 안보임임
          getTasks();
        }else{
          throw new Error('task can not be added')
        }
    }catch(err){
      console.log("error", err)
    }
  }

  //id값 받아오기
  //isComplete true로 바꿈
  //버튼 누르면 isComplete 변환, 함수 작동동
  const updateTask = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  //id값 가져오기
  //끝남 버튼 누르면 isComplete true로 변환
  //if문으로 true면 작동
  const deleteTask = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        console.log("delete ok");
        getTasks();
      }
    } catch (err) {
      console.log("delete error", err);
    }
  };

  useEffect(()=>{
    getTasks();
  },[])

  return (
    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            className="input-box"
            value={todoValue}
            onChange={(event)=>{
              setTodoValue(event.target.value)
            }}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button className="button-add" onClick={addTask}>추가</button>
        </Col>
      </Row>

      <TodoBoard 
      todoList={todoList}
      deleteTask = {deleteTask}
      updateTask = {updateTask}
      />
    </Container>
  );
}

export default App;
