from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from content_based_filtering import get_recommendation
import os

app = Flask(__name__)
cors = CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'KPopHits2017-2021.csv')
    try:
        with open(file_path, 'r') as file:
            data = file.read()
        return data, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommendations', methods=['GET'])
def get_recommendations():    
    song = request.args.get('song')
    traits = request.args.get('traits')

    
    song = song[1:-1]
    traits = traits[1:-1].split(',')
    traits = [trait[1:-1] for trait in traits]

    recommendations = get_recommendation(song, traits).tolist()

    return jsonify({
        'recommendations': recommendations
    })
  
if __name__ == '__main__':
    app.run(debug=True)