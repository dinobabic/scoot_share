package com.scootshare.base.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "scooter")
public class Scooter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
    @JoinColumn(name = "owner_id")
	private User owner;
	
	@ElementCollection
    @CollectionTable(name = "scooter_images", joinColumns = @JoinColumn(name = "scooter_id"))
    @Column(name = "image")
	private List<String> images = new ArrayList<>(); 

	@OneToMany(mappedBy = "scooter", cascade = CascadeType.ALL)
    private List<Listing> listings = new ArrayList<>();
	
	public void addListing(Listing listing) {
		if (listings == null) {
			listings = new ArrayList<>();
		}
		listings.add(listing);
	}
}
