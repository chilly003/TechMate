package io.ssafy.p.s12b201.techmate.global.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class OIDCKeysResponse {

    List<OIDCKeyDto> keys;
}
