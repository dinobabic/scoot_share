package com.scootshare.base.dto;

import java.util.Date;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListingDto {
	
	private Long listingId;
	
	private Long scooterId;
	
	private String location;
	
	private String returnLocation;
	
	private Date returnByTime;
	
	private double pricePerKilometer;
	
	private double lateReturnPenalty;	

}
