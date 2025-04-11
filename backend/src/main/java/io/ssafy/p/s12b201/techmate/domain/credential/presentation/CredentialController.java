package io.ssafy.p.s12b201.techmate.domain.credential.presentation;

import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.OauthCodeRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.RegisterRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.TokenRefreshRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.AfterOauthResponse;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.AuthTokensResponse;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.CheckRegisteredResponse;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.OauthLoginLinkResponse;
import io.ssafy.p.s12b201.techmate.domain.credential.service.CredentialService;
import io.ssafy.p.s12b201.techmate.domain.credential.service.OauthProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/credentials")
@RestController
public class CredentialController {

    private final CredentialService credentialService;

    @PostMapping("/test-login/{userId}")
    public AuthTokensResponse loginTest(@PathVariable("userId") Long userId){
        return credentialService.testLogin(userId);
    }

    @PostMapping("/sign-up-test")
    public void signUptTest(){
        credentialService.singUpTest();
    }

    @GetMapping("/oauth/link/kakao")
    public OauthLoginLinkResponse getKakaoOauthLink() {
        return new OauthLoginLinkResponse(credentialService.getOauthLink(OauthProvider.KAKAO));
    }

//    @GetMapping("/oauth/kakao")
//    public AfterOauthResponse kakaoAuth(OauthCodeRequest oauthCodeRequest) {
//        log.info("code ======================= 코드값 실행");
//        log.info("code = {}",oauthCodeRequest.getCode());
//        return credentialService.getTokenToCode(OauthProvider.KAKAO, oauthCodeRequest.getCode());
//    }

    @GetMapping("/oauth/kakao")
    public void kakaoAuth(OauthCodeRequest oauthCodeRequest) {
        log.info("code ======================= 코드값 실행");
        log.info("code = {}",oauthCodeRequest.getCode());
        // credentialService.getTokenToCode(OauthProvider.KAKAO, oauthCodeRequest.getCode());
    }

    @GetMapping("/oauth/link/google")
    public OauthLoginLinkResponse getGoogleOauthLink() {
        return new OauthLoginLinkResponse(credentialService.getOauthLink(OauthProvider.GOOGLE));
    }

    @GetMapping("/oauth/google")
    public void googleAuth(OauthCodeRequest oauthCodeRequest) {
        log.info("code = {}",oauthCodeRequest.getCode());
        // credentialService.getTokenToCode(OauthProvider.GOOGLE, oauthCodeRequest.getCode());
    }

    @GetMapping("/oauth/valid/register")
    public CheckRegisteredResponse valid(
            @RequestParam("code") String code,
            @RequestParam("provider") OauthProvider oauthProvider) {
        log.info("controller token = {}",code);
        return credentialService.getUserAvailableRegister(code, oauthProvider);
    }

    @PostMapping
    public AuthTokensResponse registerUser(
            @RequestParam("idToken") String token,
            @RequestParam("provider") OauthProvider oauthProvider,
            @RequestBody RegisterRequest registerRequest) {

        log.info("=========== register api start ============");
        log.info("[controller] register token = {}",token);
        return credentialService.registerUser(token, oauthProvider, registerRequest);
    }

    @PostMapping("/login")
    public AuthTokensResponse loginUser(
            @RequestParam("idToken") String token,
            @RequestParam("provider") OauthProvider oauthProvider) {
        return credentialService.loginUserByOCIDToken(token, oauthProvider);
    }

    @PostMapping("/logout")
    public void logout() {
        credentialService.logout();
    }

    @PostMapping("/refresh")
    public AuthTokensResponse refreshingToken(
            @RequestBody TokenRefreshRequest tokenRefreshRequest) {
        return credentialService.tokenRefresh(tokenRefreshRequest.getRefreshToken());
    }

    @DeleteMapping
    public void deleteUser(@RequestParam("code") String code) {

        log.info("======== delete api start ==========");
        log.info("[controller] delete token = {}",code);

        credentialService.deleteUser(code);
    }

}
