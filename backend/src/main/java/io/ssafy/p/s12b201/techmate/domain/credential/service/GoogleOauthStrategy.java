package io.ssafy.p.s12b201.techmate.domain.credential.service;

import io.ssafy.p.s12b201.techmate.domain.credential.exception.NotNullTokenException;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.UnlinkRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.OauthTokenInfoDto;
import io.ssafy.p.s12b201.techmate.global.api.client.GoogleAuthClient;
import io.ssafy.p.s12b201.techmate.global.api.client.GoogleUnlinkClient;
import io.ssafy.p.s12b201.techmate.global.api.dto.OIDCKeysResponse;
import io.ssafy.p.s12b201.techmate.global.api.dto.OauthTokenResponse;
import io.ssafy.p.s12b201.techmate.global.api.dto.UserInfoToOauthDto;
import io.ssafy.p.s12b201.techmate.global.property.OauthProperties;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@AllArgsConstructor
@Component("GOOGLE")
public class GoogleOauthStrategy implements OauthStrategy{

    private final OauthProperties oauthProperties;
    private final GoogleAuthClient googleAuthClient;
    private final OauthOIDCProvider oauthOIDCProvider;
    private final GoogleUnlinkClient googleUnlinkClient;
    private static final String QUERY_STRING = "/o/oauth2/v2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=%s";
    private static final String scope = "https://www.googleapis.com/auth/userinfo.email";
    private static final String ISSUER = "https://accounts.google.com";
    private static final String PREFIX = "Bearer ";

    @Override
    public OIDCDecodePayload getOIDCDecodePayload(String token){
        OIDCKeysResponse oidcGoogleKeysResponse = googleAuthClient.getGoogleOIDCOpenKeys();
        return oauthOIDCProvider.getPayloadFromIdToken(token,ISSUER,oauthProperties.getGoogleClientId(),oidcGoogleKeysResponse);
    }

    @Override
    public String getOauthLink() {

        return oauthProperties.getGoogleBaseUrl()
                + String.format(
                QUERY_STRING,
                oauthProperties.getGoogleAppId(),
                oauthProperties.getGoogleRedirectUrl(),
                scope);
    }

    @Override
    public OauthTokenInfoDto getOauthToken(String code) {
        String decodedCode = URLDecoder.decode(code, StandardCharsets.UTF_8);

        OauthTokenResponse oauthTokenResponse = googleAuthClient
                .googleAuth(
                        oauthProperties.getGoogleAppId(),
                        oauthProperties.getGoogleRedirectUrl(),
                        decodedCode,
                        oauthProperties.getGoogleClientSecret());
        return OauthTokenInfoDto.builder()
                .idToken(oauthTokenResponse.getIdToken())
                .accessToken(oauthTokenResponse.getAccessToken())
                .build();

    }

    @Override
    public UserInfoToOauthDto getUserInfo(String accessToken){
        return googleAuthClient.getGoogleInfo(PREFIX + accessToken);
    }

    @Override
    public void unLink(UnlinkRequest unlinkRequest) {
        if (unlinkRequest.getAccessToken() == null) {
            throw NotNullTokenException.EXCEPTION;
        }
        googleUnlinkClient.unlink(unlinkRequest.getAccessToken());

    }
}
