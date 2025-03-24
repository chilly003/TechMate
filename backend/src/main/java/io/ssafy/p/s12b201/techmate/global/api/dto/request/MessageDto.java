package io.ssafy.p.s12b201.techmate.global.api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MessageDto {
    private String role;
    private String content;
}