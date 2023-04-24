import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "../styles/Discover.css";
import Comments from "./Comments";

const Discover = (props) => {
  const navigate = useNavigate()

  const handleComments = (e) =>{
    return
  }
  const handleSaves = async(e) =>{
    e.preventDefault()
    // if not logged, ask user to first login
    if (!props.isLogged){
      navigate("/login")
    }
    try{
      console.log(e.target.getAttribute('value1'))
        const response = await fetch(`http://127.0.0.1:5000/discover/saveposts/${props.user.userID}`, {
        method: "PUT",
        body: JSON.stringify({postID: e.target.getAttribute('value1'), saves: e.target.getAttribute('value2')}),
        headers: { "Content-Type": "application/json" },
        })
    
        const responseJson = await response.json();
        console.log(responseJson)
        // If post added in database, update current posts
        if (responseJson.status === 200) {
            props.updatePosts(responseJson.data)
        } 
    } catch (err){
        console.log(err.message)
    }
  }
  
  const evaluateDateAndTime = ((dateAndTime) => {
    const dateTime = new Date(dateAndTime).toUTCString()
    return dateTime
  })

  return (<>
  <NavBar isLogged={props.isLogged} user={props.user} updateUser={props.updateUser} changeLogStatus={props.changeLogStatus}/>
  <main className="blog-card-container discover-card">
  {props.posts.map((post, idx) => {
    return (<article className="blog-card full-width">
    <div className="header">
      <div className="sub-header">
        <img src="https://img.icons8.com/office/40/000000/comments.png"/> 
        <button className="secondary-button" onClick={handleComments} value={post.postID}>{post.comments} Comments</button>
      </div>
      <div className="sub-header">
        <img src="https://img.icons8.com/3d-fluency/40/null/save.png"/>
        <button className="secondary-button" onClick={handleSaves} value1={post.postID} value2={post.saves}>{post.saves} Saves</button>
      </div>
    </div>
    <p>
      {post.post}
    </p>
    <footer className="author">
      <address>{post.author}</address>
      <span> on </span>
      <time>{evaluateDateAndTime(post.createdAt)}</time>
    </footer>
    <Comments className="text-area" postID={post.postID} userID={props.user.userID} commentsIDs={post.postCommentsIDs}/>
  </article>
  )})}
  </main>
  </>)
};

export default Discover;

