package io.ssafy.p.s12b201.techmate.domain.userpreference.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ArticleInitRequest {

    private List<Long> article_id;
}
