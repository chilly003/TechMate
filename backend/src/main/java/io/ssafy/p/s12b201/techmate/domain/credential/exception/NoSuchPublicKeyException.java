package io.ssafy.p.s12b201.techmate.domain.credential.exception;


import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class NoSuchPublicKeyException extends TechMateException {

    public static final TechMateException EXCEPTION = new NoSuchPublicKeyException();

    private NoSuchPublicKeyException() {
        super(ErrorCode.NO_SUCH_PUBLIC_KEY);
    }
}
