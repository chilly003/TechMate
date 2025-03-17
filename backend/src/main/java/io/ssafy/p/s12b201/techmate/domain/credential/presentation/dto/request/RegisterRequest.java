package io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterRequest {

    private String nickname;

    private String profilePath;

}
