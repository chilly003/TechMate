package io.ssafy.p.s12b201.techmate.domain.scrap.excepcion;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class ScrapAlreadyExistsException extends TechMateException {
    public static final TechMateException EXCEPTION = new ScrapAlreadyExistsException();
    private ScrapAlreadyExistsException() {
        super(ErrorCode.SCRAP_AlREADY_EXIST);
    }
}
