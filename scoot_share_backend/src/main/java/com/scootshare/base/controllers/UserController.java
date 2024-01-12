package com.scootshare.base.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.scootshare.base.dto.UpdateUserDto;
import com.scootshare.base.dto.UserDto;
import com.scootshare.base.entities.User;
import com.scootshare.base.services.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
	
	@Autowired
	private UserService userService;
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/getUsernameById/{id}")
	public ResponseEntity<?> getUsernameById(@PathVariable Long id) {
		return ResponseEntity.ok(userService.findById(id).getUsername());
	}
	
	@GetMapping("{username}")
	public ResponseEntity<UserDto> getUserByEmail(@PathVariable String username) {
		User user = userService.findByUsername(username);
		UserDto userDto = UserDto.builder()
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.nickname(user.getNickname())
				.cardNumber(user.getCardNumber())
				.username(user.getUsername())
				.showFirstName(user.isShowFirstName())
				.showLastName(user.isShowLastName())
				.showEmail(user.isShowEmail())
				.showNickname(user.isShowNickname())
				.build();
		return ResponseEntity.ok(userDto);
	}
	
	@PutMapping("/update")
	public void updateUser(@RequestBody UpdateUserDto userDto) {
		User user = userService.findByEmail(userDto.getEmail());
		user.setUsername(userDto.getUsername());
		user.setFirstName(userDto.getFirstName());
		user.setLastName(userDto.getLastName());
		user.setNickname(userDto.getNickname());
		user.setIdCard(userDto.getCardNumber());
		user.setUsername(userDto.getUsername());
		user.setShowFirstName(userDto.isShowFirstName());
		user.setShowLastName(userDto.isShowLastName());
		user.setShowNickname(userDto.isShowNickname());
		user.setShowEmail(userDto.isShowEmail());
		if (!userDto.getPassword().equals("")) {
			user.setPassword(passwordEncoder.encode(userDto.getPassword()));
		}
		userService.store(user);
	}
	
	@GetMapping("/viewUser/{username}")
	public ResponseEntity<UserDto> viewUser(@PathVariable String username) {
		User user = userService.findByUsername(username);
		
		UserDto userDto = UserDto.builder()
				.showFirstName(user.isShowFirstName())
				.showLastName(user.isShowLastName())
				.showNickname(user.isShowNickname())
				.showEmail(user.isShowEmail())
				.build();
		
		userDto.setUsername(user.getUsername());
		if (user.isShowFirstName())
			userDto.setFirstName(user.getFirstName());
		if (user.isShowLastName())
			userDto.setLastName(user.getLastName());
		if (user.isShowNickname())
			userDto.setNickname(user.getNickname());
		if (user.isShowEmail())
			userDto.setEmail(user.getEmail());
		
		return ResponseEntity.ok(userDto);
	}
}
