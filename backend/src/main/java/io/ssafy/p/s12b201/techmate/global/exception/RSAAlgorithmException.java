package io.ssafy.p.s12b201.techmate.global.exception;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class RSAAlgorithmException extends TechMateException {

    public static final TechMateException EXCEPTION = new RSAAlgorithmException();

    private RSAAlgorithmException() {
        super(ErrorCode.NO_SUCH_RSA_ALGORITHM);
    }
}
