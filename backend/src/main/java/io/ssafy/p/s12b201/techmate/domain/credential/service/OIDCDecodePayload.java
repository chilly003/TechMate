package io.ssafy.p.s12b201.techmate.domain.credential.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OIDCDecodePayload {

    private String iss;
    private String aud;
    private String sub;
    private String email;
    private String profile;
}