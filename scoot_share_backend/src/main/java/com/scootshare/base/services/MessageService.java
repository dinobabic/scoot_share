package com.scootshare.base.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.scootshare.base.dto.MessageDto;
import com.scootshare.base.entities.Message;
import com.scootshare.base.repositories.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

	private final MessageRepository repository;
	
	public Message save(Message message) {
		return repository.save(message);
	}

	public List<MessageDto> findByUsers(String sender, String receiver) {
		List<MessageDto> messageDtos = new ArrayList<>();
		String id = sender + "_" + receiver;
		List<Message> messages = repository.findMessagesBySenderAndReceiver(id);
		for (Message message : messages) {
			messageDtos.add(MessageDto.builder()
					.receiver(message.getReceiver().getUsername())
					.sender(message.getSender().getUsername())
					.content(message.getContent())
					.sentAt(message.getSentAt())
					.build());
		}
		return messageDtos;
	}
}
