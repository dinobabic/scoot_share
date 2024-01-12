package com.scootshare.base.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scootshare.base.entities.Listing;
import com.scootshare.base.entities.Rental;
import com.scootshare.base.entities.User;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long>{
	
	List<Rental> findAllByScooterRenter(User user);

	Rental findByListing(Listing listing);

}
