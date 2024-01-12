package com.scootshare.base.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.scootshare.base.repositories.AuthorityRepository;

import jakarta.transaction.Transactional;

@Service
public class AuthorityService {

	@Autowired
	private AuthorityRepository repository;
	
	@Transactional
	public void deleteByUser(Long userId) {
		repository.deleteByUser(userId);
	}
}
