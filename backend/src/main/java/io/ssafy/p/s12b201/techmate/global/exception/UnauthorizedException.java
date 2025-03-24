package io.ssafy.p.s12b201.techmate.global.exception;


import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class UnauthorizedException extends TechMateException {

    public static final TechMateException EXCEPTION = new UnauthorizedException();

    private UnauthorizedException() {
        super(ErrorCode.NECESSARY_LOGIN);
    }
}
