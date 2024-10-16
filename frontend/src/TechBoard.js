//import "./ListTodoLists.css";
import { useRef } from "react";
// import { BiSolidTrash } from "react-icons/bi";

function TechBoard({
  techBoard,
  handleSelectTechPost,
  handleNewTechPost,
}) {
  const titleRef = useRef();
  const contentRef = useRef();

  if (techBoard === null) {
    return <div className="TechBoard loading">Loading TechBoard lists ...</div>;
  } 
  else if (techBoard.length === 0) {
    return (
      <div className="TechBoard">
        <h1>Tech Board</h1>
          <div className="box">
          <label>
            New Tech Post:&nbsp;
            <input id={titleRef} type="text" />
            <input id={contentRef} type="text" />
          </label>
          <button
            onClick={() =>
              handleNewTechPost(document.getElementById(titleRef).value, document.getElementById(contentRef).value)
            }
          >
            Post
          </button>
          </div>
        <p>Welcome to Tech Board!</p>
      </div>
    );
  }
  return (
    <div className="TechBoard">
      <h1>Tech Board</h1>
      <div className="box">
          <label>
            New Tech Post:&nbsp;
            <input id={titleRef} type="text" />
            <input id={contentRef} type="text" />
          </label>
          <button
            onClick={() =>
              handleNewTechPost(document.getElementById(titleRef).value, document.getElementById(contentRef).value)
            }
          >
            Post
          </button>
          </div>
      {techBoard.map((post) => {
        return (
          <div
            key={post.id}
            className="summary"
            onClick={() => handleSelectTechPost(post.id)}
          >
            <span className="name">{post.title} </span>                      (//TODO: change to post.title)
            (//<span className="count">({post.comment_count} comments)</span>)                 (//TODO: change to post.comment_count)
            <span className="flex"></span>
            
          </div>
        );
      })}
    </div>
  );
}

export default TechBoard;