package com.skyport.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookingRepository extends JpaRepository<BookingEntity, String> {
    List<BookingEntity> findByEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    List<BookingEntity> findByFlightNumberAndSeatClassAndStatusNot(String flightNumber, String seatClass, String status);

    long countByStatus(String status);

    @Query("select coalesce(sum(b.price), 0) from BookingEntity b where b.status <> 'CANCELLED'")
    double revenueExcludingCancelled();
}
