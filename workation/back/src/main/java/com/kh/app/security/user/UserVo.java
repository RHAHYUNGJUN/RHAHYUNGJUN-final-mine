package com.kh.app.security.user;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserVo {
    private String username;
    private String password;
    private List<String> role;


}
