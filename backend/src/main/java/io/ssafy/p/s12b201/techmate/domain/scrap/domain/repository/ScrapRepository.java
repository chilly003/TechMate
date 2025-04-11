package io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Folder;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScrapRepository extends JpaRepository<Scrap, Long> {

    Slice<Scrap> findAllByFolder(Folder folder, Pageable pageable);

    Optional<Scrap> findByArticleIdAndUser(Long articleId,User user);

    boolean existsByArticleIdAndUser(Long articleId, User user);


    /**
     * 특정 사용자의 모든 스크랩 수 조회
     */
    int countByUserId(Long userId);

    boolean existsByUserIdAndArticleId(Long userId, Long articleId);

    Optional<Scrap> findByUserIdAndArticleId(Long userId, Long articleId);
}
