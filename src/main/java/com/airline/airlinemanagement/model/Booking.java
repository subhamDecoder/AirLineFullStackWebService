package com.airline.airlinemanagement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String passengerName;
    private String email;
    private String phone;
    private int seatsBooked;
    private double totalAmount;
    private String status;
    private LocalDate bookingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    @JsonBackReference
    private Flight flight;

    // --- Getters ---

    public Long getId() {
        return id;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public Flight getFlight() {
        return flight;
    }

    // --- Setters ---

    public void setId(Long id) {
        this.id = id;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }
}
