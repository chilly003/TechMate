package io.ssafy.p.s12b201.techmate.global.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class OIDCKeyDto {

    private String kid;
    private String alg;
    private String use;
    private String n;
    private String e;
}
