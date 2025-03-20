package io.ssafy.p.s12b201.techmate.domain.scrap.presentation;

import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.request.CreateFolderRequest;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.request.UpdateFolderRequest;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response.FolderResponse;
import io.ssafy.p.s12b201.techmate.domain.scrap.presentation.dto.response.ScrapResponse;
import io.ssafy.p.s12b201.techmate.domain.scrap.service.ScrapService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/scraps")
@RequiredArgsConstructor
@RestController
public class ScrapController {

    private final ScrapService scrapService;

    @PostMapping("/{articleId}/folders/{folderId}")
    public ScrapResponse createScrap(
            @PathVariable Long articleId,
            @PathVariable Long folderId) {

        return scrapService.createScrap(articleId,folderId);
    }

    @DeleteMapping("/{scrapId}")
    public void deleteEssayScrap(@PathVariable("scrapId") Long scrapId) {
        scrapService.deleteScrap(scrapId);
    }

    @PostMapping("/folders")
    public FolderResponse createFolder(@RequestBody CreateFolderRequest folderRequest) {
       return scrapService.createFolder(folderRequest);
    }

    @DeleteMapping("/folders/{folderId}")
    public void deleteFolder(@PathVariable("folderId") Long folderId) {
        scrapService.deleteFolder(folderId);
    }

    @PatchMapping("/folders/{folderId}")
    public FolderResponse updateFolder(
            @PathVariable("folderId") Long folderId,
            @RequestBody UpdateFolderRequest updateFolderRequest) {

         return scrapService.updateFolder(folderId, updateFolderRequest);
    }

    @GetMapping("/folders")
    public Slice<FolderResponse> getFolders(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size) {

        PageRequest pageRequest = PageRequest.of(page, size);
        return scrapService.findAllFolder(pageRequest);
    }
}
