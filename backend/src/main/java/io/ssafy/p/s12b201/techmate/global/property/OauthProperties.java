package io.ssafy.p.s12b201.techmate.global.property;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@AllArgsConstructor
@ConfigurationProperties("oauth")
public class OauthProperties {

    private OAuthSecret kakao;
    private OAuthSecret google;

    @Getter
    @Setter
    public static class OAuthSecret {
        private String baseUrl;
        private String clientId;
        private String clientSecret;
        private String redirectUrl;
        private String appId;
        private String adminKey;
    }
    public String getKakaoBaseUrl() {
        return kakao.getBaseUrl();
    }

    public String getKakaoClientId() {
        return kakao.getClientId();
    }

    public String getKakaoRedirectUrl() {
        return kakao.getRedirectUrl();
    }

    public String getKakaoClientSecret() {
        return kakao.getClientSecret();
    }

    public String getKakaoAppId() {
        return kakao.getAppId();
    }

    public String getKakaoAdminKey(){
        return kakao.getAdminKey();
    }

    public String getGoogleBaseUrl() {
        return google.getBaseUrl();
    }

    public String getGoogleClientId() {
        return google.getClientId();
    }

    public String getGoogleRedirectUrl() {
        return google.getRedirectUrl();
    }

    public String getGoogleClientSecret() {
        return google.getClientSecret();
    }

    public String getGoogleAppId() {
        return google.getAppId();
    }

}

