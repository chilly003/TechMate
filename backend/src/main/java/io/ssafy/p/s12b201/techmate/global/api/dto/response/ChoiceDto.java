package io.ssafy.p.s12b201.techmate.global.api.dto.response;

import io.ssafy.p.s12b201.techmate.global.api.dto.request.MessageDto;
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