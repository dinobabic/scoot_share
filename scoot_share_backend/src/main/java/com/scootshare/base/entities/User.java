package com.scootshare.base.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name="users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    
    private String lastName;
    
    private String nickname;
    
    private String password;
    
    private String cardNumber;
    
    @Column(unique = true)
    private String email;
    
    private String username;

    private String idCard;
    private String certificateOfNoCriminalRecord;
    
    private boolean showFirstName;
    private boolean showLastName;
    private boolean showNickname;
    private boolean showEmail;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Authority> authorities = new HashSet<>();
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Scooter> scooters = new ArrayList<>();
    
    @ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
		name = "user_chat_room",
		joinColumns = @JoinColumn(name = "user_id"),
		inverseJoinColumns = @JoinColumn(referencedColumnName = "id", name = "chat_room_id")
	)
	private Set<ChatRoom> chatRooms = new HashSet<>();
	
	@OneToMany(mappedBy = "sender")
	private List<Message> sentMessages = new ArrayList<>();
	
	@OneToMany(mappedBy = "receiver")
	private List<Message> receivedMessages = new ArrayList<>();
	
	@OneToMany(mappedBy = "scooterRenter")
    private List<Rental> rentals =  new ArrayList<>();
	
	@OneToMany(mappedBy = "ratingReceiver", cascade = CascadeType.ALL)
	private List<Rating> ratingsReceived = new ArrayList<>();

    @OneToMany(mappedBy = "ratingSender", cascade = CascadeType.ALL)
    private List<Rating> ratingsSent = new ArrayList<>();

    protected User() {}

    public User(String firstName, String lastName, String nickname, String password, String cardNumber,
                String email, String idCard, String criminalRecord, String username) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickname = nickname;
        this.password = password;
        this.cardNumber = cardNumber;
        this.email = email;
        this.idCard = idCard;
        this.certificateOfNoCriminalRecord = criminalRecord;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getNickname() {
        return nickname;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void addAuthority(String authority) {
        Authority newAuthority = new Authority();
        newAuthority.setAuthority(authority);
        newAuthority.setUser(this);
        authorities.add(newAuthority);
    }

    public void removeAuthority(String authority) {
        authorities.removeIf(auth -> auth.getAuthority().equals(authority));
    }
    
    public void addScooter(Scooter scooter) {
    	scooter.setOwner(this);
    	scooters.add(scooter);
    }

	public void addChatRoom(ChatRoom chatRoom) {
		if (chatRooms == null) {
			chatRooms = new HashSet<>();
		}
		chatRooms.add(chatRoom);
	}
    
	public void addRental(Rental rental) {
		if (rentals == null) {
			rentals = new ArrayList<>();
		}
		rentals.add(rental);
	}
    
    public void addRatingReceived(Rating rating) {
        if(ratingsReceived == null) {
            ratingsReceived = new ArrayList<>();
        }
        ratingsReceived.add(rating);
    }

    public void addRatingSent(Rating rating) {
        if(ratingsSent == null) {
            ratingsSent = new ArrayList<>();
        }
        ratingsSent.add(rating);
    }
}
