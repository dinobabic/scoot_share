package com.scootshare.base.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scootshare.base.entities.Scooter;
import com.scootshare.base.entities.User;

@Repository
public interface ScooterRepository extends JpaRepository<Scooter, Long>{

	List<Scooter> findByOwner(User owner);

}
