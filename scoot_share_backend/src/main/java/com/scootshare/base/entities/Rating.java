package com.scootshare.base.entities;

import java.util.Date;

import jakarta.persistence.*;
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
@Entity
public class Rating {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "sender_id")
	private User ratingSender;
	
	@ManyToOne
    @JoinColumn(name = "receiver_id")
	private User ratingReceiver;

	private int grade;
	
	private String comment;
	
	private Date ratingTime;
}
