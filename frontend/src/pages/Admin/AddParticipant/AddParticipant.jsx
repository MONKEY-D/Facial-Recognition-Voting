import React, { useState } from "react";
import "./AddParticipant.css";
import { assets } from "../../../assets/assets.js";
import axios from 'axios'

const AddParticipant = () => {
  const url = "http://localhost:3000";
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    partyname: "",
    leadername: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target; // Destructure name and value from the input
    setData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the state key based on the input field's name
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image",image)
    formData.append("patyname",data.partyname)
    formData.append("leadername",data.leadername)
    const response = await axios.post(`${url}/admin/dashboard/addparticipant`,formData)
    if (response.data.success) {
      setData({
        partyname: "",
        leadername: "",
      })
      setImage(false)
    }
    else{

    }
  }

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler}>
        <div className="add-img-upload flexx-col">
          <p>Upload Party Symbol</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-party-name flexx-col">
          <p>Party Name</p>
          <input
            onChange={onChangeHandler}
            value={data.partyname}
            type="text"
            name="partyname"
            placeholder="type here..."
          />
        </div>
        <div className="add-leader-name flexx-col">
          <p>Leader Name</p>
          <input
            onChange={onChangeHandler}
            value={data.leadername}
            type="text"
            name="leadername"
            placeholder="type here..."
          />
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddParticipant;
