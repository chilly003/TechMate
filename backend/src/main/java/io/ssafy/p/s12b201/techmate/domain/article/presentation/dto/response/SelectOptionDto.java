package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@Setter
@NoArgsConstructor
public class SelectOptionDto {
    private Long quizId;
    private Long optionId;
}