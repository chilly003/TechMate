package io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Memo;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class MemoResponse {

    private Long folderId;
    private Long scrapId;
    private Long memoId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;

    public MemoResponse(Scrap scrap) {
        this.folderId = scrap.getFolder().getId();
        this.scrapId = scrap.getId();
        this.memoId = scrap.getMemo().getId();
        this.content = scrap.getMemo().getContent();
        this.createdAt = scrap.getMemo().getCreatedAt();
        this.lastModifiedAt = scrap.getMemo().getLastModifiedAt();
    }


}
