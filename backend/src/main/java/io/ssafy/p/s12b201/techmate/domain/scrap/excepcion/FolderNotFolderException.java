package io.ssafy.p.s12b201.techmate.domain.scrap.excepcion;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class FolderNotFolderException extends TechMateException {
    public static final TechMateException EXCEPTION = new FolderNotFolderException();
    private FolderNotFolderException() {
        super(ErrorCode.FOLDER_NOT_FOUND);
    }
}
