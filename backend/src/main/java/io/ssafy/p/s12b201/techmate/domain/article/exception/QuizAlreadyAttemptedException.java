package io.ssafy.p.s12b201.techmate.domain.article.exception;

import io.ssafy.p.s12b201.techmate.global.error.exception.ErrorCode;
import io.ssafy.p.s12b201.techmate.global.error.exception.TechMateException;

public class QuizAlreadyAttemptedException extends TechMateException {

    public static final TechMateException EXCEPTION = new QuizAlreadyAttemptedException();

    private QuizAlreadyAttemptedException() {
        super(ErrorCode.QUIZ_ALREADY_ATTEMPT);
    }
}
