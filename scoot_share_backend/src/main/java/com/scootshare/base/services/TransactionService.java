package com.scootshare.base.services;

import com.scootshare.base.entities.*;
import org.springframework.stereotype.Service;

import com.scootshare.base.repositories.TransactionRepository;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

	private final TransactionRepository repository;
	private final RentalService rentalService;
	private final UserService userService;
	private final ScooterService scooterService;
	private final ListingService listingService;
	
	public Transaction save(Transaction transaction) {
		return repository.save(transaction);
	}
	public List <Transaction> getTransactions(String username) {
		User user = userService.findByUsername(username);
		List <Rental> rentals = rentalService.findRentalsByUser(user);
		List <Transaction> transactions = new ArrayList<>();
		for (Rental rental:rentals) {
			if (rental.getRentalTimeEnd() != null) {
				transactions.add(repository.findByRental(rental));
			}
		}

		List <Scooter> scooters = scooterService.findByOwner(user);
		List <Listing> listings = new ArrayList<>();
		for (Scooter scooter:scooters) 
			listings.addAll(listingService.findByScooterId(scooter.getId()));

		rentals = new ArrayList<>();
		for (Listing listing:listings) {
			if (!listing.getStatus().equals("ACTIVE")) {
				rentals.add(rentalService.findByListing(listing));
			}
		}

		for (Rental rental:rentals) {
			if (rental.getRentalTimeEnd() != null) {
				transactions.add(repository.findByRental(rental));
			}
		}

		return transactions;
	}
}