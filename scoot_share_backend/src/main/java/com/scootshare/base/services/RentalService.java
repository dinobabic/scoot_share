package com.scootshare.base.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scootshare.base.entities.Listing;
import com.scootshare.base.entities.Rental;
import com.scootshare.base.entities.User;
import com.scootshare.base.repositories.RentalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RentalService {

	private final RentalRepository repository;
	
	public Rental save(Rental rental) {
		return repository.save(rental);
	}

	public List<Rental> findRentalsByUser(User user) {
		return repository.findAllByScooterRenter(user);
	}

	public Rental findByListing(Listing listing) {
		return repository.findByListing(listing);
	}

	public void deleteById(Long id) {
		repository.deleteById(id);
	}
}
