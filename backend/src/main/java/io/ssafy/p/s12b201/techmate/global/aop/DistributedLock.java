package io.ssafy.p.s12b201.techmate.global.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {
    String key(); // 락의 이름
    TimeUnit timeUnit() default TimeUnit.SECONDS; // 시간 단위
    long waitTime() default 5L; // 락 대기 시간 (기본 5초)
    long leaseTime() default 3L; // 락 임대 시간 (기본 3초)
}