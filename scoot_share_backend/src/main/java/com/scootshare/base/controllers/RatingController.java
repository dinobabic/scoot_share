package com.scootshare.base.controllers;

import com.scootshare.base.dto.RatingDto;
import com.scootshare.base.entities.Notification;
import com.scootshare.base.entities.Rating;
import com.scootshare.base.services.NotificationService;
import com.scootshare.base.services.RatingService;
import com.scootshare.base.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@CrossOrigin
public class RatingController {

    private final RatingService ratingService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/getRatingsReceiver/{receiver}")
    private List<RatingDto> getRatingsReceiver(@PathVariable String receiver) {
        return ratingService.getRatingsReceiver(userService.findByUsername(receiver))
        		.stream()
        		.map(rating -> RatingDto.builder()
        			.ratingReceiver(receiver)
        			.ratingSender(rating.getRatingSender().getUsername())
        			.grade(rating.getGrade())
        			.comment(rating.getComment())
        			.ratingTime(rating.getRatingTime())
        			.build())
        		.collect(Collectors.toList());
    }

    @GetMapping("/getRatingsSender/{sender}")
    private List<RatingDto> getRatingsSender(@PathVariable String sender) {
        return ratingService.getRatingsSender(userService.findByUsername(sender))
        		.stream()
        		.map(rating -> RatingDto.builder()
        				.ratingSender(sender)
            			.ratingReceiver(rating.getRatingReceiver().getUsername())
            			.grade(rating.getGrade())
            			.comment(rating.getComment())
            			.ratingTime(rating.getRatingTime())
        			.build())
        		.collect(Collectors.toList());
    }

    @PostMapping("/save")
    public void save(@RequestBody RatingDto ratingDto) {
        Rating rating = Rating.builder()
            .ratingSender(userService.findByUsername(ratingDto.getRatingSender()))
            .ratingReceiver(userService.findByUsername(ratingDto.getRatingReceiver()))
            .grade(ratingDto.getGrade())
            .comment(ratingDto.getComment())
            .ratingTime(ratingDto.getRatingTime())
            .build();

        ratingService.save(rating);

        Notification notification = Notification.builder()
                .receiverUsername(rating.getRatingReceiver().getUsername())
                .senderUsername(ratingDto.getRatingSender())
                .type("RATING")
                .build();

        notification = notificationService.save(notification);

        messagingTemplate.convertAndSend(
                "/user/" + notification.getReceiverUsername() + "/queue/notifications",
                notification);
    }
}
