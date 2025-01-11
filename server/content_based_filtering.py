import pandas as pd
import numpy as np
from scipy.spatial.distance import cdist

ATTRIBUTES = ['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'valence', 'tempo']




# refactored get_recommendation
def get_recommendation(song_name: str, traits: list[str]) -> list[str]:
  
    music_data = pd.read_csv('./data/KPopHits2017-2021.csv')


    # Song name data
    song_name_data = music_data[['title', "artist/s"]]

    # Map song name to its index
    song_to_index = pd.Series(music_data.index, index=music_data['title'])

    input_idx = song_to_index[song_name]

    # Create a feature vector for input song
    input_features = np.array([music_data[trait][input_idx] for trait in traits]).reshape(1,-1)

    # Create feature vectors for all songs
    all_features = np.array([music_data[trait] for trait in traits]).T

    # Calculate euclidean distance between vectors
    similarities = cdist(input_features, all_features, metric='euclidean')

    # Find 5 closest songs to input song based on euclidean distance
    similar_indices = similarities.argsort()[0][1:6]

    # return recommendations
    recommendations = song_name_data.iloc[similar_indices].values

    return recommendations

if __name__ == "__main__":
    input_song = "FANCY"
    traits = ['acousticness', 'valence', 'danceability']
    recommendations = get_recommendation(input_song, traits)
    print(f"Recommendations for '{input_song}':")
    for i, song in enumerate(recommendations, 1):
        print(f"{i}. {song}")

