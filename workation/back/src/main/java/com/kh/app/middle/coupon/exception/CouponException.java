package com.kh.app.middle.coupon.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CouponException {;

    private final HttpStatus status;
    private final String msg;

}
