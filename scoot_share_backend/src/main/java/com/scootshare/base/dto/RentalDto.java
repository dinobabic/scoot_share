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
public class RentalDto {

	private long listingId;
	
	private String scooterRenterUsername;
	
	private String scooterOwner;
	
	private Date rentalTimeStart;
	
	private Date rentalTimeEnd;
}
