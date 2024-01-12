package com.scootshare.base.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomDto {

	private List<String> users;
	
	public void addUser(String username) {
		if (users == null) {
			users = new ArrayList<>();
		}
		users.add(username);
	}
}
