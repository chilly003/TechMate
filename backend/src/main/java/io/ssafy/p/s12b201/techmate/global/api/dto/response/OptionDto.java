package io.ssafy.p.s12b201.techmate.global.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OptionDto {
    @JsonProperty("option_id")
    private final Integer optionId;

    private final String text;

    @JsonProperty("is_correct")
    private final Boolean isCorrect;
}