package com.scootshare.base.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scootshare.base.entities.ImageChangeRequest;

@Repository
public interface ImageChangeRequestRepository extends JpaRepository<ImageChangeRequest, Long>{

}
