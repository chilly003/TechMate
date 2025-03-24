package io.ssafy.p.s12b201.techmate.global.api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ChatRequestDto {
    private String model;
    private List<MessageDto> messages;
    private Boolean stream;
}