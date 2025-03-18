package io.ssafy.p.s12b201.techmate.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = jwtTokenProvider.resolveToken(request);

        if (token != null) {

            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("============== 필터를 타는가=========");
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        List<String> excludePaths = Arrays.asList(
                "/api/v1/credentials/test-login",
                "/api/v1/credentials/sign-up-test",
                "/api/v1/credentials/oauth/link/kakao",
                "/api/v1/credentials/oauth/kakao",
                "/api/v1/credentials/oauth/link/google",
                "/api/v1/credentials/oauth/google",
                "/api/v1/credentials/oauth/valid/register",
                "/api/v1/credentials/login",
                "/api/v1/credentials/refresh"
        );

        if (path.equals("/api/v1/credentials") && "GET".equalsIgnoreCase(method)) {
            return true; // 필터를 타도록 설정
        }

        return excludePaths.stream().anyMatch(path::startsWith);
    }
}
