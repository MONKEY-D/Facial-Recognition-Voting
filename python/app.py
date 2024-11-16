import requests
import cv2
import numpy as np
from flask import Flask, request, jsonify
import insightface
from flask_cors import CORS
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load the ArcFace model
model = insightface.app.FaceAnalysis()
model.prepare(ctx_id=-1, det_size=(640, 640))


@app.route("/api/get_embedding", methods=["POST"])
def get_embedding():
    logging.info("Received request for embedding")
    data = request.get_json()
    image_url = data.get("imageUrl")

    if not image_url:
        logging.error("No image URL provided")
        return jsonify({"error": "No image URL provided"}), 400

    try:
        # Download the image
        img_data = requests.get(image_url).content
        image = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)

        # Detect faces and get embeddings
        faces = model.get(image)
        if len(faces) == 0:
            logging.warning("No face detected")
            return jsonify({"error": "No face detected"}), 400

        embedding = faces[0].embedding.tolist()  # Get the first face's embedding
        logging.info("Embedding generated successfully")
        return jsonify({"embedding": embedding})

    except Exception as e:
        logging.error(f"Error during embedding generation: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)







