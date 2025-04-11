package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsageDto {
    private Integer promptTokens;
    private Integer completionTokens;
    private Integer totalTokens;
}