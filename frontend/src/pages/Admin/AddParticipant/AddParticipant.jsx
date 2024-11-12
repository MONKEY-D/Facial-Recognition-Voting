import React, { useState } from "react";
import "./AddParticipant.css";
import { assets } from "../../../assets/assets.js"; // Assuming assets has the `upload_area` image URL or placeholder.
import axios from "axios";

const AddParticipant = () => {
  const url = "http://localhost:3000";
  const [image, setImage] = useState(null); // Using null instead of false for clarity.
  const [data, setData] = useState({
    partyname: "",
    leadername: "",
  });

  // Handles changes in input fields and updates data state.
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles form submission and participant creation.
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("partyname", data.partyname);
    formData.append("leadername", data.leadername);

    try {
      const response = await axios.post(
        `${url}/admin/dashboard/addparticipant`,
        formData
      );

      if (response.data.success) {
        // Reset the form fields upon successful submission.
        setData({
          partyname: "",
          leadername: "",
        });
        setImage(null);
        alert("Participant added successfully!");
      }
    } catch (error) {
      console.error("Error adding participant:", error);
      alert("Failed to add participant.");
    }
  };

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler}>
        {/* Image upload section */}
        <div className="add-img-upload flexx-col">
          <p>Upload Party Symbol</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Party Symbol Preview"
              className="image-preview"
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

        {/* Party name input field */}
        <div className="add-party-name flexx-col">
          <p>Party Name</p>
          <input
            onChange={onChangeHandler}
            value={data.partyname}
            type="text"
            name="partyname"
            placeholder="Type here..."
            required
          />
        </div>

        {/* Leader name input field */}
        <div className="add-leader-name flexx-col">
          <p>Leader Name</p>
          <input
            onChange={onChangeHandler}
            value={data.leadername}
            type="text"
            name="leadername"
            placeholder="Type here..."
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddParticipant;
