package com.scootshare.base.dto;

import java.util.Date;

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
public class MessageNotification {

	private String sender;
	private String receiver;
	private String content;
	private Date sentAt;
	private String type;
}
