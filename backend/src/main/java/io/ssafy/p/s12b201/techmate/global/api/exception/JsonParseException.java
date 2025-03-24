package io.ssafy.p.s12b201.techmate.global.api.exception;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class JsonParseException extends TechMateException {

    public static final TechMateException EXCEPTION = new JsonParseException();

    private JsonParseException() {
        super(ErrorCode.INVALID_TOKEN);
    }
}
