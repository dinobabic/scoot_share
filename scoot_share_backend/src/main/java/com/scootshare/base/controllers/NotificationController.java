package com.scootshare.base.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.scootshare.base.entities.Notification;
import com.scootshare.base.services.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

	private final NotificationService service;
	
	@GetMapping("/{username}")
	public List<Notification> getAllForUser(@PathVariable String username) {
		return service.findAllForUser(username);
	}
	
	@PostMapping("/save")
	public ResponseEntity<Notification> save(@RequestBody Notification notification) {
		return ResponseEntity.ok(service.save(notification));
	}
	
	@DeleteMapping("/{notificationId}")
	public void deleteNotification(@PathVariable Long notificationId ) {
		service.deleteById(notificationId);
	}
}
