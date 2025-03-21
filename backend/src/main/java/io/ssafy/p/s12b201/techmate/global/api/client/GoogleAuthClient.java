package io.ssafy.p.s12b201.techmate.global.api.client;

import feign.Headers;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.OIDCKeysResponse;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.OauthTokenResponse;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.UserInfoToOauthDto;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "GoogleAuthClient", url = "https://www.googleapis.com/oauth2")
public interface GoogleAuthClient {

    @Headers("Content-type: application/x-www-form-urlencoded;charset=utf-8")
    @PostMapping(
            "/v4/token?grant_type=authorization_code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&code={CODE}&client_secret={CLIENT_SECRET}")
    OauthTokenResponse googleAuth(
            @PathVariable("CLIENT_ID") String clientId,
            @PathVariable("REDIRECT_URI") String redirectUri,
            @PathVariable("CODE") String code,
            @PathVariable("CLIENT_SECRET") String client_secret);

    @Cacheable(cacheNames = "GoogleOICD", cacheManager = "oidcKeyCacheManager")
    @GetMapping("/v3/certs")
    OIDCKeysResponse getGoogleOIDCOpenKeys();

    @GetMapping("/v1/userinfo?alt=json")
    UserInfoToOauthDto getGoogleInfo(@RequestHeader("Authorization") String token);
}

