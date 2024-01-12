package com.scootshare.base.services;

import com.scootshare.base.entities.Scooter;
import com.scootshare.base.entities.User;
import com.scootshare.base.repositories.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User findByUsername(String username) {
    	return userRepository.findByUsername(username).orElseThrow();
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public void store(User user) {
        userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public void deleteById(long id){
        userRepository.deleteById(id);
    }
    
    public boolean existsUser(long id){
        return userRepository.existsById(id);
    }
    
    public void addScooter(Scooter scooter, User owner) {
    	owner.addScooter(scooter);
    }
    
    @Transactional
	public void deleteByEmail(String email) {
		userRepository.deleteByEmail(email);
	}

	public void deleteByUsername(String username) {
		userRepository.deleteByUsername(username);
	}

	public User findById(Long id) {
		return userRepository.findById(id).get();
	}
}
