import Search from "./components/Search.jsx";
import {useEffect, useState} from "react";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY= import.meta.env.VITE_TMBD_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers:{
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  }
}

function App() {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingError, setTrendingError] = useState('');
  const [trendingLoading, setTrendingLoading] = useState(false);

  //prevent too many api calls by using useDebounce
  useDebounce(()=>setDebouncedSearchTerm(searchTerm),500,[searchTerm]);

  const fetchMovies = async(query='')=>{
    setIsLoading(true);
    setErrorMessage('');
    try{
        const endpoint= query?`${API_BASE_URL}/search/movie?query=${encodeURI(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        const response = await fetch(endpoint,API_OPTIONS);
        if(!response.ok){
          throw new Error("Could not fetch movie data");
        }
        const data=await response.json();

        if(data.Response==='False'){
          setErrorMessage(data.Error||'Failed to fetch movies');
          setMovieList([])
          return;
        }
        setMovieList(data.results||[]);
        if(query&&data.results.length>0){
          await updateSearchCount(query,data.results[0]);
        }
    }catch(err){
      console.log(`error in fetchMovies: ${err}`);
      setErrorMessage('Something went wrong.');
    }finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async()=> {
      setTrendingLoading(true);
      setTrendingError('');
    try {

  const movies = await getTrendingMovies();
  setTrendingMovies(movies);
    }catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
      setTrendingError('Error fetching trending movies');
    }finally {
      setTrendingLoading(false);
    }
  }
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies();
  },[]);

  return ( 
  <main>
    <div className="pattern"/>

    <div className="wrapper">
      <header>
        <img src="/hero.png" alt="Hero Banner"/>
        <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>
      {trendingLoading?(
          <Spinner />
      ):trendingError?(
          <p className="text-red-500">{trendingError}</p>
      ):(
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index)=>(
                  <li key={movie.$id}>
                    <p>{index +1 }</p>
                    <img className="" src={movie.poster_url} alt={movie.title}/>
                  </li>
              ))}
            </ul>
          </section>
      )}
      <section className="all-movies">
          <h2>All Movies</h2>
        {isLoading?(
            <Spinner/>
        ):errorMessage?(
            <p className="text-red-500">{errorMessage}</p>
        ):(
            <ul>
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
        )}
      </section>

    </div>

  </main> );
}

export default App;















































// import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";

// function Card({ title }) {
//   const [count,setCount]=useState(0);
//   const [hasLiked, setHasLiked] = useState(false);
//   useEffect(()=>{
//     console.log(`${title} has been liked`)
//   },[hasLiked]);
//   useEffect(()=>{
    
//   })
//   return (
//     <div className="card" onClick={() => setCount(count+1)}>
//       <h2>{title} <br/> {count} </h2>
//       <button onClick={() => setHasLiked(!hasLiked)}>
//         {hasLiked ? "Liked" : "Like"}
//       </button>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div>
//       <Card title="Look around you" />
//       <Card title="Tell me what you see" />
//     </div>
//   );
// }

// export default App;
