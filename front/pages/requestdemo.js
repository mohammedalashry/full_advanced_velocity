import { useState } from "react";
import styles from "../styles/Requestdemo.module.css";
import { useRouter } from 'next/router'
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Requestdemo({data,catogrisTypes}) {
  const router = useRouter();
  const splitCatogries = catogrisTypes[0].description.split(",");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [phoneNumber,setPhoneNumber] = useState("");
  const [email,setEmail] = useState("");
  const [message,setMessage] = useState("");
  const [company,setCompany] = useState("");
  const [propertyYouOwn,setPropertyYouOwn] = useState("");
  const [interestedInLearning,setInterestedInLearning] = useState([]);

  

  const submitRequest = async (e)=>{
     e.preventDefault();
    let uniqueChars = [...new Set(interestedInLearning)];
    let uniqueInterest = `${uniqueChars}`;
    let requestData = {
      firstName,
      lastName,
      phoneNumber,
      email,
      message,
      company,
      propertyYouOwn,
      interestedInLearning:uniqueInterest
    };
    let  validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


    if(firstName !== "" && email !== ""&& phoneNumber !== "" && lastName !== ""){
      if(email.match(validRegex)){
    await axios.post("https://advanced-velocity.herokuapp.com/request-demos ",requestData).then((db)=>{
      setCompany("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setEmail("");
      setInterestedInLearning([]);
      setPropertyYouOwn("");
      setMessage("");
      toast.success("We have recieved your message");
    });
  }else{
    toast.error("Your email address is invalid");
  }
  }else{
    toast.error("Please make sure all fields are filled in correctly");
  }
  }

  return (
    <>
      <ToastContainer />
      <div className={`container-fluid ${styles.container}`}>
        <div className="container">
     
         <div className={styles.title}>Request a DEMO or a QUOTE</div>
          <div className={styles.close}  onClick={() => router.back()}>
              <img className={styles.buttonClose} src="/button_close.svg" alt="Card image cap"/>
          </div>
          
          <div className={styles.header}>Please complete the form</div>

          <form className={styles.form}>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className={styles.label}>First Name</div>
                <input type="text" onChange={(e)=>setFirstName(e.target.value)} defaultValue={firstName} className={styles.input} name="fname" />
              </div>

              <div className="col-12 col-md-6">
                <div className={styles.label}>Last Name:</div>
                <input type="text" className={styles.input}  defaultValue={lastName} onChange={(e)=>setLastName(e.target.value)} name="lname" />
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <div className={styles.label}>Email:</div>
                <input type="email"   defaultValue={email}  onChange={(e)=>setEmail(e.target.value)}  className={styles.input} name="email" />
              </div>

              <div className="col-12 col-md-6">
                <div className={styles.label}>Phone Number:</div>
                <input type="text"  defaultValue={phoneNumber}  onChange={(e)=>setPhoneNumber(e.target.value)} className={styles.input} name="phone" />
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <div className={styles.label}>Company:</div>
                <input type="text"   defaultValue={company} onChange={(e)=>setCompany(e.target.value)} className={styles.input} name="company" />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12 col-md-5">
                <div className={styles.label}>
                  What are you interested in learning more about? Select all
                  that apply.
                </div>
              </div>

              <div className="col-6 col-md-6 pt-3">
                {splitCatogries.map((db,i)=>(
                <label className={styles.containerInputCheckbox} key={i}>
                  {db}
                  <input type="checkbox"  onChange={(e)=>setInterestedInLearning([...interestedInLearning,db])} />
                  <span className={styles.checkmark}></span>
                </label>
                 ))}
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12 col-md-5">
                <div className={styles.label}>
                  What type of property do you own, operate, build or develop?
                </div>
              </div>
              <div className="col-6 col-md-6 pt-3">
                {data.map((db,i)=>(
                <label className={styles.containerInputCheckbox} key={db._id}>
                   <p className={styles.requestName}>{db.name}</p>
                  <input type="checkbox" onChange={()=>setPropertyYouOwn(db.name)}/>
                  <span className={styles.checkmark}></span>
                </label>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className={styles.message}>Leave a message:</div>
                <textarea className={styles.textarea} defaultValue={message} onChange={(e)=>setMessage(e.target.value)}></textarea>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button type="submit" onClick={(e)=>  submitRequest(e)} className={styles.button}>
                  SUBMIT
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps(){
  let data = [];
  let catogrisTypes = [];

  await axios.get("https://advanced-velocity.herokuapp.com/categories").then((response) => {
    data = response.data;
  });
  await axios.get("https://advanced-velocity.herokuapp.com/posts/request-demo").then((response) => {
    catogrisTypes  = response.data;
  });
  return{
    props:{
      data,
      catogrisTypes
    },
    revalidate: 10,

  }
}