package com.scootshare.base.repositories;

import com.scootshare.base.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scootshare.base.entities.Rating;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRatingReceiver (User receiver);
    List<Rating> findByRatingSender (User sender);
}
