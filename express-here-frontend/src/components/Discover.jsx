import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "../styles/Discover.css";
import Comments from "./Comments";

const Discover = (props) => {
  const initialPostsData = [...props.posts]
  const [activePosts, setActivePosts] = useState(initialPostsData);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate() 
  const [showingCommentsPostIDs, setShowingCommentsPostIDs] = useState(null);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
    // if (searchInput == ""){
    //   setActivePosts([...initialPostsData])
    //   return;
    // }
    // let showingPosts = props.posts.filter((post) => {
    //   if (post.post.includes(searchInput)){
    //     return post;
    //   }
    // })
    // console.log(showingPosts);
    // if (showingPosts.length == 0){
    //   setActivePosts([...initialPostsData])
    // } else {
    //   setActivePosts([...showingPosts])
    // }
    // console.log(activePosts)
  }

  const handleCommentsClick = (e) =>{
    let currentCommentPostID = e.target.value;
    if (!showingCommentsPostIDs){
      setShowingCommentsPostIDs([currentCommentPostID]);
    } else if (!showingCommentsPostIDs.filter((ID) => ID == currentCommentPostID).length == 1){
      setShowingCommentsPostIDs([...showingCommentsPostIDs, currentCommentPostID]);
    } else {
      let filteredIDs = showingCommentsPostIDs.filter((ID) => ID != currentCommentPostID);
      setShowingCommentsPostIDs([...filteredIDs]);
    }
    console.log(showingCommentsPostIDs);
  }

  const handleSaves = async(e) =>{
    e.preventDefault()
    // if not logged, ask user to first login
    if (!props.isLogged){
      navigate("/login")
    }
    try{
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

  const chooseEmo = (highlight) => {
    switch (highlight) {
      case "Happy":
        return "😊" 
      case "Sad":
        return "😞" 
      case "Puzzled":
        return "😬" 
      case "Love":
        return "😍" 
      case "Sick":
        return "🤒" 
      case "Thoughtful":
        return "🧐" 
      case "Angry":
        return "😡" 
      case "Sad":
        return "😞" 
    } 
  }
  
  const evaluateDateAndTime = ((dateAndTime) => {
    const dateTime = new Date(dateAndTime).toUTCString()
    return dateTime
  })

  useEffect(() => {
    if (searchInput == ""){
      setActivePosts([...initialPostsData])
      return;
    }
    let showingPosts = props.posts.filter((post) => {
      if (post.post.includes(searchInput)){
        return post;
      }
    })
    console.log(showingPosts);
    if (showingPosts.length == 0){
      setActivePosts([...initialPostsData])
    } else {
      setActivePosts([...showingPosts])
    }
    console.log(activePosts)
  }, [searchInput])

  useEffect(() => {
    setActivePosts([...initialPostsData])
  }, [props.posts])

  return (<>
  <NavBar setSearchInput={handleSearchInputChange} searchInput={searchInput} isLogged={props.isLogged} user={props.user} updateUser={props.updateUser} changeLogStatus={props.changeLogStatus}/>
  <main className="blog-card-container discover-card">
  {activePosts && activePosts.map((post) => {
    return (<article className="blog-card full-width">
    <div className="header">
      <div className="sub-header">
        <img src="https://img.icons8.com/office/40/000000/comments.png"/> 
        <button className="secondary-button" onClick={handleCommentsClick} value={post.postID}>{post.postCommentsIDs.length} Comments</button>
      </div>
      <div className="sub-header">
        <img src="https://img.icons8.com/3d-fluency/40/null/save.png"/>
        <button className="secondary-button" onClick={handleSaves} value1={post.postID} value2={post.saves}>{post.saves} Saves</button>
      </div>
    </div>
    <p>
      {post.post}
      <span classname="highlight">{chooseEmo(post.highlight)+chooseEmo(post.highlight)+chooseEmo(post.highlight)}</span>
    </p>
    <footer className="author">
      <address>{post.author}</address>
      <span> on </span>
      <time>{evaluateDateAndTime(post.createdAt)}</time>
    </footer>
    {showingCommentsPostIDs && <Comments userName={props.user.name} isLogged={props.isLogged} setPosts={props.setPosts} showingCommentsPostIDs={showingCommentsPostIDs} className="text-area" postID={post.postID} userID={props.user.userID} commentsIDs={post.postCommentsIDs}/>}
  </article>
  )})}
  </main>
  </>)
};

export default Discover;

