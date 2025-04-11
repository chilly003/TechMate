package io.ssafy.p.s12b201.techmate.domain.article.exception;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class QuizAlreadyExistsException extends TechMateException {

    public static final TechMateException EXCEPTION = new QuizAlreadyExistsException();

    private QuizAlreadyExistsException() {
        super(ErrorCode.QUIZ_ALREADY_EXIST);
    }
}
