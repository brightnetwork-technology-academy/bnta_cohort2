import {useState} from "react";

const NewMovie = (props) => {

    const [title, setTitle] = useState("");
    const [rating, setRating] = useState("");
    const [duration, setDuration] = useState(0);

    const onTitleChange = (evt => {
        setTitle(evt.target.value);
    })

    const onRatingChange = (evt => {
        setRating(evt.target.value);
    })

    const onDurationChange = (evt => {
        setDuration(evt.target.value);
    })

    const onMovieSubmission = ((evt) => {
        evt.preventDefault();
        const newMovie = {
            title: title,
            rating: rating,
            duration: duration
        }
        props.handleMovieSubmission(newMovie);
        setTitle("");
        setRating("");
        setDuration(0);
    })

    return (
        <form onSubmit={onMovieSubmission}>
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" value={title} onChange={onTitleChange}/>
            <label for="rating">Rating:</label>
            <input type="text" id="rating" name="rating" value={rating} onChange={onRatingChange}/>
            <label for="duration">Duration:</label>
            <input type="number" id="duration" name="duration" min="0" value={duration} onChange={onDurationChange}/>
            <input type="submit" value="add new movie"/>
        </form>
    )

}

export default NewMovie;