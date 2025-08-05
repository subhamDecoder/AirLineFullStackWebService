package com.airline.airlinemanagement.controller;

import com.airline.airlinemanagement.model.Booking;
import com.airline.airlinemanagement.model.Flight;
import com.airline.airlinemanagement.repository.BookingRepo;
import com.airline.airlinemanagement.repository.FlightRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if frontend runs on another port
public class BookingController {

    @Autowired
    private BookingRepo bookingRepository;

    @Autowired
    private FlightRepo flightRepository;

    // ✅ Create new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            if (booking.getFlight() == null || booking.getFlight().getId() == null) {
                return ResponseEntity.badRequest().body("Flight ID is required in the booking payload.");
            }

            Flight flight = flightRepository.findById(booking.getFlight().getId())
                    .orElse(null);

            if (flight == null) {
                return ResponseEntity.badRequest().body("Invalid Flight ID.");
            }

            booking.setFlight(flight);

            // Set default values if not provided
            if (booking.getBookingDate() == null) {
                booking.setBookingDate(LocalDate.now());
            }
            if (booking.getStatus() == null || booking.getStatus().trim().isEmpty()) {
                booking.setStatus("Confirmed");
            }

            // Optionally recalculate total
            if (booking.getTotalAmount() <= 0) {
                booking.setTotalAmount(flight.getPrice() * booking.getSeatsBooked());
            }

            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    // ✅ Get all bookings
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // ✅ Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        return bookingRepository.findById(id).map(existing -> {
            bookingRepository.delete(existing);
            return ResponseEntity.ok("Booking deleted.");
        }).orElse(ResponseEntity.notFound().build());
    }
}
