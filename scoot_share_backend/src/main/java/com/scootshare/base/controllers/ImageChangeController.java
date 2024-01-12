package com.scootshare.base.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.scootshare.base.entities.ImageChangeRequest;
import com.scootshare.base.entities.Listing;
import com.scootshare.base.entities.Notification;
import com.scootshare.base.entities.Rental;
import com.scootshare.base.entities.Scooter;
import com.scootshare.base.entities.User;
import com.scootshare.base.services.ImageChangeRequestService;
import com.scootshare.base.services.ListingService;
import com.scootshare.base.services.NotificationService;
import com.scootshare.base.services.RentalService;
import com.scootshare.base.services.ScooterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/imageChanges")
@RequiredArgsConstructor
@CrossOrigin
public class ImageChangeController {

	private final ImageChangeRequestService imageChangeRequestService;
	private final SimpMessagingTemplate messagingTemplate;
	private final ScooterService scooterService;
	private final NotificationService notificationService;
	private final ListingService listingService;
	private final RentalService rentalService;
	
	@PostMapping("/save")
	public ResponseEntity<?> saveImageChangeRequest(@RequestBody ImageChangeRequest imageChangeRequest, @AuthenticationPrincipal User user) {
		imageChangeRequest = imageChangeRequestService.save(imageChangeRequest);
		
		User scooterOwner = scooterService.findById(imageChangeRequest.getScooterId()).getOwner();
		
		Notification notification = Notification.builder()
				.receiverUsername(scooterOwner.getUsername())
				.senderUsername(user.getUsername())
				.type("IMAGE_CHANGE_REQUEST")
				.build();
		
		notification = notificationService.save(notification);
		messagingTemplate.convertAndSend(
				"/user/" + scooterOwner.getUsername() + "/queue/notifications",
				notification);
		
		notification = Notification.builder()
				.receiverUsername("admin")
				.senderUsername(user.getUsername())
				.type("IMAGE_CHANGE_REQUEST_ADMIN")
				.build();
		
		notification = notificationService.save(notification);
		messagingTemplate.convertAndSend(
				"/user/admin/queue/notifications",
				notification);
		
		return ResponseEntity.ok(imageChangeRequest);
	}
	
	@GetMapping("/getAll")
	public List<ImageChangeRequest> getAll(@AuthenticationPrincipal User user) {
		if (!user.getUsername().equals("admin")) {
			return null;
		}
		
		return imageChangeRequestService.findAll();
	}
	
	@PutMapping("/performReplacement/{id}")
	public void performReplacement(@PathVariable Long id) {
		ImageChangeRequest request = imageChangeRequestService.findById(id);
		Scooter scooter = scooterService.findById(request.getScooterId());
		User owner = scooter.getOwner();
		List<Listing> listings = listingService.findByScooterId(scooter.getId());
		Listing listing = null;
		for (Listing tmp : listings) {
			if (tmp.getStatus().equals("IN RENT")) {
				listing = tmp;
			}
		}
		Rental rental = rentalService.findByListing(listing);
		User renter = rental.getScooterRenter();
		
		List<String> scooterImages = scooter.getImages();
		int index = -1;
		for (int i = 0; i< scooterImages.size(); i++) {
			if (scooterImages.get(i).equals(request.getOldImage())) {
				index = i;
				break;
			}
		}
		
		if (index == -1) return;
		
		scooterImages.set(index, request.getReplacementImage());
		scooterService.save(scooter);
		
		Notification notification = Notification.builder()
				.receiverUsername(owner.getUsername())
				.senderUsername("admin")
				.type("IMAGE_CHANGE_REQUEST_ACCEPTED")
				.build();
		
		notification = notificationService.save(notification);
		messagingTemplate.convertAndSend(
				"/user/" + owner.getUsername() + "/queue/notifications",
				notification);
		
		notification = Notification.builder()
				.receiverUsername(renter.getUsername())
				.senderUsername("admin")
				.type("IMAGE_CHANGE_REQUEST_ACCEPTED")
				.build();
		
		notification = notificationService.save(notification);
		messagingTemplate.convertAndSend(
				"/user/" + renter.getUsername() + "/queue/notifications",
				notification);
		
		imageChangeRequestService.deleteById(id);
	}
	
	
	@DeleteMapping("/deleteById/{id}") 
	public void deleteById(@PathVariable Long id) {
		
		ImageChangeRequest request = imageChangeRequestService.findById(id);
		Scooter scooter = scooterService.findById(request.getScooterId());
		User owner = scooter.getOwner();
		List<Listing> listings = listingService.findByScooterId(scooter.getId());
		Listing listing = null;
		for (Listing tmp : listings) {
			if (tmp.getStatus().equals("IN RENT")) {
				listing = tmp;
			}
		}
		Rental rental = rentalService.findByListing(listing);
		User renter = rental.getScooterRenter();
		
		Notification notification = Notification.builder()
				.receiverUsername(owner.getUsername())
				.senderUsername("admin")
				.type("IMAGE_CHANGE_REQUEST_REJECTED")
				.build();
		
		notification = notificationService.save(notification);
		messagingTemplate.convertAndSend(
				"/user/" + owner.getUsername() + "/queue/notifications",
				notification);
		
		notification = Notification.builder()
				.receiverUsername(renter.getUsername())
				.senderUsername("admin")
				.type("IMAGE_CHANGE_REQUEST_REJECTED")
				.build();
		
		notification = notificationService.save(notification);
		messagingTemplate.convertAndSend(
				"/user/" + renter.getUsername() + "/queue/notifications",
				notification);
		
		imageChangeRequestService.deleteById(id);
	}
}





