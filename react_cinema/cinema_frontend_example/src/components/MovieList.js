import Movie from "./Movie"

const MovieList = (props) => {

    const movieComponents = props.movies.map((movie, index) => {
        return <Movie movie={movie} key={index}/>
    });


    return (
        <>
            {movieComponents}
        </>
    )

} 

export default MovieList