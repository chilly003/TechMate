package io.ssafy.p.s12b201.techmate.domain.credential.service;


import io.ssafy.p.s12b201.techmate.domain.credential.exception.NotNullTokenException;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.UnlinkRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.OauthTokenInfoDto;
import io.ssafy.p.s12b201.techmate.global.api.client.KakaoOauthClient;
import io.ssafy.p.s12b201.techmate.global.api.client.KakaoUnlinkClient;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.OIDCKeysResponse;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.OauthTokenResponse;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.UserInfoToOauthDto;
import io.ssafy.p.s12b201.techmate.global.property.OauthProperties;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component("KAKAO")
@Slf4j
public class KaKaoOauthStrategy implements OauthStrategy {

    private final OauthProperties oauthProperties;
    private final KakaoOauthClient kakaoOauthClient;
    private final OauthOIDCProvider oauthOIDCProvider;
    private final KakaoUnlinkClient kakaoUnlinkClient;
    private static final String QUERY_STRING = "/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code";
    private static final String ISSUER = "https://kauth.kakao.com";
    private static final String PREFIX = "Bearer ";

    @Override
    public OIDCDecodePayload getOIDCDecodePayload(String token){
        OIDCKeysResponse oidcKakaoKeysResponse = kakaoOauthClient.getKakaoOIDCOpenKeys();
        return oauthOIDCProvider.getPayloadFromIdToken(token,ISSUER,oauthProperties.getKakaoClientId(),oidcKakaoKeysResponse);
    }

    @Override
    public String getOauthLink() {
        return oauthProperties.getKakaoBaseUrl()
                + String.format(
                QUERY_STRING,
                oauthProperties.getKakaoClientId(),
                oauthProperties.getKakaoRedirectUrl());
    }

    @Override
    public OauthTokenInfoDto getOauthToken(String code) {
        OauthTokenResponse oauthTokenResponse = kakaoOauthClient
                .kakaoAuth(
                        oauthProperties.getKakaoClientId(),
                        oauthProperties.getKakaoRedirectUrl(),
                        code);
        return OauthTokenInfoDto.builder()
                .idToken(oauthTokenResponse.getIdToken())
                .accessToken(oauthTokenResponse.getAccessToken())
                .build();
    }

    @Override
    public UserInfoToOauthDto getUserInfo(String oauthAccessToken) {
        return kakaoUnlinkClient.getKakaoInfo(PREFIX + oauthAccessToken);
    }

    @Override
    public void unLink(UnlinkRequest unlinkRequest) {
        if (unlinkRequest.getAccessToken() == null) {
            throw NotNullTokenException.EXCEPTION;
        }

        kakaoUnlinkClient.unlinkUser(PREFIX + unlinkRequest.getAccessToken());

    }
}
