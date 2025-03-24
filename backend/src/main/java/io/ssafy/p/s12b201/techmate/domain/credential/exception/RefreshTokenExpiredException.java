package io.ssafy.p.s12b201.techmate.domain.credential.exception;


import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class RefreshTokenExpiredException extends TechMateException {

    public static final TechMateException EXCEPTION = new RefreshTokenExpiredException();

    private RefreshTokenExpiredException() {
        super(ErrorCode.REFRESH_TOKEN_EXPIRED_TOKEN);
    }
}
