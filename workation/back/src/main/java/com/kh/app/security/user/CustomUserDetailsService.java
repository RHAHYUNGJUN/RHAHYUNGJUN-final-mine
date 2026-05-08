package com.kh.app.security.user;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<MemberEntity> x = memberRepository.findByUsernameAndDelYn(username, "N");
        MemberEntity entity = x.orElseGet(() -> {throw new EntityNotFoundException();});
        UserVo userVo = new UserVo();
        userVo.setUsername(entity.getUsername());
        userVo.setPassword(entity.getPassword());
        userVo.setRole(entity.getRole());
        CustomUserDetails userDetails = new CustomUserDetails(userVo);
        return userDetails;
    }


}
