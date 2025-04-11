package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ChatResponseDto {
    private String id;
    private String object;
    private Long created;
    private String model;
    private List<ChoiceDto> choices;
    private UsageDto usage;
    private String systemFingerprint;
}