package com.scootshare.base.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scootshare.base.entities.Notification;
import com.scootshare.base.repositories.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository repository;
	
	public Notification save(Notification notification) {
		return repository.save(notification);
	}

	public List<Notification> findAllForUser(String username) {
		return repository.findAllByReceiverUsername(username);
	}

	public void deleteById(Long notificationId) {
		repository.deleteById(notificationId);
	}
	
	public Notification findById(Long id) {
		return repository.findById(id).get();
	}
}
