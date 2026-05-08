package com.kh.app.security.filter;

import com.kh.app.security.user.CustomUserDetails;
import com.kh.app.security.user.UserVo;
import com.kh.app.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();

        if (uri.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }
        String authorization = request.getHeader("Authorization");

        if(authorization == null || !authorization.startsWith("Bearer ")){  //느낌표 주의 ,,,
            System.out.println("토큰 없음 ...");
            filterChain.doFilter(request,response);
            return;
        }

        String token = authorization.split(" ")[1]; // "Bearer " 뒤에 있는 토큰 얻기
        if(jwtUtil.isExpired(token)){
            System.out.println("토큰 만료 ...");
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        UserVo vo = new UserVo();
        vo.setUsername(username);
        vo.setRole(role);
        CustomUserDetails userDetails = new CustomUserDetails(vo);

        Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);


    }



}
