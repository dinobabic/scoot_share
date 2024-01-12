package com.scootshare.base.controllers;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.scootshare.base.services.*;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.scootshare.base.dto.RentalDto;
import com.scootshare.base.entities.Listing;
import com.scootshare.base.entities.Notification;
import com.scootshare.base.entities.Rental;
import com.scootshare.base.entities.Transaction;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@CrossOrigin
public class RentalController {

	private final RentalService rentalService;
	private final ListingService listingService;
	private final UserService userService;
	private final SimpMessagingTemplate messagingTemplate;
	private final NotificationService notificationService;
	private final TransactionService transactionService;
	
	@PostMapping("/save")
	public void save(@RequestBody RentalDto rentalDto) {
		Listing listing = listingService.findById(rentalDto.getListingId());
		listing.setStatus("IN RENT");
		listingService.save(listing);
		
		Rental rental = Rental.builder()
				.listing(listing)
				.scooterRenter(userService.findByUsername(rentalDto.getScooterRenterUsername()))
				.rentalTimeEnd(rentalDto.getRentalTimeEnd())
				.rentalTimeStart(rentalDto.getRentalTimeStart())
				.build();
		rentalService.save(rental);
		
		Notification notification = Notification.builder()
				.receiverUsername(listing.getScooter().getOwner().getUsername())
				.senderUsername(rentalDto.getScooterRenterUsername())
				.type("RENTAL")
				.build();
		
		notification = notificationService.save(notification);
		
		messagingTemplate.convertAndSend(
				"/user/" + notification.getReceiverUsername() + "/queue/notifications",
				notification);
	}
	
	@GetMapping("/getRentalForListing/{listingId}")
	public ResponseEntity<?> getRentalForListing(@PathVariable Long listingId) {
		Listing listing = listingService.findById(listingId);
		Rental rental = rentalService.findByListing(listing);
		
		return ResponseEntity.ok(RentalDto.builder()
				.listingId(listingId)
				.rentalTimeEnd(rental.getRentalTimeEnd())
				.rentalTimeStart(rental.getRentalTimeStart())
				.scooterRenterUsername(rental.getScooterRenter().getUsername())
				.scooterOwner(listing.getScooter().getOwner().getUsername())
				.build());
	}
	
	@GetMapping("/getRentalsForUser/{username}")
	public List<RentalDto> getActiveRentalsForUser(@PathVariable String username) {
		return rentalService.findRentalsByUser(userService.findByUsername(username))
				.stream()
				.filter((rental) -> rental.getRentalTimeEnd() == null)
				.map((rental) -> RentalDto.builder()
					.listingId(rental.getListing().getId())
					.scooterRenterUsername(username)
					.scooterOwner(rental.getListing().getScooter().getOwner().getUsername())
					.rentalTimeEnd(rental.getRentalTimeEnd())
					.rentalTimeStart(rental.getRentalTimeStart())
				.build())
				.collect(Collectors.toList());
	}
	
	@PutMapping("/returnScooter")
	public void returnScooter(@RequestBody RentalDto rentalDto) {
		Rental rental = rentalService.findByListing(listingService.findById(rentalDto.getListingId()));
		
		rental.setRentalTimeEnd(new Date());
		rentalService.save(rental);
		
		Listing listing = listingService.findById(rentalDto.getListingId());
		listing.setStatus("INACTIVE");
		listingService.save(listing);

		Transaction transaction = Transaction.builder()
				.rental(rental)
				.kilometersPassed(Math.random()*15)
				.timeOfTransaction(new Date())
				.build();
		transaction.setTotalPrice(transaction.getKilometersPassed()*rental.getListing().getPricePerKilometer());

		if (rental.getRentalTimeEnd().compareTo(listing.getReturnByTime()) == 1) {
			transaction.setTotalPrice(transaction.getTotalPrice() + listing.getLateReturnPenalty());
		}
		
		transactionService.save(transaction);

		Notification notification = Notification.builder()
				.receiverUsername(listing.getScooter().getOwner().getUsername())
				.type("TRANSACTION")
				.build();

		notification = notificationService.save(notification);

		messagingTemplate.convertAndSend(
				"/user/" + notification.getReceiverUsername() + "/queue/notifications",
				notification);

		/*notification = Notification.builder()
				.receiverUsername(rental.getScooterRenter().getUsername())
				.type("TRANSACTION")
				.build();

		notification = notificationService.save(notification);

		messagingTemplate.convertAndSend(
				"/user/" + notification.getReceiverUsername() + "/queue/notifications",
				notification);*/

	}
}
