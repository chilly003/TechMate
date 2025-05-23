package io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CheckRegisteredResponse {

    private Boolean isRegistered;
    private String idToken;
}