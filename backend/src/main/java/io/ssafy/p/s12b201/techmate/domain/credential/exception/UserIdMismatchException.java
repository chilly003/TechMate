package io.ssafy.p.s12b201.techmate.domain.credential.exception;


import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class UserIdMismatchException extends TechMateException {

    public static final TechMateException EXCEPTION = new UserIdMismatchException();

    private UserIdMismatchException() {
        super(ErrorCode.MISMATCH_USER_OAUTH_ID);
    }

}
