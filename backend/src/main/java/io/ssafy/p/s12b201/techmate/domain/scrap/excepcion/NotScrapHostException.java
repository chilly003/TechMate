package io.ssafy.p.s12b201.techmate.domain.scrap.excepcion;


import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class NotScrapHostException extends TechMateException {

    public static final TechMateException EXCEPTION = new NotScrapHostException();
    private NotScrapHostException() {
        super(ErrorCode.SCRAP_NOT_HOST);
    }
}
