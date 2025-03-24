package io.ssafy.p.s12b201.techmate.domain.articlelike.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.ArticleLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Long> {
    Optional<ArticleLike> findByUserIdAndArticleId(Long userId, Long articleId);
}
