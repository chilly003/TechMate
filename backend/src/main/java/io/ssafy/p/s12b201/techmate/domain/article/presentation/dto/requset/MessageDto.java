package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MessageDto {
    private String role;
    private String content;
}