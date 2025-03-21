package io.ssafy.p.s12b201.techmate.domain.scrap.excepcion;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class FolderNotFoundException extends TechMateException {
    public static final TechMateException EXCEPTION = new FolderNotFoundException();
    private FolderNotFoundException() {
        super(ErrorCode.FOLDER_NOT_FOUND);
    }
}
