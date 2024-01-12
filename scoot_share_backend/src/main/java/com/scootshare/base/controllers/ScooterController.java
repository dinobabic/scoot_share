package com.scootshare.base.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.scootshare.base.dto.ScooterDto;
import com.scootshare.base.dto.UserDto;
import com.scootshare.base.entities.Listing;
import com.scootshare.base.entities.Scooter;
import com.scootshare.base.entities.User;
import com.scootshare.base.services.ScooterService;
import com.scootshare.base.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/scooters")
@RequiredArgsConstructor
@CrossOrigin
public class ScooterController {

	private final ScooterService scooterService;
	private final UserService userService;
	
	@PostMapping("/add")
	public ResponseEntity<ScooterDto> addScooter(@RequestBody ScooterDto scooterDto, @AuthenticationPrincipal User user) {
		Scooter scooter = new Scooter();
		scooter.setImages(scooterDto.getImages());
		user = userService.findByUsername(user.getUsername());
		scooter.setOwner(user);
		
		scooter = scooterService.save(scooter);
		scooterDto.setId(scooter.getId());
		return ResponseEntity.ok(scooterDto);
	}
	
	@GetMapping("/getOwnerUsername/{scooterId}")
	public ResponseEntity<?> getOwnerUsernameById(@PathVariable Long scooterId) {
		Scooter scooter = scooterService.findById(scooterId);
		User user = scooter.getOwner();
		return ResponseEntity.ok(UserDto.builder().username(user.getUsername()).build());
	}
	
	@GetMapping("/getScooter/{scooterId}")
	public ResponseEntity<ScooterDto> getScooter(@PathVariable Long scooterId) {
		Scooter scooter = scooterService.findById(scooterId);
		return ResponseEntity.ok(ScooterDto.builder().images(scooter.getImages()).build());
	}
	
	@GetMapping("/{username}")
	public ResponseEntity<?> findScootersByOwner(@PathVariable String username) {
		List<Scooter> scooters = scooterService.findByOwner(userService.findByUsername(username));
		List<ScooterDto> scooterDtos = scooters.stream()
				.map((scooter) -> {
					Listing listing = null;
					try {
						for (Listing listingTmp : scooter.getListings()) {
							if (listingTmp.getStatus().equals("ACTIVE") || listingTmp.getStatus().equals("IN RENT")) {
								listing = listingTmp;
							}
						}
					} catch (Exception e) {
					}
					return ScooterDto
							.builder()
							.images(scooter.getImages())
							.id(scooter.getId())
							.hasListing(listing != 	null)
							.listingIsActive(listing != null && listing.getStatus().equals("ACTIVE"))
							.build();
				})
				.collect(Collectors.toList());
		return ResponseEntity.ok(scooterDtos);
	}
}








