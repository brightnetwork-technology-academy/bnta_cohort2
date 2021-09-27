package com.example.bnta.cinema_api.controllers;

import com.example.bnta.cinema_api.models.Movie;
import com.example.bnta.cinema_api.repositories.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MovieController {

    @Autowired
    MovieRepository movieRepository;

    @GetMapping(value = "/movies")
    public List<Movie> getAllMovies(){
        return movieRepository.findAll();
    }

    @GetMapping(value = "/movies/{id}")
    public Movie getMovieById(@PathVariable Long id){
        return movieRepository.getById(id);
    }

    @PostMapping(value = "/movies")
    public void addNewMovie(@RequestBody Movie movie){
        movieRepository.save(movie);
    }

}
