package io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class MemoResponse {

    private Long scrapId;
    private Long memoId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;

    public MemoResponse(Scrap scrap) {
        this.scrapId = scrap.getId();
        this.memoId = scrap.getMemo().getId();
        this.content = scrap.getMemo().getContent();
        this.createdAt = scrap.getMemo().getCreatedAt();
        this.lastModifiedAt = scrap.getMemo().getLastModifiedAt();
    }
}
