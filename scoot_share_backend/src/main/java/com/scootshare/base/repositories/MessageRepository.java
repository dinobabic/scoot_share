package com.scootshare.base.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scootshare.base.entities.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long>{

	@Query("SELECT m FROM Message m WHERE m.chatRoom.id = :id")
    List<Message> findMessagesBySenderAndReceiver(
            @Param("id") String id
    );
}
