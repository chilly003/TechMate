package io.ssafy.p.s12b201.techmate.domain.user.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
