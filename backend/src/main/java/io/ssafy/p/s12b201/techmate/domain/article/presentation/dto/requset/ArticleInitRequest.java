package io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ArticleInitRequest {

    private List<Long> article_id;
}
