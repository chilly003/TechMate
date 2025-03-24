package io.ssafy.p.s12b201.techmate.domain.scrap.excepcion;


import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class NotMemoHostException extends TechMateException {

    public static final TechMateException EXCEPTION = new NotMemoHostException();
    private NotMemoHostException() {
        super(ErrorCode.MEMO_NOT_HOST);
    }
}
