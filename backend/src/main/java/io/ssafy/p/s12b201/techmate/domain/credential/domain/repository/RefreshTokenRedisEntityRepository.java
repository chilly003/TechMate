package io.ssafy.p.s12b201.techmate.domain.credential.domain.repository;


import io.ssafy.p.s12b201.techmate.domain.credential.domain.RefreshTokenRedisEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RefreshTokenRedisEntityRepository
        extends CrudRepository<RefreshTokenRedisEntity, String> {
    Optional<RefreshTokenRedisEntity> findByRefreshToken(String refreshToken);
}
