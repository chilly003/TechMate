package io.ssafy.p.s12b201.techmate.domain.credential.service;


import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.UnlinkRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.OauthTokenInfoDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.UserInfoToOauthDto;

public interface OauthStrategy {

    OIDCDecodePayload getOIDCDecodePayload(String token);
    String getOauthLink();
    OauthTokenInfoDto getOauthToken(String code);
    UserInfoToOauthDto getUserInfo(String oauthAccessToken);
    void unLink(UnlinkRequest unlinkRequest);

}
