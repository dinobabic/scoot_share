package com.scootshare.base.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.scootshare.base.entities.ChatRoom;
import com.scootshare.base.entities.User;
import com.scootshare.base.repositories.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

	private final ChatRoomRepository repository;
	
	public ChatRoom save(ChatRoom chatRoom) {
		return repository.save(chatRoom);
	}

	public boolean checkIfRoomExists(User user, User otherUser) {
		List<ChatRoom> chatRooms = getChatRoomsForUser(user.getUsername());
		for (ChatRoom room : chatRooms) {
			String[] roomIdSplit = room.getId().split("_");
			if ((roomIdSplit[0].equals(otherUser.getUsername()) && roomIdSplit[1].equals(user.getUsername())) || 
					roomIdSplit[0].equals(user.getUsername()) && roomIdSplit[1].equals(otherUser.getUsername())) {
				return true;
			}
		}
 		
		return false;
	}

	public List<ChatRoom> getChatRoomsForUser(String username) {
		return repository.findAllByUser(username);
	}

	public ChatRoom findChatRoomForSenderAndReceiver(String sender, String receiver) {
		String id = sender + "_" + receiver;
		return repository.findById(id).orElseGet(() -> null);
	}
}
