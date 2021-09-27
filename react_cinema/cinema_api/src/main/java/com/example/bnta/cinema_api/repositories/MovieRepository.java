package com.example.bnta.cinema_api.repositories;

import com.example.bnta.cinema_api.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
