package io.ssafy.p.s12b201.techmate.domain.quizresult.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.quizresult.domain.QuizResult;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    /**
     * 특정 사용자가 풀이한 퀴즈 수 조회
     */
    int countByUserId(Long userId);

    /**
     * 특정 사용자의 정답인 퀴즈 풀이 날짜 목록 조회
     */
    @Query("SELECT qr.createdAt FROM QuizResult qr WHERE qr.user.id = :userId AND qr.isCorrect = true ORDER BY qr.createdAt DESC")
    List<LocalDateTime> findCorrectSolvedDatesByUserId(@Param("userId") Long userId);

    List<QuizResult> findAllByArticleIdAndUserOrderByQuizIdAsc(Long articleId, User user);

    Boolean existsByArticleIdAndUser(Long articleId, User user);

    /**
     * 날짜별 고유 기사 ID 개수 조회
     * @return [날짜, 고유 기사 수] 형태의 배열 리스트
     */
    @Query(value = "SELECT DATE(created_at) as quiz_date, COUNT(DISTINCT article_id) as article_count " +
            "FROM quiz_results " +
            "WHERE user_id = :userId " +
            "GROUP BY DATE(created_at) " +
            "ORDER BY quiz_date DESC",
            nativeQuery = true)
    List<Object[]> countDistinctArticlesByDateAndUserId(@Param("userId") Long userId);

    /**
     * 사용자가 풀이한 고유 기사 ID 개수 조회
     */
    @Query(value = "SELECT COUNT(DISTINCT article_id) FROM quiz_results WHERE user_id = :userId", nativeQuery = true)
    int countDistinctArticleIdByUserId(@Param("userId") Long userId);

    List<QuizResult> findAllByArticleId(Long articleId);
}
