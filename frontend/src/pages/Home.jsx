import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Home.css";

const Home = () => {
  const [participants, setParticipants] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  // const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load current user and token from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    // setCurrentUser(storedUser);
    setToken(storedUser?.token);

    // Fetch participants and user vote status
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/dashboard/participants"
        );
        if (response.data?.success) {
          setParticipants(response.data.participants);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
        toast.error("Error fetching participants.");
      }
    };

    const fetchUserVoteStatus = async () => {
      if (!storedUser?.token) {
        toast.error("Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/status",
          {
            headers: { Authorization: `Bearer ${storedUser.token}` },
          }
        );

        if (response.data?.success) {
          setHasVoted(response.data.data.hasVoted);
          setVotedFor(response.data.data.votedFor);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Authorization failed. Please log in again.");
        } else {
          toast.error("Error fetching vote status.");
        }
        console.error("Error fetching user vote status:", error);
      }
    };

    fetchParticipants();
    fetchUserVoteStatus();
  }, []);

  const handleVote = async (participantId) => {
    if (!token) {
      toast.error("Please log in to vote.");
      return;
    }

    try {
      // Send vote to the server
      const response = await axios.post(
        "http://localhost:3000/api/user/vote",
        { participantId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setHasVoted(true);
        setVotedFor(participantId);
        toast.success("Vote registered successfully!");
      } else {
        toast.error(response.data?.message || "Error voting");
      }
    } catch (error) {
      toast.error("Error during vote submission.");
      console.error("Error during vote submission:", error);
    }
  };

  return (
    <div className="box">
      {participants.map((participant) => (
        <div key={participant._id} className="participant-container">
          <div className="image-section">
            <img
              src={participant.image_url}
              alt={`${participant.partyname} symbol`}
            />
          </div>
          <div className="info-section">
            <div className="name-block">
              <p>{participant.partyname}</p>
              <p>{participant.leadername}</p>
            </div>
            <button
              className={`vote-btn ${
                hasVoted && votedFor === participant._id ? "voted" : ""
              }`}
              disabled={hasVoted && votedFor !== participant._id}
              onClick={() => handleVote(participant._id)}
            >
              Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
