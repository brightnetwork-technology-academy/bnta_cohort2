import React from "react"
import MovieList from "../components/MovieList";
import NewMovie from "../components/NewMovie";

class CinemaContainer extends React.Component{

    constructor (props){
        super(props);

        this.state = {
            loaded: false,
            movies: []
        }

        this.addNewMovie = this.addNewMovie.bind(this);
    }

    componentDidMount(){
        this.getMovieData();
    }

    getMovieData(){
        fetch("http://localhost:8080/movies")
            .then((response) => response.json())
            .then(data => this.setState({ movies: data, loaded: true }))
            .catch(error => console.log(error))
    }

    addNewMovie(newMovie){
        fetch("http://localhost:8080/movies",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMovie)
        })
        const updatedMovies = [...this.state.movies, newMovie];
        this.setState({ movies: updatedMovies });
    }

    render(){

        return (
            <>
                <h1>CinemaDB</h1>
                <NewMovie handleMovieSubmission={this.addNewMovie}/>
                <hr/>
                <MovieList movies={this.state.movies}/>
            </>
        )
    }

}

export default CinemaContainer;