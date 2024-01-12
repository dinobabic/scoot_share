package com.scootshare.base.controllers;

import com.scootshare.base.dto.UserDto;
import com.scootshare.base.entities.User;
import com.scootshare.base.services.AuthorityService;
import com.scootshare.base.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
	
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthorityService authorityService;

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDto>> getAllUsers(){
    	List<User> users = userService.getAllUsers();
    	List<UserDto> usersDtos = users.stream()
    			.filter((user) -> !List.copyOf(user.getAuthorities()).get(0).getAuthority().equals("ROLE_ADMIN"))
    			.map((user) -> UserDto
	    			.builder()
	    			.firstName(user.getFirstName())
	    			.lastName(user.getLastName())
	    			.email(user.getEmail())
	    			.nickname(user.getNickname())
	    			.idCard(user.getIdCard())
	    			.certificateOfNoCriminalRecord(user.getCertificateOfNoCriminalRecord())
	    			.authority(List.copyOf(user.getAuthorities()).get(0).getAuthority())
	    			.cardNumber(user.getCardNumber())
	    			.username(user.getUsername())
	    			.build())
    			.collect(Collectors.toList());
        return ResponseEntity.ok(usersDtos);
    }
    
    @DeleteMapping("/deleteUser/{username}")
    public void deleteUser(@PathVariable String username) {
    	userService.deleteByUsername(username);
    }

	@PutMapping("/acceptUser/{username}")
	public void acceptUser(@PathVariable String username) {
		User user = userService.findByUsername(username);
		authorityService.deleteByUser(user.getId());
		user.addAuthority("ROLE_CLIENT");
		user.removeAuthority("ROLE_PENDING_REGISTRATION");
		userService.store(user);
	}
}
