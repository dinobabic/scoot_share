package com.scootshare.base.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.scootshare.base.dto.MessageNotification;
import com.scootshare.base.dto.ChatRoomDto;
import com.scootshare.base.dto.MessageDto;
import com.scootshare.base.entities.ChatRoom;
import com.scootshare.base.entities.Message;
import com.scootshare.base.entities.Notification;
import com.scootshare.base.entities.User;
import com.scootshare.base.services.ChatRoomService;
import com.scootshare.base.services.MessageService;
import com.scootshare.base.services.NotificationService;
import com.scootshare.base.services.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/messages")
@CrossOrigin
public class MessageController {

	private final ChatRoomService chatRoomService;
	private final UserService userService;
	private final MessageService messageService;
	private final SimpMessagingTemplate messagingTemplate;
	private final NotificationService notificationService;
	
	@GetMapping("/createChatRoom/{username}")
	public void createChatRoom(@PathVariable String username, @AuthenticationPrincipal User user) {
		user = userService.findByUsername(user.getUsername());
		User otherUser = userService.findByUsername(username);
		
		if (!chatRoomService.checkIfRoomExists(user, otherUser)) {
			ChatRoom chatRoom = new ChatRoom();
			chatRoom.addUser(user);
			chatRoom.addUser(otherUser);
			chatRoom.setId(user.getUsername() + "_" + otherUser.getUsername());
			chatRoomService.save(chatRoom);
			
			chatRoom = new ChatRoom();
			chatRoom.addUser(user);
			chatRoom.addUser(otherUser);
			chatRoom.setId(otherUser.getUsername() + "_" + user.getUsername());
			chatRoomService.save(chatRoom);
		}
	}
	
	@GetMapping("/getMessages/{sender}/{receiver}")
	public List<MessageDto> getMessages(@PathVariable String sender, @PathVariable String receiver) {
		return messageService.findByUsers(sender, receiver);
	}
	
	@GetMapping("/getChatRooms/{username}")
	public List<ChatRoomDto> getChatRooms(@PathVariable String username) {
		List<ChatRoom> chatRooms = chatRoomService.getChatRoomsForUser(username);
		
		return chatRooms.stream().map((room) -> {
				ChatRoomDto chatRoomDto = new ChatRoomDto();
				room.getUsers().stream().forEach((user) -> chatRoomDto.addUser(user.getUsername()));
				return chatRoomDto;
			}).collect(Collectors.toList());
	}
	
	@MessageMapping("/chat")
	public void chat(@Payload MessageDto messageDto) {
		ChatRoom chatRoomFirst = chatRoomService.findChatRoomForSenderAndReceiver(messageDto.getSender(), messageDto.getReceiver());
		ChatRoom chatRoomSecond = chatRoomService.findChatRoomForSenderAndReceiver(messageDto.getReceiver(), messageDto.getSender());
	
		Message message = Message.builder()
				.receiver(userService.findByUsername(messageDto.getReceiver()))
				.sender(userService.findByUsername(messageDto.getSender()))
				.content(messageDto.getContent())
				.sentAt(messageDto.getSentAt())
				.chatRoom(chatRoomFirst)
				.build();
		messageService.save(message);
		
		message = Message.builder()
				.receiver(userService.findByUsername(messageDto.getReceiver()))
				.sender(userService.findByUsername(messageDto.getSender()))
				.content(messageDto.getContent())
				.sentAt(messageDto.getSentAt())
				.chatRoom(chatRoomSecond)
				.build();
		messageService.save(message);
		
		messagingTemplate.convertAndSend(
				"/user/" + messageDto.getReceiver() + "/queue/messages",
				MessageNotification.builder()
					.sender(message.getSender().getUsername())
					.receiver(message.getReceiver().getUsername())
					.content(message.getContent())
					.sentAt(messageDto.getSentAt())
					.build());
		
		Notification notification = Notification.builder()
				.receiverUsername(messageDto.getReceiver())
				.senderUsername(messageDto.getSender())
				.type("MESSAGE")
				.build();
		
		notification = notificationService.save(notification);
		
		messagingTemplate.convertAndSend(
				"/user/" + messageDto.getReceiver() + "/queue/notifications",
				notification);
	}
}
