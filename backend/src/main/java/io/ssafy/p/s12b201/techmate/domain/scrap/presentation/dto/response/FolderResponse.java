package io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Folder;
import lombok.Getter;
import java.time.LocalDateTime;


@Getter
public class FolderResponse {

    private Long folderId;
    private String folderName;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;

    public FolderResponse(Folder folder) {

        folderId = folder.getId();
        folderName = folder.getFolderName();
        createdAt = folder.getCreatedAt();
        lastModifiedAt = folder.getLastModifiedAt();
    }

}
