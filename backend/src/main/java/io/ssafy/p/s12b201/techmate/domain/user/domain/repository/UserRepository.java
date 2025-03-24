package io.ssafy.p.s12b201.techmate.domain.user.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByOauthIdAndOauthProvider(String oauthId, String oauthProvider);

}
