package io.ssafy.p.s12b201.techmate.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TechMateException extends RuntimeException{

    private ErrorCode errorCode;
}
