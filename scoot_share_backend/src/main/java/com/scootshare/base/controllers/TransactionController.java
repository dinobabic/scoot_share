package com.scootshare.base.controllers;

import com.scootshare.base.dto.RentalDto;
import com.scootshare.base.dto.TransactionsDto;
import com.scootshare.base.services.ListingService;
import com.scootshare.base.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin
public class TransactionController {

    private final TransactionService service;
    private final ListingService listingService;

    @GetMapping("/{username}")
    private List<TransactionsDto> getTransactions(@PathVariable String username){
        return service.getTransactions(username).stream().map(transaction -> {
        	TransactionsDto dto = TransactionsDto.builder()
                    .rentalDto(RentalDto.builder()
                        	.listingId(transaction.getRental().getListing().getId())
                        	.scooterRenterUsername(transaction.getRental().getScooterRenter().getUsername())
                        	.scooterOwner(transaction.getRental().getListing().getScooter().getOwner().getUsername())
                        	.rentalTimeStart(transaction.getRental().getRentalTimeStart())
                        	.rentalTimeEnd(transaction.getRental().getRentalTimeEnd())
                        	.build())
                        .totalPrice(transaction.getTotalPrice())
                        .kilometersPassed(transaction.getKilometersPassed())
                        .timeOfTransaction(transaction.getTimeOfTransaction())
                        .build();
        	dto.setWasLate(dto.getTotalPrice() - dto.getKilometersPassed() * listingService.findById(dto.getRentalDto().getListingId()).getPricePerKilometer() > 1);
        	return dto;
        }).collect(Collectors.toList());
    }
}
