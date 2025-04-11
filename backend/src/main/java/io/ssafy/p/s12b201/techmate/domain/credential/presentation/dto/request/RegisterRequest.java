package io.ssafy.p.s12b201.techmate.domain.credential.presentation.dto.request;

import io.ssafy.p.s12b201.techmate.domain.userpreference.presentation.dto.request.ArticleInitRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RegisterRequest {

    private String nickname;

    private String profilePath;

    private ArticleInitRequest articleInitRequest;

}
