import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./App.css";
import Discover from "./components/Discover";
import Share from "./components/Share";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserProfile from "./components/UserProfile";
function App() {
  const [user, setUser] = useState({
    userID: "",
    name: "",
    savedPostsIDs: [],
    userPostsIDs: [],
    password: "",
  });

  const [isLogged, setisLogged] = useState(false);
  const [posts, setPosts] = useState([]);

  // fetch all the posts everytime the app loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/posts");
        const responseJson = await response.json();
        setPosts(responseJson.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          index="/"
          element={
            <Discover
              user={user}
              posts={posts}
              setPosts={setPosts}
              isLogged={isLogged}
              changeLogStatus={(newStatus) => setisLogged(newStatus)}
              updateUser={(currentUser) => setUser(currentUser)}
              updatePosts={(currentPosts) => setPosts(currentPosts)}
            />
          }
        />
        <Route
          path="/share"
          element={
            <Share
              user={user}
              updateUser={(currentUser) => setUser(currentUser)}
              updatePosts={(newPost) => setPosts([...posts, newPost])}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              updateUser={(newUser) => setUser(newUser)}
              changeLogStatus={(newStatus) => setisLogged(newStatus)}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUp
              updateUser={(newUser) => setUser(newUser)}
              changeLogStatus={(newStatus) => setisLogged(newStatus)}
            />
          }
        />
        <Route
          path="/userprofile"
          element={
            <UserProfile
              user={user}
              posts={posts}
              isLogged={isLogged}
              changeLogStatus={(newStatus) => setisLogged(newStatus)}
              updateUser={(currentUsers) => setUser(currentUsers)}
              updatePosts={(currentPosts) => setPosts(currentPosts)}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
