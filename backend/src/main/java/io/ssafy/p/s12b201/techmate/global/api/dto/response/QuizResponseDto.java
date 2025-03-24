package io.ssafy.p.s12b201.techmate.global.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class QuizResponseDto {
    private final List<QuizDto> quizzes;
}