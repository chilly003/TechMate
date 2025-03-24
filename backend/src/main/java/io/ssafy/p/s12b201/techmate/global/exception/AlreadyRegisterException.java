package io.ssafy.p.s12b201.techmate.global.exception;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class AlreadyRegisterException extends TechMateException {

    public static final TechMateException EXCEPTION = new AlreadyRegisterException();

    private AlreadyRegisterException() {
        super(ErrorCode.AlREADY_REGISTER);
    }
}
