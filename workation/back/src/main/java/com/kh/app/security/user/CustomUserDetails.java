package com.kh.app.security.user;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {
    private final UserVo vo;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (!StringUtils.hasText(vo.getRole())){
            return List.of();
        }
        return List.of(
                new SimpleGrantedAuthority(vo.getRole())
        );
    }

    @Override
    public @Nullable String getPassword() {
        return vo.getPassword();
    }

    @Override
    public String getUsername() {
        return vo.getUsername();
    }
}
