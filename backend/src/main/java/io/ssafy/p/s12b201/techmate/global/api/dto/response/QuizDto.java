package io.ssafy.p.s12b201.techmate.global.api.dto.response;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class QuizDto {

    @JsonProperty("quiz_id")
    private final Integer quizId;
    private final String question;
    private final List<OptionDto> options;
}