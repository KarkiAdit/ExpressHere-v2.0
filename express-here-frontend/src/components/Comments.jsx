import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import "../styles/Comments.css";

const Comments = (props) => {
  const navigate = useNavigate() 
  const [postComments, setPostComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const initialRawInput = {
    id: 1,
    name: "comment",
    type: "text",
    placeholder: "Type your comment here...",
    required: false
  }

const onAlter = (e) => {
    setNewComment(e.target.value);
}
const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < charactersLength - 25; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const evaluateShowingThisCommentBox = (ID) => {
  return props.showingCommentsPostIDs.filter((checkID) => checkID == ID).length == 1; 
}

const handlePress = (e) => {
  if (e.key == 'Enter'){
      handleSubmit(e)
  }
}

const handleSubmit = async (e) => {
  if (!props.isLogged){
    navigate("/login")
  }
  e.preventDefault()
  if (newComment == ""){
    return 
  }
  const newID = generateRandomString();
  try{
      const response = await fetch(`http://127.0.0.1:5000/comment/${props.userID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({commentID: newID, commenterName: props.userName, associatedPostID: props.postID, commentBody: newComment}),
      })

      const responseJson = await response.json();
      console.log(responseJson)
      // If post added in database, update current comment for post and posts
      if (responseJson.status === 200) {
         fetchPostComments();
         try {
          const response = await fetch("http://127.0.0.1:5000/posts");
          const responseJson = await response.json();
          props.setPosts(responseJson.data);
        } catch (err) {
          console.log(err.message);
        }
      } 
      setNewComment("")
  } catch (err){
      console.log(err.message)
  }
}
  const fetchPostComments = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/comments/${props.postID}`);
        const responseJson = await response.json();
        console.log(responseJson.data)
        setPostComments([...responseJson.data]);
      } catch (err) {
        console.log(err.message);
      }
    }
    
  // fetch all the comments for the given post
  useEffect(() => {
      fetchPostComments();
  }, []);
  return (<>
  {<div className="comment-form">
    <form onSubmit={handleSubmit}>
        <FormInput
          key={initialRawInput.id}
          {...initialRawInput}
          value={newComment}
          onChange={onAlter}
          onClick={handlePress} 
          type="comment"
        />
        <input type="submit" value="Comment" className="btn solid" />
      </form>
    <div>
    {postComments && postComments.map((post) => {
      return(evaluateShowingThisCommentBox(props.postID) && <p className="prev-comments"><span className="commenter-name">{post.commenterName}</span> {post.commentBody}</p>)
    })}
    </div>
  </div>}
  </>)
};

export default Comments;

