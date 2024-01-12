package com.scootshare.base.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scootshare.base.entities.ChatRoom;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String>{

	@Query("SELECT cr FROM ChatRoom cr WHERE cr.id LIKE CONCAT(:username, '%')")
    List<ChatRoom> findAllByUser(@Param("username") String username);

}
