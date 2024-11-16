# import cv2
# import requests
# import base64
# import time
# import numpy as np
# from flask import Flask, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173"])

# # URL of the API endpoint to get embeddings
# API_URL = "http://localhost:5000/api/get_embedding"

# # Directions to guide the user
# DIRECTIONS = [
#     ("center", "Look straight ahead."),
#     ("left", "Turn your face to the left."),
#     ("right", "Turn your face to the right."),
#     ("up", "Tilt your head slightly up."),
#     ("down", "Tilt your head slightly down."),
# ]

# # Function to display a direction message
# def display_direction(frame, direction_text):
#     font = cv2.FONT_HERSHEY_SIMPLEX
#     position = (50, 50)  # Position of the text on the screen
#     font_scale = 1.0
#     color = (0, 255, 0)  # Green color
#     thickness = 2

#     # Display the guidance text
#     cv2.putText(frame, direction_text, position, font, font_scale, color, thickness)


# # Function to capture face samples based on guidance
# def capture_face_samples():
#     # Initialize webcam
#     cap = cv2.VideoCapture(0)

#     if not cap.isOpened():
#         print("Error: Could not open webcam.")
#         return None

#     captured_images = {}

#     for direction, guidance_text in DIRECTIONS:
#         print(guidance_text)
#         captured = False

#         while not captured:
#             # Capture frame-by-frame
#             ret, frame = cap.read()

#             if not ret:
#                 print("Error: Failed to capture image.")
#                 break

#             # Display the direction guidance on the frame
#             display_direction(frame, guidance_text)

#             # Show the frame with guidance
#             cv2.imshow("Face Enrollment - Follow the directions", frame)

#             # Wait for the user to press 'c' to capture the image
#             key = cv2.waitKey(1) & 0xFF
#             if key == ord("c"):
#                 # Capture and store the image for the current direction
#                 captured_images[direction] = frame.copy()
#                 captured = True
#                 print(f"Image captured for direction: {direction}")
#                 time.sleep(1)  # Brief pause before the next instruction

#         if not ret:
#             break

#     # Release the webcam and close the window
#     cap.release()
#     cv2.destroyAllWindows()

#     return captured_images


# # Function to send captured images to the API for embedding
# def send_images_for_embedding(captured_images):
#     embeddings = {}

#     for direction, image in captured_images.items():
#         # Encode image as JPEG to prepare for sending
#         _, buffer = cv2.imencode(".jpg", image)
#         img_base64 = base64.b64encode(buffer).decode("utf-8")

#         # Create the payload to send to the API
#         payload = {"imageBase64": img_base64}  # Send image as base64 encoded string

#         try:
#             # Send POST request to the API
#             response = requests.post(API_URL, json=payload)

#             if response.status_code == 200:
#                 embedding = response.json().get("embedding")
#                 embeddings[direction] = embedding
#                 print(f"Embedding received for {direction}")
#             else:
#                 error_message = response.json().get("error", "Unknown error occurred.")
#                 print(f"Error while processing {direction}: {error_message}")

#         except Exception as e:
#             print(f"Exception during API call for {direction}: {str(e)}")

#     return embeddings


# # Flask route to handle the webcam capture and embedding process
# @app.route("/api/webcam", methods=["GET"])
# def webcam_capture():
#     # Step 1: Capture face samples from different angles
#     captured_images = capture_face_samples()

#     if captured_images:
#         # Step 2: Send captured images to the API for embedding calculation
#         embeddings = send_images_for_embedding(captured_images)

#         if embeddings:
#             # Return the embeddings to the client
#             return jsonify({"status": "success", "embeddings": embeddings})
#         else:
#             return jsonify(
#                 {"status": "error", "message": "No embeddings were generated."}
#             )
#     else:
#         return jsonify(
#             {"status": "error", "message": "Face enrollment process was not completed."}
#         )


# if __name__ == "__main__":
#     # Run the Flask server on a different port
#     app.run(host="0.0.0.0", port=5000)
