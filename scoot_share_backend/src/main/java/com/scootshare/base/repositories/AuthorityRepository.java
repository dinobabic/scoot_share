package com.scootshare.base.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scootshare.base.entities.Authority;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {

	@Modifying
	@Query("DELETE FROM Authority a WHERE a.user.id = :userId")
	public void deleteByUser(@Param("userId")Long userId);
}
