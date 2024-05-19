//import config from "../config";
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom'
import logo from './../logo.png';
import './../App.css';
//import { Redirect } from "react-router-dom";
//import { AuthContext } from "./Auth";
import Button from '@material-ui/core/Button';

const MainPage = () => {

  const history = useHistory();

  function handleClick() {
  //var mywindow = window.open("/login", "NewWindow", "height=700,width=1720")
   // history.push("/login");
    sessionStorage.setItem("checkname", "guest");
    history.push("/systemcheck")
  }

  function handleClickDetect() {
    history.push("/detections")
  }


  // function handleClickDetect2() {
  //   history.push("/detections2")
  // }

  function handleClickAdmin() {
    //history.push("/adminsignin")
    history.push("/admin")
  }


  function headpose() {
    history.push("/posenet")
  }

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const handleOnChangeUsername=(e)=>{
    setUsername(e.target.value);
}
const handleOnChangePassword=(e)=>{
  setPassword(e.target.value);
}
  return (
    <div className='mainDiv' style={{display:"flex",width:"100%",height:"100vh"}}>

      {/* <header className="App-header">
        <img src={logo} alt="logo" />

        <p>
          Welcome to GodsEye
        </p>
        <small>
          AI Enabled Virtual Examination System
        </small>

        <Button id="homeButtons" style={{ fontSize: '15px' }} variant="contained" size="medium" onClick={handleClick}>All the Best</Button>
        <Button id="homeButtons" variant="contained" onClick={handleClickAdmin}>Admin</Button>
        <Button id="homeButtons" variant="contained" onClick={headpose}>Headpose</Button>
      </header> */}

      <div className='one' style={{width:"50%",backgroundColor:"#017ed5",height:"100%"}}>
      <div className='write-up' style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"35%",color:"white",fontFamily:"poppins"}}>
      <div style={{ maxWidth: '500px', textAlign: 'center', lineHeight: '1.6' }}>
          <h2 style={{ fontSize: '2.5em', marginBottom: '0.5em' }}>Welcome to Quizify</h2>
          <h4 style={{ fontSize: '1.5em', marginBottom: '1em' }}>The Ultimate Online Test Platform</h4>
          <p style={{ fontSize: '1.25em', marginBottom: '1em' }}>
            Quizify is your go-to solution for all your testing needs. Whether you're a student preparing for exams, a professional seeking certifications, or a company conducting employee assessments, Quizify provides a seamless, intuitive, and secure platform for taking tests online.
          </p>
        </div>
        </div>
      </div>
      <div className='two' style={{width:"50%",height:"100%",position:"relative",fontFamily:"poppins"}}>
      <div className="background" style={{
          width: "430px",
          height: "520px",
          position: "absolute",
          transform: "translate(-50%,-50%)",
          left: "50%",
          top: "50%"
        }}>
          <div className="shape" style={{
            height: "200px",
            width: "200px",
            position: "absolute",
            borderRadius: "50%",
            background: "linear-gradient(#1845ad, #23a2f6)",
            left: "-80px",
            top: "-80px"
          }}></div>
          <div className="shape" style={{
            height: "200px",
            width: "200px",
            position: "absolute",
            borderRadius: "50%",
            background: "linear-gradient(to right, #ff512f, #f09819)",
            right: "-30px",
            bottom: "-80px"
          }}></div>
        </div>
        <form style={{
          height: "520px",
          width: "400px",
          backgroundColor: "rgba(255,255,255,0.13)",
          position: "absolute",
          transform: "translate(-50%,-50%)",
          top: "50%",
          left: "50%",
          borderRadius: "10px",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 40px rgba(8,7,16,0.6)",
          padding: "50px 35px"
        }}>
          <h3 style={{ fontSize: "32px", fontWeight: "500", lineHeight: "42px", textAlign: "center", color: "black" }}>Login</h3>

          <label htmlFor="username" style={{ display: "block", marginTop: "30px", fontSize: "16px", fontWeight: "500", color: "#ffffff" }}>Username</label>
          <input type="text" placeholder="Email or Phone" id="username" value={username} onChange={handleOnChangeUsername} style={{
            display: "block",
            height: "50px",
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.07)",
            borderRadius: "3px",
            padding: "0 10px",
            marginTop: "8px",
            fontSize: "14px",
            fontWeight: "300",
            color: "black",
            border:"1px solid black"
          }}/>

          <label htmlFor="password" style={{ display: "block", marginTop: "30px", fontSize: "16px", fontWeight: "500", color: "#ffffff" }}>Password</label>
          <input type="password" placeholder="Password" id="password" value={password} onChange={handleOnChangePassword} style={{
            display: "block",
            height: "50px",
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.07)",
            borderRadius: "3px",
            padding: "0 10px",
            marginTop: "8px",
            fontSize: "14px",
            fontWeight: "300",
            color: "black",
            border:"1px solid black"
          }}/>

          <button onClick={handleClick} style={{
            marginTop: "50px",
            width: "100%",
            backgroundColor: "#017ed5",
            color: "white",
            padding: "15px 0",
            fontSize: "18px",
            fontWeight: "600",
            borderRadius: "5px",
            cursor: "pointer",
            border:"none"
          }}>Log In</button>
          <div className="social" style={{ marginTop: "30px", display: "flex" }}>
            <div className="go" style={{
              background: "red",
              width: "150px",
              borderRadius: "3px",
              padding: "5px 10px 10px 5px",
              backgroundColor: "#017ed5",
              color: "#eaf0fb",
              textAlign: "center",
              cursor: "pointer",
              border:"none"
            }}><i className="fab fa-google" style={{ marginRight: "4px" }}></i>  Google</div>
            <div className="fb" style={{
              marginLeft: "25px",
              background: "red",
              width: "150px",
              borderRadius: "3px",
              padding: "5px 10px 10px 5px",
              backgroundColor: "#017ed5",
              color: "#eaf0fb",
              textAlign: "center",
              cursor: "pointer",
              border:"none"
            }}><i className="fab fa-facebook" style={{ marginRight: "4px" }}></i>  Facebook</div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MainPage;
