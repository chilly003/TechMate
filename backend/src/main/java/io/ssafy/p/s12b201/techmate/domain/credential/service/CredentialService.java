package io.ssafy.p.s12b201.techmate.domain.credential.service;

import io.ssafy.p.s12b201.techmate.domain.credential.domain.RefreshTokenRedisEntity;
import io.ssafy.p.s12b201.techmate.domain.credential.domain.repository.RefreshTokenRedisEntityRepository;
import io.ssafy.p.s12b201.techmate.domain.credential.exception.NotNullTokenException;
import io.ssafy.p.s12b201.techmate.domain.credential.exception.RefreshTokenExpiredException;
import io.ssafy.p.s12b201.techmate.domain.credential.exception.UserIdMismatchException;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.RegisterRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request.UnlinkRequest;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.AfterOauthResponse;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.AuthTokensResponse;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.CheckRegisteredResponse;
import io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response.OauthTokenInfoDto;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.user.domain.repository.UserRepository;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.UserInfoToOauthDto;
import io.ssafy.p.s12b201.techmate.global.exception.AlreadyRegisterException;
import io.ssafy.p.s12b201.techmate.global.exception.InvalidTokenException;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import io.ssafy.p.s12b201.techmate.global.security.JwtTokenProvider;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;


@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class CredentialService {

    private final OauthFactory oauthFactory;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRedisEntityRepository refreshTokenRedisEntityRepository;
    private final UserUtils userUtils;

    public void singUpTest(){
        User user =
                User.builder()
                        .oauthProvider(UUID.randomUUID().toString())
                        .oauthId(UUID.randomUUID().toString())
                        .nickname(generateDefaultNickname())
                        .isNew(true)
                        .build();
        userRepository.save(user);
    }

    public AuthTokensResponse testLogin(Long userId){
        User user = userUtils.getUserById(userId);
        String accessToken = jwtTokenProvider.generateAccessToken(userId, user.getAccountRole());
        String refreshToken = generateRefreshToken(userId);
        return AuthTokensResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken).build();
    }

    @Transactional(readOnly = true)
    public String getOauthLink(OauthProvider oauthProvider) {
        OauthStrategy oauthStrategy = oauthFactory.getOauthstrategy(oauthProvider);
        return oauthStrategy.getOauthLink();
    }

    @Transactional(readOnly = true)
    public AfterOauthResponse getTokenToCode(OauthProvider oauthProvider, String code) {
        OauthStrategy oauthStrategy = oauthFactory.getOauthstrategy(oauthProvider);
        OauthTokenInfoDto oauthToken = oauthStrategy.getOauthToken(code);
        return new AfterOauthResponse(oauthToken.getIdToken(),oauthToken.getAccessToken());
    }

    @Transactional(readOnly = true)
    public CheckRegisteredResponse getUserAvailableRegister(String token, OauthProvider oauthProvider) {
        OauthStrategy oauthstrategy = oauthFactory.getOauthstrategy(oauthProvider);
        OIDCDecodePayload oidcDecodePayload = oauthstrategy.getOIDCDecodePayload(token);
        Boolean isRegistered = !checkUserCanRegister(oidcDecodePayload, oauthProvider);
        return new CheckRegisteredResponse(isRegistered);
    }

    public AuthTokensResponse registerUser(
            String token, OauthProvider oauthProvider, RegisterRequest registerRequest) {

        log.info("=== register [service]  ===");
        log.info("token={}", token);
        OauthStrategy oauthStrategy = oauthFactory.getOauthstrategy(oauthProvider);
        OIDCDecodePayload oidcDecodePayload = oauthStrategy.getOIDCDecodePayload(token);

        if (!checkUserCanRegister(oidcDecodePayload, oauthProvider)) {
            throw AlreadyRegisterException.EXCEPTION;
        }

        User user =
                User.builder()
                        .oauthProvider(oauthProvider.getValue())
                        .oauthId(oidcDecodePayload.getSub())
                        .nickname(registerRequest.getNickname())
                        .isNew(true)
                        .build();
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getAccountRole());
        String refreshToken = generateRefreshToken(user.getId());

        return AuthTokensResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .isNew(user.getIsNew())
                .build();
    }


    public AuthTokensResponse loginUserByOCIDToken(String token, OauthProvider oauthProvider) {
        OauthStrategy oauthStrategy = oauthFactory.getOauthstrategy(oauthProvider);
        OIDCDecodePayload oidcDecodePayload = oauthStrategy.getOIDCDecodePayload(token);

        User user =
                userRepository
                        .findByOauthIdAndOauthProvider(
                                oidcDecodePayload.getSub(), oauthProvider.getValue())
                        .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getAccountRole());
        String refreshToken = generateRefreshToken(user.getId());

        return AuthTokensResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .isNew(user.getIsNew())
                .build();
    }

    public void logout() {
        User user = userUtils.getUserFromSecurityContext();
        refreshTokenRedisEntityRepository.deleteById(user.getId().toString());
    }

    public AuthTokensResponse tokenRefresh(String requestRefreshToken) {

        log.info(requestRefreshToken);

        Optional<RefreshTokenRedisEntity> entityOptional =
                refreshTokenRedisEntityRepository.findByRefreshToken(requestRefreshToken);

        RefreshTokenRedisEntity refreshTokenRedisEntity =
                entityOptional.orElseThrow(() -> RefreshTokenExpiredException.EXCEPTION);

        Long userId = jwtTokenProvider.parseRefreshToken(requestRefreshToken);

        if (!userId.toString().equals(refreshTokenRedisEntity.getId())) {
            throw InvalidTokenException.EXCEPTION;
        }

        User user = userUtils.getUserById(userId);
        User loginUser = userUtils.getUserFromSecurityContext();

        if (user != loginUser) {
            throw UserNotFoundException.EXCEPTION;
        }

        String accessToken = jwtTokenProvider.generateAccessToken(userId, user.getAccountRole());
        String refreshToken = generateRefreshToken(user.getId());

        return AuthTokensResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public void deleteUser(String oauthAccessToken) {
        User user = userUtils.getUserFromSecurityContext();
        OauthProvider provider = OauthProvider.valueOf(user.getOauthProvider().toUpperCase());
        OauthStrategy oauthStrategy = oauthFactory.getOauthstrategy(provider);
        String userOauthId = user.getOauthId();

        UserInfoToOauthDto userInfo = oauthStrategy.getUserInfo(oauthAccessToken);

        log.info("userInfodto={}", userInfo.getId());

        verifyUserOauthIdWithAccessToken(oauthAccessToken,userOauthId,userInfo);

        deleteUserData(user);

        UnlinkRequest unlinkRequest = createUnlinkRequest(oauthAccessToken);
        oauthStrategy.unLink(unlinkRequest);
    }


    private void verifyUserOauthIdWithAccessToken(String oauthAccessToken, String oauthId, UserInfoToOauthDto userInfo) {

        if(oauthAccessToken == null) {
            throw NotNullTokenException.EXCEPTION;
        }

        if (!userInfo.getId().equals(oauthId)) {
            throw UserIdMismatchException.EXCEPTION;
        }
    }

    private UnlinkRequest createUnlinkRequest(String oauthAccessToken) {
        return UnlinkRequest.builder().accessToken(oauthAccessToken).build();
    }

    private void deleteUserData(User user) {
        refreshTokenRedisEntityRepository.deleteById(user.getId().toString());
        userRepository.delete(user);
    }

    private String generateDefaultNickname() {
        return "user-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private Boolean checkUserCanRegister(
            OIDCDecodePayload oidcDecodePayload, OauthProvider oauthProvider) {
        Optional<User> user =
                userRepository.findByOauthIdAndOauthProvider(
                        oidcDecodePayload.getSub(), oauthProvider.getValue());
        return user.isEmpty();
    }

    private String generateRefreshToken(Long userId) {
        String refreshToken = jwtTokenProvider.generateRefreshToken(userId);
        Long tokenExpiredAt = jwtTokenProvider.getRefreshTokenTTlSecond();
        RefreshTokenRedisEntity build =
                RefreshTokenRedisEntity.builder()
                        .id(userId.toString())
                        .refreshTokenTtl(tokenExpiredAt)
                        .refreshToken(refreshToken)
                        .build();
        refreshTokenRedisEntityRepository.save(build);
        return refreshToken;
    }

}

