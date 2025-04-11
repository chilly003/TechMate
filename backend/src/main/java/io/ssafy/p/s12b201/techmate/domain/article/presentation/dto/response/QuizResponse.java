package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@NoArgsConstructor
@Setter
public class QuizResponse {

    private Long articleId;

    private List<QuizDto> quizzes;

    private boolean quizAttemptStatus;

    private List<SelectOptionDto> selectOptions;

    public QuizResponse(Article article, boolean quizAttemptStatus, List<SelectOptionDto> selectOptions) {
        this.articleId = article.getArticleId();
        this.quizzes = article.getQuizzes();
        this.quizAttemptStatus = quizAttemptStatus;
        this.selectOptions = selectOptions;
    }
}
