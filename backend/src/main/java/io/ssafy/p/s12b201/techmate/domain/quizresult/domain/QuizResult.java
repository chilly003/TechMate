package io.ssafy.p.s12b201.techmate.domain.quizresult.domain;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "quiz_result")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_result_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String articleId;
    private String quizId;
    private String selectedOptionId;
    private Boolean isCorrect;

    @Builder
    public QuizResult(User user, String articleId, String quizId, String selectedOptionId, Boolean isCorrect) {
        this.user = user;
        this.articleId = articleId;
        this.quizId = quizId;
        this.selectedOptionId = selectedOptionId;
        this.isCorrect = isCorrect;
    }
}
