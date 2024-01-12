package com.scootshare.base.dto;

import java.util.List;

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
public class ScooterDto {

	private Long id;
	private List<String> images;
	private boolean hasListing;
	private boolean listingIsActive;
	
}
