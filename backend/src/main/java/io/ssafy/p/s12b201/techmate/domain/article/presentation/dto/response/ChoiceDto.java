package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.MessageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChoiceDto {
    private Integer index;
    private MessageDto message;
    private Object logprobs;
    private String finishReason;
}