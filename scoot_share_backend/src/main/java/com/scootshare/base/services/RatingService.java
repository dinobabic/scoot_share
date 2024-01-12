package com.scootshare.base.services;

import com.scootshare.base.entities.User;
import org.springframework.stereotype.Service;

import com.scootshare.base.entities.Rating;
import com.scootshare.base.repositories.RatingRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

	private final RatingRepository repository;
	
	public Rating save(Rating rating) {
		return repository.save(rating);
	}

	public List<Rating> getRatingsReceiver (User receiver) {
		return repository.findByRatingReceiver(receiver);
	}

	public List<Rating> getRatingsSender (User sender) {
		return repository.findByRatingSender(sender);
	}
}
