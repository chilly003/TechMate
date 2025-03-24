package io.ssafy.p.s12b201.techmate.domain.user.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum AccountRole {

    USER("USER"),
    ADMIN("ADMIN");

    private final String value;
}
