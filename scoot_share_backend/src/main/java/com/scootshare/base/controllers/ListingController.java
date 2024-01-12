package com.scootshare.base.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.scootshare.base.dto.ListingDto;
import com.scootshare.base.dto.ListingWithScooterImagesDto;
import com.scootshare.base.entities.Listing;
import com.scootshare.base.entities.Scooter;
import com.scootshare.base.services.ListingService;
import com.scootshare.base.services.ScooterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
@CrossOrigin
public class ListingController {

	private final ListingService listingService;
	private final ScooterService scooterService;
	
	@PostMapping("/add")
	public ResponseEntity<?> addListing(@RequestBody ListingDto listingDto) {
		Scooter scooter = scooterService.findById(listingDto.getScooterId());
		Listing listing = Listing.builder()
				.scooter(scooter)
				.location(listingDto.getLocation())
				.returnLocation(listingDto.getReturnLocation())
				.pricePerKilometer(listingDto.getPricePerKilometer())
				.lateReturnPenalty(listingDto.getLateReturnPenalty())
				.returnByTime(listingDto.getReturnByTime())
				.status("ACTIVE")
				.build(); 
		
		listing = listingService.save(listing);
		scooter.addListing(listing);
		scooterService.save(scooter);
		
		return ResponseEntity.ok(listing);
	}
	
	@GetMapping("/getOneListingByScooterId/{scooterId}")
	public ResponseEntity<?> getListingByScooterId(@PathVariable Long scooterId) {
		List<Listing> listings = listingService.findByScooterId(scooterId);
		Listing listing = null;
		for (Listing tmp : listings) {
			if (tmp.getStatus().equals("ACTIVE")) {
				listing = tmp;
			}
		}
		return ResponseEntity.ok(ListingWithScooterImagesDto.builder()
				.id(listing.getId())
				.scooterId(listing.getScooter().getId())
				.location(listing.getLocation())
				.returnLocation(listing.getReturnLocation())
				.returnByTime(listing.getReturnByTime())
				.pricePerKilometer(listing.getPricePerKilometer())
				.scooterImages(listing.getScooter().getImages())
				.lateReturnPenalty(listing.getLateReturnPenalty())
				.build());
	}
	
	@GetMapping("/getOneListing/{listingId}")
	public ResponseEntity<?> getListingByListingId(@PathVariable Long listingId) {
		Listing listing = listingService.findById(listingId);
		return ResponseEntity.ok(ListingWithScooterImagesDto.builder()
				.id(listing.getId())
				.scooterId(listing.getScooter().getId())
				.location(listing.getLocation())
				.returnLocation(listing.getReturnLocation())
				.returnByTime(listing.getReturnByTime())
				.pricePerKilometer(listing.getPricePerKilometer())
				.scooterImages(listing.getScooter().getImages())
				.lateReturnPenalty(listing.getLateReturnPenalty())
				.build());
	}
	
	@GetMapping("/{scooterId}")
	public ResponseEntity<?> getListingForScooter(@PathVariable Long scooterId) {
		List<Listing> listings = listingService.findByScooterId(scooterId);
		Listing listing = null;
		for (Listing tmp : listings) {
			if (tmp.getStatus().equals("ACTIVE")) {
				listing = tmp;
			}
		}
		return ResponseEntity.ok(ListingDto.builder()
				.listingId(listing.getId())
				.scooterId(listing.getScooter().getId())
				.location(listing.getLocation())
				.returnLocation(listing.getReturnLocation())
				.returnByTime(listing.getReturnByTime())
				.pricePerKilometer(listing.getPricePerKilometer())
				.lateReturnPenalty(listing.getLateReturnPenalty())
				.build());
	}
	
	@GetMapping("/getAll/{username}")
	public List<ListingWithScooterImagesDto> getAllActiveListings(@PathVariable String username) {
		return listingService.findAll().stream()
				.filter((listing) -> !listing.getScooter().getOwner().getUsername().equals(username) && listing.getStatus().equals("ACTIVE"))
				.map((listing) -> ListingWithScooterImagesDto.builder()
				.id(listing.getId())
				.scooterId(listing.getScooter().getId())
				.location(listing.getLocation())
				.returnLocation(listing.getReturnLocation())
				.returnByTime(listing.getReturnByTime())
				.pricePerKilometer(listing.getPricePerKilometer())
				.scooterImages(listing.getScooter().getImages())
				.build()).collect(Collectors.toList());
	}
	
	@DeleteMapping("/{scooterId}")
	public void deleteListingForScooter(@PathVariable Long scooterId) {
		List<Listing> listings = listingService.findByScooterId(scooterId);
		Listing listing = null;
		for (Listing tmp : listings) {
			if (tmp.getStatus().equals("ACTIVE")) {
				listing = tmp;
			}
		}
		listingService.deleteById(listing.getId());
	}
}
