package io.ssafy.p.s12b201.techmate.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /* 400 */
    NOT_NULL_TOKEN(400, "토큰 값이 NULL일 수 없습니다"),
    MISMATCH_USER_OAUTH_ID(400, "유저의  OAuth ID값이 토큰 ID 값과 일치하지 않습니다"),
    FOLDER_NAME_AlREADY_EXIST(400, "이미 존재하는 파일명 입니다"),
    SCRAP_AlREADY_EXIST(400, "이미 스크랩한 기사입니다"),
    FOLDER_NOT_HOST(400, "폴더의 주인이 아닙니다"),
    SCRAP_NOT_HOST(400, "스크랩의 주인이 아닙니다"),
    MEMO_NOT_HOST(400, "메모의 주인이 아닙니다"),


    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    INVALID_TOKEN(401, "토큰이 유효하지 않습니다."),
    EXPIRED_TOKEN(401, "토큰이 만료되었습니다."),

    /* 403 UNAUTHORIZED : 인가되지 않은 사용자 */
    REFRESH_TOKEN_EXPIRED_TOKEN(HttpStatus.FORBIDDEN.value(),"refreshToken 만료."),
    NECESSARY_LOGIN(403,"로그인이 반드시 필요한 서비스입니다"),
    /* 404 NOT_FOUND : Resource를 찾을 수 없음 */
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    AlREADY_REGISTER(404, "이미 등록된 회원입니다"),
    FOLDER_NOT_FOUND(404, "폴더를 찾을 수 없습니다"),
    ARTICLE_NOT_FOUND(404, "기사를 찾을 수 없습니다"),
    QUIZ_NOT_FOUND(404, "퀴즈가 없는 기사입니다."),
    SCRAP_NOT_FOUND(404, "스크랩을 찾을 수 없습니다"),
    MEMO_NOT_FOUND(404, "메모를 찾을 수 없습니다"),
    QUIZ_ALREADY_EXIST(404, "이미 퀴즈가 생성중 입니다."),
    QUIZ_ALREADY_ATTEMPT(404, "이미 퀴즈를 풀었습니다"),


    /* 500 */
    INTERNAL_SERVER_ERROR(500,"서버 에러"),
    JSON_PARSE_ERROR(500,"json 파싱 에러 입니다."),
    SOLAR_API_ERROR(500, "solar api 서비스의 문제가 발생했습니다"),
    NO_SUCH_PUBLIC_KEY(500, " kid 값이 일치하는 데이터가 없습니다."),
    NO_SUCH_RSA_ALGORITHM(500, "RSA 암호화 알고리즘을 지원하지 않는 환경입니다.");

    private final int status;
    private final String reason;
}