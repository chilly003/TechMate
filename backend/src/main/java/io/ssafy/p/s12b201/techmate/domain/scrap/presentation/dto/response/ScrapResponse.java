package io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class ScrapResponse {

    private Long scrapId;
    private Long articleId;
    private Long memoId;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;

    public ScrapResponse(Scrap scrap) {

        scrapId = scrap.getId();
        articleId = scrap.getArticleId();
        memoId = scrap.getMemo().getId();
        createdAt = scrap.getCreatedAt();
        lastModifiedAt = scrap.getLastModifiedAt();
    }

}
