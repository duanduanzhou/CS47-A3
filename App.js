
<script src="http://localhost:8097"></script>
import ReactDOM from 'react-dom'
import { ActivityIndicator,FlatList,SectionList,Image,TouchableOpacity,StyleSheet, Text, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import React, {Component} from 'react';
import axios from "axios";
// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};




export default function App() {
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  const millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

/* function  search () {
  //const BASE_URL = 'https://api.spotify.com/v1/search?';
  //const FETCH_URL = `${BASE_URL}q=${"faye"}&type=artist&limit=1`;
  const FETCH_URL = `https://api.spotify.com/v1/albums/${'16BW7Z0h309liAUqhHlAg4'}`;
  fetch(FETCH_URL, {
    method: 'GET',
    headers: new Headers({
      Accept: "application/json",
      Authorization: "Bearer " + token,
    })
  })
  .then(response => response.json())
  .then(json => console.log('json', json));
}*/

const renderArtists = () => {
    return artists.map(artist => (
        <div key={artist.id}>
            {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
            {artist.name}
        </div>
    ))
}


const renderdata = () => {
    return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.title}, {item.releaseYear}</Text>
          )}
        />
      )}
    </View>);
}

const search = async () => {
   try {
    const response = await fetch('https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks');
    const json = await response.json();
    setData(json.items);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

 /*const serach = async () => {
  //const BASE_URL = 'https://api.spotify.com/v1/search?';
  //const FETCH_URL = `${BASE_URL}q=${"faye wang"}&type=artist&limit=1`;
  //const FETCH_URL = `https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks`;
  try{
    const response = await;
  const FETCH_URL = 'https://reactnative.dev/movies.json';
   fetch(FETCH_URL, {
    method: 'GET',
    headers: new Headers({
      Accept: "application/json",
      Authorization: "Bearer " + token,
    })
  })
  const json = await response.json();
  setData(json.items);}
  catch (error) {
  console.error(error);
}  finally {
    setLoading(false);
}
  /*  .then((response) => {
    // Transform the response
    const transformedResponse = response.data.tracks.items.map((item) => {
      item.album = { images: response.data.images, name: response.data.name };
      return item;
    });
    setterFn(transformedResponse);
  })*/

  //.then(response => response.json())
  //.then(json => console.log('json', json));

//  return <Text style={{ color: "white" }}>CONNECT WITH SPOTIFY</Text>
//}

/*const getMovies = async () => {
   try {
    const response = await fetch('https://reactnative.dev/movies.json');
    const json = await response.json();
    setData(json.movies);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}*/



/*function search() {
  axios(`https://api.spotify.com/v1/albums/${'16BW7Z0h309liAUqhHlAg4'}/tracks`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
  .then(response => response.json())
  .then(json => console.log('json', json));
  //  setArtists(data.artists.items)
  //  {renderArtists()}

}
/*
function search() {
    const {data} = axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: "faye",
            type: "artist"
        }
    })

    setArtists(data.artists.items)
    {renderArtists()}

}*/


  class SpotifyAuthButton extends React.Component {
    render() {
        return(
         <TouchableOpacity style={styles.Button} onPress={()=>{promptAsync()}}>
         <Image
         style={styles.tinyLogo}
         source={require('./assets/spotify-logo.png')}/>
         <Text style={{ color: "white" }}>CONNECT WITH SPOTIFY</Text>
         </TouchableOpacity>
       );
  }}

  class Sectionlist extends React.Component {
    render() {
        return(

         <Text style={{ color: "white" }}>CONNECT WITH SPOTIFY</Text>

       );
  }}

  let contentDisplayed =null
  if (token){
    contentDisplayed =<Sectionlist/>
  }else{
    contentDisplayed =<SpotifyAuthButton/>
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {

      search();
      // TODO: Select which option you want: Top Tracks or Album Tracks

      // Comment out the one you are not using
      //myTopTracks(setTracks, token);
      //albumTracks(ALBUM_ID, setTracks, token);
    }
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      {/* TODO */}

      {contentDisplayed}
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text style={{ color: "white" }}>{item.track_number},{item.name},{millisToMinutesAndSeconds(item.duration_ms)}</Text>
          )}
        />
      )}
    </SafeAreaView>


  );

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 24
  },
  tinyLogo: {
     width: 10,
     height: 10,
     resizeMode: 'contain'
   },
});
