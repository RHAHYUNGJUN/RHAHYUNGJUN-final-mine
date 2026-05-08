package com.kh.app.security.user;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UserVo {

    private Long id;

    private String username;

    private String password;

    private List<String> roles;

    private String banYn;
}