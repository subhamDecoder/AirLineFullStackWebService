package com.airline.airlinemanagement.controller;

import com.airline.airlinemanagement.model.Flight;
import com.airline.airlinemanagement.repository.FlightRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173") // React frontend CORS
public class FlightCon {

    @Autowired
    private FlightRepo flightRepo;

    // ✅ GET all flights
    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> flights = flightRepo.findAll();
        return ResponseEntity.ok(flights);
    }

    // ✅ GET flights by origin and destination
    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination) {
        List<Flight> flights = flightRepo.findByOriginAndDestination(origin, destination);
        return ResponseEntity.ok(flights);
    }

    // ✅ POST new flight
    @PostMapping
    public ResponseEntity<Flight> addFlight(@RequestBody Flight flight) {
        Flight saved = flightRepo.save(flight);
        return ResponseEntity.ok(saved);
    }

    // ✅ PUT update flight by flightNo
    @PutMapping("/{flightNo}")
    public ResponseEntity<Flight> updateFlight(
            @PathVariable String flightNo,
            @RequestBody Flight updatedFlight) {
        Flight existing = flightRepo.findByFlightNo(flightNo);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        // Update fields
        existing.setOrigin(updatedFlight.getOrigin());
        existing.setDestination(updatedFlight.getDestination());
        existing.setDeparture(updatedFlight.getDeparture());
        existing.setSeats(updatedFlight.getSeats());
        existing.setPrice(updatedFlight.getPrice());
        existing.setDuration(updatedFlight.getDuration());
        existing.setAircraft(updatedFlight.getAircraft());

        Flight saved = flightRepo.save(existing);
        return ResponseEntity.ok(saved);
    }

    // ✅ DELETE flight by flightNo
    @DeleteMapping("/{flightNo}")
    public ResponseEntity<Void> deleteFlight(@PathVariable String flightNo) {
        Flight flight = flightRepo.findByFlightNo(flightNo);
        if (flight == null) {
            return ResponseEntity.notFound().build();
        }
        flightRepo.delete(flight);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
