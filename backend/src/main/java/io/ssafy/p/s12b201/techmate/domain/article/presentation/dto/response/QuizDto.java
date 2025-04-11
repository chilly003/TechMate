package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
public class QuizDto {
    @JsonProperty("quiz_id")
    @Field("quizId") // MongoDB 필드명과 일치
    private Integer quizId;

    @Field("question")
    private String question;

    @Field("options")
    private List<OptionDto> options;

    @JsonProperty("reason")
    @Field("reason")
    private String reason;
}