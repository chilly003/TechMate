package io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserNicknameResponse {
    private String nickname;
    private String oauthProvider;
}
