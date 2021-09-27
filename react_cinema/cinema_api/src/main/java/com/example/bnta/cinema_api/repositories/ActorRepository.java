package com.example.bnta.cinema_api.repositories;

import com.example.bnta.cinema_api.models.Actor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorRepository extends JpaRepository<Actor, Long> {
}
