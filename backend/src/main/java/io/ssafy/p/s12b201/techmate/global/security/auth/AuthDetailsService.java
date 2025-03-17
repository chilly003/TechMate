package io.ssafy.p.s12b201.techmate.global.security.auth;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.user.domain.repository.UserRepository;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        User user =
                userRepository
                        .findById(Long.valueOf(id))
                        .orElseThrow(() -> UserNotFoundException.EXCEPTION);
        return new AuthDetails(user.getId().toString(), user.getAccountRole().getValue());
    }
}
