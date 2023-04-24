import React from "react";
import '../styles/UserProfile.css'
import NavBar from './NavBar';
import MainDash from './MainDash';
import SideBar from './SideBar';

function UserProfile(props) {
  return(<>
  <NavBar isLogged={props.isLogged} user={props.user} updateUser={props.updateUser} changeLogStatus={props.changeLogStatus}/>
  <div class="grid-parent">
    <section class="sidebar">
        <h1 className='userprofile-heading'>SAVED</h1>
        <SideBar user={props.user}
              posts={props.posts}
              isLogged={props.isLogged}
              changeLogStatus={props.changeLogStatus}
              updateUser={props.updateUser}
              updatePosts={props.updatePosts}/>
    </section>
    <section class="main-content">
        <h1 className='userprofile-heading feed-heading'>YOUR FEED</h1>
        <MainDash user={props.user}
              posts={props.posts}
              isLogged={props.isLogged}
              changeLogStatus={props.changeLogStatus}
              updateUser={props.updateUser}
              updatePosts={props.updatePosts}/>
    </section>
  </div>

  </>);
}

export default UserProfile;