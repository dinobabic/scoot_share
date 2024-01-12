package com.scootshare.base.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateUserDto {
	private String firstName;
	private String lastName;
	private String email;
	private String nickname;
	private String cardNumber;
	private String password;
	private String username;
	private boolean showFirstName;
    private boolean showLastName;
    private boolean showNickname;
    private boolean showEmail;
}
