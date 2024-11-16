import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const Home = () => {
  const [participants, setParticipants] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user status from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedVoteStatus = JSON.parse(localStorage.getItem("voteStatus"));

    // If the vote status is already in localStorage, set it directly
    if (storedVoteStatus) {
      setHasVoted(storedVoteStatus.hasVoted);
      setVotedFor(storedVoteStatus.votedFor);
    }

    // // If the user is not logged in, show an error
    // if (!storedUser || !storedUser.token) {
    //   toast.error("Please log in first.");
    //   return;
    // }

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
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/status",
          {
            headers: { Authorization: `Bearer ${storedUser.token}` },
          }
        );

        if (response.data?.success) {
          const voteStatus = response.data.data;
          setHasVoted(voteStatus.hasVoted);
          setVotedFor(voteStatus.votedFor);
          // Save to localStorage
          localStorage.setItem(
            "voteStatus",
            JSON.stringify({ hasVoted: voteStatus.hasVoted, votedFor: voteStatus.votedFor })
          );
        }
      } catch (error) {
        console.error("Error fetching user vote status:", error);
        toast.error("Error fetching vote status.");
      }
    };

    // Only fetch vote status from the server if it's not available in localStorage
    if (!storedVoteStatus) {
      fetchUserVoteStatus();
    }else{
    fetchParticipants();
    }
  }, []);

  const handleVote = async (participantId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.token) {
      toast.error("Please log in first.");
      return; // Return early to prevent further actions
    }

    setLoading(true);

    try {
      // Send vote to the server
      const response = await axios.post(
        "http://localhost:3000/api/user/vote",
        { participantId },
        {
          headers: { Authorization: `Bearer ${storedUser.token}` },
        }
      );

      if (response.data?.success) {
        setHasVoted(true);
        setVotedFor(participantId);
        // Save vote status to localStorage
        localStorage.setItem(
          "voteStatus",
          JSON.stringify({ hasVoted: true, votedFor: participantId })
        );
        toast.success("Vote registered successfully!");
      } else {
        toast.error(response.data?.message || "Error voting");
      }
    } catch (error) {
      console.error("Error during vote submission:", error);
      toast.error("Error during vote submission.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="box">
      {participants.map((participant) => (
        <div key={participant._id} className="participant-container">
          {/* Image Section */}
          <div className="image-section">
            <img
              src={participant.image_url}
              alt={`${participant.partyname} symbol`}
            />
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="name-block">
              <p>{participant.partyname}</p>
              <p>{participant.leadername}</p>
            </div>
          </div>

          {/* Vote Button */}
          <div className="button-section">
            <button
              className={`vote-btn ${
                hasVoted && votedFor === participant._id ? "voted" : ""
              }`}
              disabled={hasVoted}
              onClick={() => handleVote(participant._id)}
            >
              {loading && votedFor === participant._id
                ? "Processing..."
                : hasVoted && votedFor === participant._id
                ? "Voted"
                : "Vote"}
            </button>
          </div>
        </div>
      ))}

      {/* Camera UI */}
      {/* {cameraOpen && (
        <div className="camera-modal">
          <video ref={videoRef} autoPlay width="320" height="240" />
          <button onClick={() => captureImage()}>Capture Image</button>
          <canvas
            ref={canvasRef}
            width="320"
            height="240"
            style={{ display: "none" }}
          />
        </div>
      )} */}

      <ToastContainer />
    </div>
  );
};

export default Home;









