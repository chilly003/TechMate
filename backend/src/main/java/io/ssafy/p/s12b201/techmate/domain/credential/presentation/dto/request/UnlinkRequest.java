package io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UnlinkRequest {

    private String accessToken;
}