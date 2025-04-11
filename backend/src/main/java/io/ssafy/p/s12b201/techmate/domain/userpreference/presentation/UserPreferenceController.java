package io.ssafy.p.s12b201.techmate.domain.userpreference.presentation;

import io.ssafy.p.s12b201.techmate.domain.userpreference.presentation.dto.request.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleCardResponse;
import io.ssafy.p.s12b201.techmate.domain.userpreference.service.UserPreferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/user-preference")
@RequiredArgsConstructor
@RestController
@Slf4j
public class UserPreferenceController {

    private final UserPreferenceService userPreferenceService;

    // 선호 기사 조회 (콜드 스타트 시 사용)
    @GetMapping("/random")
    public List<ArticleCardResponse> getRandomArticles() {
        return userPreferenceService.getRandomArticles();
    }

    // 선호 기사 등록 (콜드 스타트 시 사용)
    @PostMapping("/random")
    public void initializeArticles(@RequestBody ArticleInitRequest request) {
        userPreferenceService.initializeArticles(request);
    }
}
