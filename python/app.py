from flask import Flask, request, jsonify
import insightface
import numpy as np
import cv2

app = Flask(__name__)

# Load the ArcFace model
model = insightface.app.FaceAnalysis()
model.prepare(ctx_id=-1, det_size=(640, 640))

@app.route('/api/get_embedding', methods=['POST'])
def get_embedding():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    faces = model.get(image)
    if len(faces) == 0:
        return jsonify({'error': 'No face detected'}), 400

    embedding = faces[0].embedding.tolist()
    return jsonify({'embedding': embedding})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
