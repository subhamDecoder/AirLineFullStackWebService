package com.airline.airlinemanagement.repository;

import com.airline.airlinemanagement.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepo extends JpaRepository<Flight, Long> {
    Flight findByFlightNo(String flightNo);

    List<Flight> findByOriginAndDestination(String origin, String destination); // ✅ new method
}
