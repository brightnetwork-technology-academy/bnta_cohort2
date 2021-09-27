package com.example.bnta.cinema_api.repositories;

import com.example.bnta.cinema_api.models.Casting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CastingRepository extends JpaRepository<Casting, Long> {
}
