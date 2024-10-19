import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import ListToDoLists from "./ListTodoLists";
import ToDoList from "./ToDoList";
import TechBoard from "./TechBoard";

function App() {
  const [listSummaries, setListSummaries] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [techBoard, setTechBoard] = useState(null);

  useEffect(() => {
    reloadData().catch(console.error);
    reloadTechBoard().catch(console.error);
  }, []);

  async function reloadData() {
    const response = await axios.get("/api/lists");
    const data = await response.data;
    setListSummaries(data);
  }

  async function reloadTechBoard() {
    const response = await axios.get("/api/techposts");       
    const data = await response.data;
    console.log(data);
    setTechBoard(data);
  }

  function handleNewToDoList(newName) {
    const updateData = async () => {
      const newListData = {
        name: newName,
      };

      await axios.post(`/api/lists`, newListData);
      reloadData().catch(console.error);
    };
    updateData();
  }

  function handleNewTechPost(newTitle, newContent) {
    const updateData = async () => {
      const newTechPostData = {
        title: newTitle,
        content: newContent,
      };

      await axios.post(`/api/techposts`, newTechPostData);
      reloadTechBoard().catch(console.error);
    };
    updateData();
  }

  function handleDeleteToDoList(id) {
    const updateData = async () => {
      await axios.delete(`/api/lists/${id}`);
      reloadData().catch(console.error);
    };
    updateData();
  }

  function handleSelectList(id) {
    console.log("Selecting item", id);
    setSelectedItem(id);
  }

  function handleSelectTechPost(id) {
    console.log("Selecting tech post", id);
    setSelectedItem(id);
  }

  function backToList() {
    setSelectedItem(null);
    reloadData().catch(console.error);
  }

  if (selectedItem === null) {
    return (
      <div className="App">
        <TechBoard
          techBoard={techBoard}
          handleSelectTechPost={handleSelectTechPost}
          handleNewTechPost={handleNewTechPost}
        />
      </div>
    );
  } else {
    return (
      <div className="App">
        <ToDoList listId={selectedItem} handleBackButton={backToList} />
      </div>
    );
  }
}

export default App;