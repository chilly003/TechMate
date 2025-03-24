package io.ssafy.p.s12b201.techmate.domain.userpreference.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    List<UserPreference> findByUserId(Long userId);
}
