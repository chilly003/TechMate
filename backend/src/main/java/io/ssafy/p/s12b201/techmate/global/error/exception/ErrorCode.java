package io.ssafy.p.s12b201.techmate.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /* 400 */

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */

    /* 403 UNAUTHORIZED : 인가되지 않은 사용자 */

    /* 404 NOT_FOUND : Resource를 찾을 수 없음 */
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),

    /* 500 */
    INTERNAL_SERVER_ERROR(500,"서버 에러");

    private final int status;
    private final String reason;
}