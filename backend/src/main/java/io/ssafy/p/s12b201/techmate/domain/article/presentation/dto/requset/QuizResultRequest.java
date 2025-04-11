package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset;

import lombok.Getter;

@Getter
public class QuizResultRequest {

    private Long quizId;
    private Long selectedOptionId;

}
