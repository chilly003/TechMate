package io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OauthTokenInfoDto {

    private String idToken;
    private String accessToken;
}
