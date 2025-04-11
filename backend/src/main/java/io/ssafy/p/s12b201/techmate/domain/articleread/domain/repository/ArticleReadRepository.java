package io.ssafy.p.s12b201.techmate.domain.articleread.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.articleread.domain.ArticleRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArticleReadRepository extends JpaRepository<ArticleRead, Long> {
    Optional<ArticleRead> findByUserIdAndArticleId(Long userId, Long articleId);

    /**
     * 읽은 횟수를 기준으로 상위 기사 ID와 조회수를 반환
     * @param limit 가져올 기사 수
     * @param offset 건너뛸 기사 수
     * @return [article_id, count] 형태의 배열 리스트
     */
    @Query(value =
            "SELECT article_id, COUNT(*) as read_count FROM article_reads " +
                    "GROUP BY article_id " +
                    "ORDER BY read_count DESC " +
                    "LIMIT :limit OFFSET :offset",
            nativeQuery = true)
    List<Object[]> findTopArticlesByReadCount(@Param("limit") int limit, @Param("offset") long offset);

    /**
     * 특정 사용자가 읽은 기사 수 조회
     */
    int countByUserId(Long userId);
}
