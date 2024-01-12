package com.scootshare.base.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scootshare.base.entities.ImageChangeRequest;
import com.scootshare.base.repositories.ImageChangeRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageChangeRequestService {

	private final ImageChangeRequestRepository repository;
	
	public ImageChangeRequest save(ImageChangeRequest imageChangeRequest) {
		return repository.save(imageChangeRequest);
	}

	public List<ImageChangeRequest> findAll() {
		return repository.findAll();
	}

	public void deleteById(Long id) {
		repository.deleteById(id);
	}

	public ImageChangeRequest findById(Long id) {
		return repository.findById(id).get();
	}
}
