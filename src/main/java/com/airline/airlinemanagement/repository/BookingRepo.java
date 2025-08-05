package com.airline.airlinemanagement.repository;

import com.airline.airlinemanagement.model.Booking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepo extends JpaRepository<Booking, Long> {

    List<Booking> findByPassengerNameContainingIgnoreCase(String name);
}
