package com.scootshare.base.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RatingDto {
    private String ratingSender;
    private String ratingReceiver;
    private int grade;
    private String comment;
    private Date ratingTime;
}
