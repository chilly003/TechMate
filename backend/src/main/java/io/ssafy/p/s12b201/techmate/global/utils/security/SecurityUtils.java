package io.ssafy.p.s12b201.techmate.global.utils.security;

import io.ssafy.p.s12b201.techmate.global.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw UnauthorizedException.EXCEPTION;
        }

        String principal = authentication.getName();

        if ("anonymousUser".equals(principal)) {
            throw UnauthorizedException.EXCEPTION;
        }

        try {
            return Long.valueOf(principal);
        } catch (NumberFormatException e) {
            throw UnauthorizedException.EXCEPTION;
        }

    }

}
