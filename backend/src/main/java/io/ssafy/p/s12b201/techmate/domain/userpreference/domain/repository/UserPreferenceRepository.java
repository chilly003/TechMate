package io.ssafy.p.s12b201.techmate.domain.userpreference.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
}
