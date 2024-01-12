package com.scootshare.base.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionsDto {

    private RentalDto rentalDto;

    private double totalPrice;

    private double kilometersPassed;

    private Date timeOfTransaction;
    
    private boolean wasLate;
}
