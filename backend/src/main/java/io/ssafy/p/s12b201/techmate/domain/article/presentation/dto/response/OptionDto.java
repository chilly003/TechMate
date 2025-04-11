package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class OptionDto {
    @JsonProperty("option_id")
    @Field("optionId") // MongoDB 필드명과 일치
    private Integer optionId;

    @Field("text")
    private String text;

    @JsonProperty("is_correct")
    @Field("isCorrect") // MongoDB 필드명과 일치
    private Boolean isCorrect;

    @JsonProperty("option_selection_rate")
    @Field("optionSelectionRate") //
    private Double optionSelectionRate;
}