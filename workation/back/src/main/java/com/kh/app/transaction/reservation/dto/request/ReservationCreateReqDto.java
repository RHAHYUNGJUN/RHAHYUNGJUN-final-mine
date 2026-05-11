package com.kh.app.transaction.reservation.dto.request;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReservationCreateReqDto {

    private Long memberId;
    private Long couponId;
    private Long stayId;
    private Long officeId;

    private Integer guestCount;
    private String reserverName;

    private LocalDateTime checkinDate;
    private LocalDateTime checkoutDate;

    private String reserverPhone;
    private String reserverEmail;

    private Long originalPrice;
    private Long discountAmount;
    private Long totalPrice;
}