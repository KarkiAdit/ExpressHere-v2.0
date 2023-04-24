import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Share.css";
import NavBar from "./NavBar";
import FormInput from "./FormInput";
import SelectInput from "./SelectInput";

const Share = (props) => {
  let navigate = useNavigate()
  const initialValue = {
      postID: `55${generateUID()}671`,
      author: `${props.user.name}`,
      post: "",
      postType: false,
      highlight: "Happy",
    };

    function generateUID() {
      var firstPart = (Math.random() * 46656) | 0;
      var secondPart = (Math.random() * 46656) | 0;
      firstPart = ("000" + firstPart.toString(36)).slice(-3);
      secondPart = ("000" + secondPart.toString(36)).slice(-3);
      return firstPart + secondPart;
  }
  
  
  const [values, setValues] = useState(initialValue)

  const inputs = [
    {
      id: 1,
      name: "post",
      type: "text",
      placeholder: "I'm feeling...",
      required: true
    },
    {
      id: 3,
      name: "highlight",
      default: "Happy",
      label: "Highlights",
      options: [
        {
          value: "Happy",
          emo: "😊" 
        },
        {
          value: "Sad",
          emo: "😞" 
        },
        {
          value: "Puzzled",
          emo: "😬" 
        },
        {
          value: "Love",
          emo: "😍" 
        },
        {
          value: "Sick",
          emo: "🤒" 
        },
        {
          value: "Thoughful",
          emo: "🧐" 
        },
        {
          value: "Angry",
          emo: "😡" 
        }
      ],
      required: true
    }
  ];

  const onAlter = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
      console.log(values)
}

const handleSubmit = async (e) => {
  e.preventDefault()
  try{
      const response = await fetch(`http://127.0.0.1:5000/share/${props.user.userID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      })

      const responseJson = await response.json();
      console.log(responseJson)
      // If post added in database, update current posts
      if (responseJson.status === 200) {
          props.updatePosts(responseJson.data)
          navigate("/") // navigate back to the previous page   
      } 
  } catch (err){
      console.log(err.message)
  }
}
  return (
    <>
      <NavBar />
      <div className="share-section">
        <form onSubmit={handleSubmit}>
          <FormInput
            key={inputs[0].id}
            {...inputs[0]}
            value={values[inputs[0].name]}
            onChange={onAlter}
          />
          <h2>Highlights</h2>
          <SelectInput 
            key={inputs[1].id}
            {...inputs[1]}
            value={values[inputs[1].name]}
            onChange={onAlter}/>
          <h2>Make post</h2>
          <div class="postType">
            <label for="anon">Anonymous</label>
            <input name="postType" type="radio" value="anonymous" id="anon" onChange={e => setValues({...values, postType: false})} required="true"></input>
          </div>
          <div className="postType">
            <label for="userN">By My Name</label>
            <input name="postType" type="radio" value="username" id="userN" onChange={e => setValues({...values, postType: true})} required="true"></input>
          </div>
          <input type="submit" value="Submit" className="btn solid" />
        </form>
      </div>
    </>
  );
};

export default Share;