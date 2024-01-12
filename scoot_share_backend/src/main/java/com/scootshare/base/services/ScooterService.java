package com.scootshare.base.services;

import java.util.List;

import org.springframework.stereotype.Service;
import com.scootshare.base.entities.Scooter;
import com.scootshare.base.entities.User;
import com.scootshare.base.repositories.ScooterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScooterService {

	private final ScooterRepository repository;
	
	public Scooter save(Scooter scooter) {
		return repository.save(scooter);
	}
	
	public List<Scooter> findByOwner(User owner) {
		return repository.findByOwner(owner);
	}
	
	public Scooter findById(Long id) {
		return repository.findById(id).get();
	}
}
