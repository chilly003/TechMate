package io.ssafy.p.s12b201.techmate.domain.article.exception;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class QuizNotFoundException extends TechMateException {

    public static final TechMateException EXCEPTION = new QuizNotFoundException();

    private QuizNotFoundException() {
        super(ErrorCode.QUIZ_NOT_FOUND);
    }
}
