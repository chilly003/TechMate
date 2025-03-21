package io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Memo;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class MemoResponse {

    private Long memoId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;

    public MemoResponse(Memo memo) {
        this.memoId = memo.getId();
        this.content = memo.getContent();
        this.createdAt = memo.getCreatedAt();
        this.lastModifiedAt = memo.getLastModifiedAt();
    }


}
