package io.ssafy.p.s12b201.techmate.domain.scrap.excepcion;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class ScrapNotFoundException extends TechMateException {

    public static final TechMateException EXCEPTION = new ScrapNotFoundException();

    private ScrapNotFoundException() {
        super(ErrorCode.SCRAP_NOT_FOUND);
    }
}
