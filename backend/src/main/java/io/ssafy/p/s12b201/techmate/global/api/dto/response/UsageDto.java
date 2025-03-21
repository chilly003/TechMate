package io.ssafy.p.s12b201.techmate.global.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsageDto {
    private Integer promptTokens;
    private Integer completionTokens;
    private Integer totalTokens;
}